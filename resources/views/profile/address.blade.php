<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Konfirmasi Lokasi Alamat - Profil Pengguna</title>
    
    <!-- Leaflet.js CSS CDN -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />

    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
        body { background-color: #f8fafc; color: #334155; padding: 2rem 1rem; }
        .container { max-width: 880px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 2rem; }
        h2 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: 1.25rem; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; margin-bottom: 1.25rem; }
        .status-badge.pending { background: #fef3c7; color: #d97706; }
        .status-badge.selected { background: #e0f2fe; color: #0284c7; }
        .status-badge.loading { background: #f3e8ff; color: #7e22ce; }
        .status-badge.saved { background: #dcfce7; color: #15803d; }
        
        .preview-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
        .preview-box label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #64748b; display: block; margin-bottom: 4px; }
        .preview-address { font-size: 1rem; font-weight: 600; color: #1e293b; min-height: 1.5rem; line-height: 1.4; }
        .preview-coords { font-size: 0.85rem; color: #64748b; margin-top: 6px; }

        #profile-map { width: 100%; height: 380px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 1.25rem; z-index: 1; }
        
        .btn-confirm { background: #ee4d2d; color: #ffffff; font-weight: 700; padding: 0.85rem 2rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-confirm:hover:not(:disabled) { background: #d73211; transform: translateY(-1px); }
        .btn-confirm:disabled { background: #cbd5e1; color: #94a3b8; cursor: not-allowed; }
        
        .alert-notification { padding: 1rem 1.25rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; margin-bottom: 1.25rem; display: none; }
        .alert-notification.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .alert-notification.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    </style>
</head>
<body>

<div class="container">
    <h2>Pilih & Konfirmasi Lokasi Alamat</h2>

    <!-- Alert Notifikasi Berhasil / Error -->
    <div id="alert-notification" class="alert-notification"></div>

    <!-- Badge Status Realtime -->
    <div id="status-badge" class="status-badge pending">
        <span id="status-text">Lokasi Belum Dikonfirmasi</span>
    </div>

    <!-- PREVIEW LOKASI TERAKHIR YANG DIPILIH -->
    <div class="preview-box">
        <label>Lokasi yang Dipilih (Preview Realtime):</label>
        <div id="preview-address-text" class="preview-address">
            {{ is_object($user) && isset($user->address) ? $user->address : 'Silakan geser atau klik pada peta untuk memilih lokasi...' }}
        </div>
        <div class="preview-coords">
            Latitude: <strong id="preview-lat">{{ is_object($user) && isset($user->latitude) ? $user->latitude : '-6.9388' }}</strong> | 
            Longitude: <strong id="preview-lng">{{ is_object($user) && isset($user->longitude) ? $user->longitude : '107.7183' }}</strong>
        </div>
    </div>

    <!-- PETA LEAFLET INTERAKTIF -->
    <label style="font-size: 0.88rem; font-weight: 600; color: #475569; display: block; margin-bottom: 0.5rem;">
        Peta OpenStreetMap (Marker Draggable / Klik Peta)
    </label>
    <div id="profile-map"></div>

    <!-- TOMBOL KONFIRMASI ALAMAT (Hanya tombol ini yang memperbarui Database) -->
    <button type="button" id="btn-confirm" class="btn-confirm" onclick="confirmAndSaveLocation()">
        ✓ Konfirmasi Alamat
    </button>
</div>

<!-- Leaflet.js JS CDN -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>

<script>
    // -------------------------------------------------------------
    // STATE TERKONFIRMASI (Tersimpan di Database)
    // -------------------------------------------------------------
    let confirmedLatitude = {{ is_object($user) && !empty($user->latitude) ? $user->latitude : -6.9388 }};
    let confirmedLongitude = {{ is_object($user) && !empty($user->longitude) ? $user->longitude : 107.7183 }};
    let confirmedAddress = "{{ e(is_object($user) && !empty($user->address) ? $user->address : 'Cibiru Hilir, Cileunyi, Bandung') }}";

    // -------------------------------------------------------------
    // STATE SEMENTARA (FRONTEND ONLY - TIDAK MENGUBAH DATABASE)
    // -------------------------------------------------------------
    let selectedLatitude = confirmedLatitude;
    let selectedLongitude = confirmedLongitude;
    let selectedAddress = confirmedAddress;
    let isGeocoding = false;

    // Elements DOM Reference
    const previewAddressElem = document.getElementById('preview-address-text');
    const previewLatElem = document.getElementById('preview-lat');
    const previewLngElem = document.getElementById('preview-lng');
    const btnConfirm = document.getElementById('btn-confirm');
    const alertElem = document.getElementById('alert-notification');

    // 1. Inisialisasi Peta Leaflet
    const map = L.map('profile-map').setView([selectedLatitude, selectedLongitude], 16);

    // 2. OpenStreetMap Official Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 3. Marker Draggable Interaktif
    const marker = L.marker([selectedLatitude, selectedLongitude], { draggable: true }).addTo(map);
    marker.bindPopup("<b>Lokasi yang Dipilih</b><br>Geser pin atau klik peta untuk memperbarui preview.").openPopup();

    // 4. Event Handler saat Marker Selesai Diseret (dragend)
    // CATATAN KUNCI: Event ini HANYA mengubah state sementara JS & melakukan Reverse Geocoding. TIDAK MENGIRIM POST/UPDATE DATABASE!
    marker.on('dragend', function (e) {
        const pos = marker.getLatLng();
        onLocationChanged(pos.lat, pos.lng);
    });

    // 5. Event Handler saat Klik Langsung pada Peta
    // CATATAN KUNCI: Event ini HANYA mengubah state sementara JS & melakukan Reverse Geocoding. TIDAK MENGIRIM POST/UPDATE DATABASE!
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        onLocationChanged(e.latlng.lat, e.latlng.lng);
    });

    // Fungsi Pembantu saat Lokasi Berubah (Perbarui State Sementara & Trigger Reverse Geocoding)
    function onLocationChanged(lat, lng) {
        selectedLatitude = parseFloat(lat.toFixed(7));
        selectedLongitude = parseFloat(lng.toFixed(7));
        
        previewLatElem.innerText = selectedLatitude;
        previewLngElem.innerText = selectedLongitude;
        
        setStatus('loading', '⏳ Mengambil alamat lokasi...');
        btnConfirm.disabled = true;
        
        // Panggil Reverse Geocoding Nominatim OpenStreetMap
        reverseGeocode(selectedLatitude, selectedLongitude);
    }

    // Reverse Geocoding (Nominatim OpenStreetMap)
    let reverseGeocodeTimer;
    function reverseGeocode(lat, lng) {
        clearTimeout(reverseGeocodeTimer);
        reverseGeocodeTimer = setTimeout(() => {
            isGeocoding = true;
            previewAddressElem.innerHTML = '<i>Sedang memuat alamat lokasi...</i>';

            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
                .then(res => res.json())
                .then(data => {
                    isGeocoding = false;
                    if (data && data.display_name) {
                        selectedAddress = data.display_name;
                        previewAddressElem.innerText = selectedAddress;
                        setStatus('selected', 'Lokasi Baru Dipilih (Belum Dikonfirmasi)');
                        btnConfirm.disabled = false; // Aktifkan tombol konfirmasi
                    } else {
                        // Jika reverse geocoding gagal, gunakan fallback koordinat tanpa merusak alamat lama
                        selectedAddress = `Lokasi Koordinat (${lat}, ${lng})`;
                        previewAddressElem.innerText = selectedAddress;
                        setStatus('selected', 'Lokasi Koordinat Dipilih');
                        btnConfirm.disabled = false;
                    }
                })
                .catch(err => {
                    isGeocoding = false;
                    console.error("Reverse Geocoding Error:", err);
                    selectedAddress = `Lokasi Koordinat (${lat}, ${lng})`;
                    previewAddressElem.innerText = selectedAddress;
                    btnConfirm.disabled = false;
                    setStatus('selected', 'Lokasi Koordinat Dipilih');
                });
        }, 400); // 400ms Debounce
    }

    function setStatus(type, text) {
        const badge = document.getElementById('status-badge');
        badge.className = 'status-badge ' + type;
        document.getElementById('status-text').innerText = text;
    }

    // -------------------------------------------------------------
    // EKSEKUSI PENYIMPANAN HANYA SAAT TOMBOL "KONFIRMASI ALAMAT" DITEKAN
    // -------------------------------------------------------------
    function confirmAndSaveLocation() {
        if (isGeocoding || !selectedAddress) {
            alert("Harap tunggu hingga alamat preview selesai dimuat.");
            return;
        }

        btnConfirm.disabled = true;
        btnConfirm.innerText = '⌛ Menyimpan ke Database...';
        alertElem.style.display = 'none';

        // Mengirim HANYA data lokasi TERAKHIR yang sedang aktif di marker
        fetch('/api/user/location/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                address: selectedAddress,       // Alamat terakhir yang dipilih
                latitude: selectedLatitude,     // Latitude terakhir yang dipilih
                longitude: selectedLongitude    // Longitude terakhir yang dipilih
            })
        })
        .then(res => res.json())
        .then(data => {
            btnConfirm.disabled = false;
            btnConfirm.innerText = '✓ Konfirmasi Alamat';

            if (data.success) {
                // Perbarui State Terkonfirmasi dengan Data yang Berhasil Disimpan
                confirmedLatitude = selectedLatitude;
                confirmedLongitude = selectedLongitude;
                confirmedAddress = selectedAddress;

                setStatus('saved', '✓ Alamat Berhasil Dikonfirmasi & Tersimpan');
                
                showAlert('success', 'Alamat berhasil dikonfirmasi dan disimpan.');
            } else {
                showAlert('error', 'Gagal menyimpan: ' + (data.message || 'Terjadi kesalahan pada server.'));
                setStatus('selected', 'Gagal Menyiapkan Konfirmasi');
            }
        })
        .catch(err => {
            btnConfirm.disabled = false;
            btnConfirm.innerText = '✓ Konfirmasi Alamat';
            showAlert('error', 'Error Jaringan: ' + err.message);
        });
    }

    function showAlert(type, msg) {
        alertElem.className = 'alert-notification ' + type;
        alertElem.innerText = msg;
        alertElem.style.display = 'block';
        setTimeout(() => {
            alertElem.style.display = 'none';
        }, 5000);
    }
</script>

</body>
</html>
