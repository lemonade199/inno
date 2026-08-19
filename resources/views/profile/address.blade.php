<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Ubah Lokasi - Berkah Pancing</title>

    <!-- Leaflet.js CSS CDN -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />

    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
        
        /* Backdrop Background matching Profile page screenshot */
        body { 
            background: rgba(15, 23, 42, 0.65); 
            backdrop-filter: blur(4px);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        /* Modal Overlay Container */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.54);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        /* Modal Main Box */
        .modal-box {
            background: #ffffff;
            border-radius: 12px;
            max-width: 680px;
            width: 100%;
            height: 84vh;
            max-height: 640px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        /* Modal Header */
        .modal-header {
            padding: 1.25rem 1.5rem 0.85rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            border-bottom: 1px solid #f1f5f9;
        }

        .modal-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #222222;
        }

        .btn-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #757575;
            padding: 4px 8px;
            font-size: 1.2rem;
            line-height: 1;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .btn-close:hover { background: #f1f5f9; color: #000; }

        /* Top Address Input Preview Box */
        .address-preview-container {
            padding: 0.85rem 1.5rem;
            background: #ffffff;
        }

        .address-input-box {
            width: 100%;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 10px 14px;
            font-size: 0.88rem;
            color: #334155;
            outline: none;
            transition: border-color 0.2s;
        }
        .address-input-box:focus {
            border-color: #ee4d2d;
            background: #ffffff;
        }

        /* Leaflet Map Wrapper */
        .map-wrapper {
            flex: 1;
            position: relative;
            background: #e5e3df;
            overflow: hidden;
        }

        #leaflet-map {
            width: 100%;
            height: 100%;
            position: absolute;
            inset: 0;
            z-index: 1;
        }

        /* Floating Prompt Banner Top Center */
        .map-prompt-banner {
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 30;
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            font-size: 0.82rem;
            padding: 6px 16px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            pointer-events: none;
            font-weight: 500;
        }

        /* Central Fixed Pin Tooltip & Badge */
        .center-pin-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            z-index: 35;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .pin-badge {
            background: #ee4d2d;
            color: #ffffff;
            font-size: 0.78rem;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(238, 77, 45, 0.45);
            white-space: nowrap;
            position: relative;
            margin-bottom: 6px;
        }

        .pin-badge::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #ee4d2d;
        }

        .pin-icon {
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            background: #ea4335;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(234, 67, 53, 0.5);
        }

        .pin-icon-inner {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ffffff;
            transform: rotate(45deg);
        }

        /* Map Controls Bottom Right (Target & Zoom) */
        .map-controls-group {
            position: absolute;
            bottom: 35px;
            right: 16px;
            z-index: 35;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .btn-control {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            cursor: pointer;
            color: #ee4d2d;
            font-size: 1.1rem;
            transition: background 0.2s;
        }
        .btn-control:hover { background: #f8fafc; }

        .zoom-box {
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
        }

        .btn-zoom {
            border: none;
            background: none;
            padding: 8px 12px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            color: #555555;
            transition: background 0.2s;
        }
        .btn-zoom:hover { background: #f8fafc; }

        /* OSM Attribution Bar */
        .osm-attribution-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.92);
            padding: 4px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.68rem;
            color: #555555;
            z-index: 35;
        }

        /* Modal Footer */
        .modal-footer {
            padding: 0.85rem 1.5rem;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 12px;
            background: #ffffff;
            border-top: 1px solid #f1f5f9;
        }

        .btn-cancel {
            background: none;
            border: none;
            color: #555555;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            padding: 9px 20px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .btn-cancel:hover { background: #f1f5f9; }

        .btn-confirm-shopee {
            background: #ee4d2d;
            color: #ffffff;
            border: none;
            padding: 9px 36px;
            border-radius: 4px;
            font-size: 0.88rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(238, 77, 45, 0.3);
            transition: background 0.2s;
        }
        .btn-confirm-shopee:hover {
            background: #d73211;
        }
        .btn-confirm-shopee:disabled {
            background: #cbd5e1;
            color: #94a3b8;
            cursor: not-allowed;
            box-shadow: none;
        }

        /* Toast Alert Notification */
        .toast-alert {
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 50;
            padding: 8px 18px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .toast-alert.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .toast-alert.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    </style>
</head>
<body>

<div class="modal-overlay">
    <div class="modal-box">
        <!-- Toast Notification -->
        <div id="toast-alert" class="toast-alert"></div>

        <!-- Header -->
        <div class="modal-header">
            <h3 class="modal-title">Ubah Lokasi</h3>
            <button type="button" class="btn-close" onclick="history.back()" title="Tutup Modal">✕</button>
        </div>

        <!-- Address Preview Input Field -->
        <div class="address-preview-container">
            <input 
                type="text" 
                id="address-input" 
                class="address-input-box" 
                value="{{ is_object($user) && isset($user->address) ? $user->address : 'Jln, cibiru hilir rt02 rw03 desa cibiru hilir kecamatan cileunyi kabupaten bandung' }}"
                placeholder="Memuat alamat lokasi..."
            />
        </div>

        <!-- Leaflet Map Wrapper -->
        <div class="map-wrapper">
            <div id="leaflet-map"></div>

            <!-- Floating Top Tip Banner -->
            <div class="map-prompt-banner">
                Geser peta untuk memilih titik lokasi alamatmu
            </div>

            <!-- Fixed Center Red Marker Pin -->
            <div class="center-pin-container">
                <div class="pin-badge">
                    Alamatmu di sini
                </div>
                <div class="pin-icon">
                    <div class="pin-icon-inner"></div>
                </div>
            </div>

            <!-- Controls: Reset & Zoom -->
            <div class="map-controls-group">
                <button type="button" class="btn-control" id="btn-reset-center" title="Reset Lokasi Ke Center">
                    🎯
                </button>
                <div class="zoom-box">
                    <button type="button" class="btn-zoom" id="btn-zoom-in" title="Zoom In">+</button>
                    <div style="height: 1px; background: #eee;"></div>
                    <button type="button" class="btn-zoom" id="btn-zoom-out" title="Zoom Out">-</button>
                </div>
            </div>

            <!-- OpenStreetMap Bottom Attribution Bar -->
            <div class="osm-attribution-bar">
                <strong style="font-size: 0.75rem; color: #444;">OpenStreetMap</strong>
                <div style="display: flex; gap: 10px;">
                    <span>© OpenStreetMap contributors</span>
                    <span>Data peta real-time</span>
                </div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
            <button type="button" class="btn-cancel" onclick="history.back()">Nanti Saja</button>
            <button type="button" id="btn-confirm" class="btn-confirm-shopee" onclick="confirmAndSaveLocation()">Konfirmasi</button>
        </div>
    </div>
</div>

<!-- Leaflet.js JS CDN -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>

<script>
    // Initial Coordinates (Default to Cibiru, Bandung if null)
    let currentLat = {{ is_object($user) && !empty($user->latitude) ? $user->latitude : -6.9388 }};
    let currentLng = {{ is_object($user) && !empty($user->longitude) ? $user->longitude : 107.7183 }};
    let currentAddress = "{{ e(is_object($user) && !empty($user->address) ? $user->address : 'Jln, cibiru hilir rt02 rw03 desa cibiru hilir kecamatan cileunyi kabupaten bandung') }}";

    const addressInput = document.getElementById('address-input');
    const btnConfirm = document.getElementById('btn-confirm');
    const toastAlert = document.getElementById('toast-alert');

    // Initialize Leaflet Map centered on initial coordinates
    const map = L.map('leaflet-map', {
        zoomControl: false // Custom zoom controls
    }).setView([currentLat, currentLng], 16);

    // Add OpenStreetMap Official Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Reverse Geocoding when user drags map (center point changes)
    let geocodeTimeout;
    map.on('move', function() {
        addressInput.value = '⏳ Memuat lokasi...';
        btnConfirm.disabled = true;
    });
    map.on('moveend', function() {
        const center = map.getCenter();
        currentLat = parseFloat(center.lat.toFixed(7));
        currentLng = parseFloat(center.lng.toFixed(7));

        clearTimeout(geocodeTimeout);
        addressInput.value = '⏳ Memuat detail alamat...';
        btnConfirm.disabled = true;

        geocodeTimeout = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLng}&zoom=18&addressdetails=1`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.display_name) {
                        currentAddress = data.display_name;
                        addressInput.value = currentAddress;
                    } else {
                        currentAddress = `Lokasi (${currentLat}, ${currentLng})`;
                        addressInput.value = currentAddress;
                    }
                    btnConfirm.disabled = false;
                })
                .catch(err => {
                    console.error("Geocode error:", err);
                    currentAddress = `Lokasi (${currentLat}, ${currentLng})`;
                    addressInput.value = currentAddress;
                    btnConfirm.disabled = false;
                });
        }, 400);
    });

    // Custom Map Control Listeners
    document.getElementById('btn-reset-center').addEventListener('click', function() {
        map.setView([-6.9388, 107.7183], 16);
    });

    document.getElementById('btn-zoom-in').addEventListener('click', function() {
        map.zoomIn();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', function() {
        map.zoomOut();
    });

    // Confirm & Save Location AJAX POST
    function confirmAndSaveLocation() {
        const addressToSave = addressInput.value.trim() || currentAddress;

        btnConfirm.disabled = true;
        btnConfirm.innerText = 'Menyimpan...';

        fetch('/api/user/location/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                address: addressToSave,
                latitude: currentLat,
                longitude: currentLng
            })
        })
        .then(res => res.json())
        .then(data => {
            btnConfirm.disabled = false;
            btnConfirm.innerText = 'Konfirmasi';

            if (data.success) {
                showToast('success', '✓ Alamat berhasil dikonfirmasi dan disimpan.');
            } else {
                showToast('error', 'Gagal menyimpan: ' + (data.message || 'Terjadi kesalahan.'));
            }
        })
        .catch(err => {
            btnConfirm.disabled = false;
            btnConfirm.innerText = 'Konfirmasi';
            showToast('error', 'Error: ' + err.message);
        });
    }

    function showToast(type, msg) {
        toastAlert.className = 'toast-alert ' + type;
        toastAlert.innerText = msg;
        toastAlert.style.display = 'block';
        setTimeout(() => {
            toastAlert.style.display = 'none';
        }, 4000);
    }
</script>

</body>
</html>
