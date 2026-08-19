import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MoreVertical, 
  Smile, 
  Plus, 
  Send, 
  Anchor,
  ShoppingBag,
  Store,
  CheckCheck,
  Star,
  Zap,
  Truck,
  ShieldCheck,
  ShoppingCart,
  ChevronRight,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { productService } from '../services/productService';
import { chatService } from '../services/chatService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [chatInputText, setChatInputText] = useState('');
  const [showProductPickerModal, setShowProductPickerModal] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);

  const activeThread = chatService.getActiveUserThread(user);
  const [chatMessages, setChatMessages] = useState(activeThread.messages);
  const [hasAddedUrlProduct, setHasAddedUrlProduct] = useState(false);

  useEffect(() => {
    // Subscribe to chatService updates
    setChatMessages(chatService.getActiveUserThread(user).messages);
    const unsubscribe = chatService.subscribe(() => {
      setChatMessages(chatService.getActiveUserThread(user).messages);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    productService.getProducts().then(list => {
      if (list) setCatalogProducts(list);
      if (productId && !hasAddedUrlProduct) {
        const found = list.find(p => String(p.id) === String(productId));
        if (found) {
          setHasAddedUrlProduct(true);
          chatService.sendMessage(activeThread.id, user, {
            sender: 'buyer',
            product: found
          });
        }
      }
    });
  }, [productId, hasAddedUrlProduct, user]);

  // Handle Attachment Image Upload via Plus (+) button
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      chatService.sendMessage(activeThread.id, user, {
        sender: 'buyer',
        image: event.target.result
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Product Tag Selection via ShoppingBag button (appends NEW product card bubble to chat stream)
  const handleSendProductToChat = (targetProduct) => {
    setShowProductPickerModal(false);
    chatService.sendMessage(activeThread.id, user, {
      sender: 'buyer',
      product: targetProduct
    });
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || chatInputText;
    if (!text.trim()) return;

    chatService.sendMessage(activeThread.id, user, {
      sender: 'buyer',
      text: text.trim()
    });

    if (!textToSend) setChatInputText('');
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, 1);
      navigate('/checkout');
    }
  };

  return (
    <div style={{ 
      background: '#f3f4f6', 
      width: '100%',
      maxWidth: '850px', 
      margin: '0 auto', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      
      {/* ================= SHOPEE TOP NAVIGATION HEADER ================= */}
      <div style={{
        background: '#ffffff',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
          {/* Back Arrow */}
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ee4d2d', display: 'flex', alignItems: 'center' }}
            title="Kembali"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Store Avatar with LIVE Badge */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #ee4d2d 0%, #ff7337 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#fff', 
              padding: '2px',
              border: '2px solid #ee4d2d'
            }}>
              <Anchor size={22} color="#fff" />
            </div>
            <span style={{ 
              position: 'absolute', 
              bottom: '-3px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              background: '#ee4d2d', 
              color: '#fff', 
              fontSize: '0.55rem', 
              fontWeight: '900', 
              padding: '0 4px', 
              borderRadius: '8px', 
              lineHeight: 1.3 
            }}>
              LIVE
            </span>
          </div>

          {/* Store Name & Subtitle Badges */}
          <div style={{ overflow: 'hidden' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Berkah Pancing Official Shop
            </h3>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> Online
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: '#4b5563' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#4b5563' }}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>



      {/* ================= CHAT BODY SCROLL STREAM ================= */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '12px 14px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '14px',
        paddingBottom: '130px'
      }}>

        {/* DYNAMIC CHAT MESSAGES STREAM */}
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'buyer' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.product ? (
              /* Product Tag Card Bubble (Appended on Tag & Kirim or URL navigation) */
              <div style={{ 
                background: '#ffffff', 
                borderRadius: msg.sender === 'buyer' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', 
                padding: '12px', 
                border: '1px solid #e5e7eb', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%'
              }}>
                <div 
                  onClick={() => navigate(`/products/${msg.product.id}`)}
                  style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'center' }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                    <img src={msg.product.image} alt={msg.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {msg.product.name}
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ee4d2d', marginTop: '4px' }}>
                      {productService.formatIDR(msg.product.price)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
                  <button 
                    onClick={() => addToCart(msg.product, 1)}
                    style={{ 
                      background: '#fff1f0', 
                      color: '#ee4d2d', 
                      border: '1px solid #ffccc7', 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '6px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: 'pointer' 
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(msg.product, 1);
                      navigate('/checkout');
                    }}
                    style={{ 
                      flex: 1, 
                      background: '#ee4d2d', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      fontSize: '0.84rem', 
                      fontWeight: '800', 
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(238,77,45,0.3)'
                    }}
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            ) : msg.image ? (
              <div 
                style={{
                  background: '#ffffff',
                  padding: '6px',
                  borderRadius: msg.sender === 'buyer' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <img src={msg.image} alt="Lampiran Foto" style={{ maxWidth: '220px', maxHeight: '220px', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
            ) : (
              <div 
                style={{
                  background: msg.sender === 'buyer' ? '#ee4d2d' : '#ffffff',
                  color: msg.sender === 'buyer' ? '#ffffff' : '#1f2937',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'buyer' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.text}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', fontSize: '0.68rem', color: '#9ca3af' }}>
              <span>{msg.time}</span>
              {msg.sender === 'buyer' && <CheckCheck size={14} color="#10b981" />}
            </div>
          </div>
        ))}

      </div>

      {/* Hidden File Input for Plus (+) Attachment Button */}
      <input 
        type="file" 
        id="chat-file-input" 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleImageUpload} 
      />

      {/* ================= SHOPEE BOTTOM NAVIGATION BAR ================= */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        maxWidth: '850px', 
        background: '#ffffff', 
        borderTop: '1px solid #e5e7eb', 
        zIndex: 30 
      }}>
        
        {/* Quick Action Pill Buttons (Horizontal Scrollable Strip) */}
        <div className="single-line-tabs hide-scrollbar" style={{ padding: '8px 12px', display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid #f3f4f6' }}>
          {[
            { label: 'Apakah produk masih ada?', text: 'Hai, apakah produk ini masih ada?' },
            { label: 'Bisa dikirim hari ini?', text: 'Hai, apakah pesanan bisa dikirim hari ini?' },
            { label: 'Terima kasih!', text: 'Terima kasih atas informasinya!' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.text)}
              style={{
                background: '#ffffff',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#ee4d2d';
                e.currentTarget.style.color = '#ee4d2d';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#4b5563';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Plus, ShoppingBag, Input Pill, Smiley */}
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* (+) Button: Upload Image */}
          <button 
            onClick={() => document.getElementById('chat-file-input').click()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', display: 'flex', alignItems: 'center' }} 
            title="Kirim Foto/Lampiran"
          >
            <Plus size={24} />
          </button>

          {/* (🛍️) Button: Select Product */}
          <button 
            onClick={() => setShowProductPickerModal(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', display: 'flex', alignItems: 'center' }} 
            title="Pilih & Tag Produk"
          >
            <ShoppingBag size={21} />
          </button>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <input 
              type="text"
              placeholder="Tulis Pesan..."
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 38px 9px 14px',
                borderRadius: '20px',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#f9fafb',
                color: '#111827'
              }}
            />
            <button 
              type="button"
              style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
            >
              <Smile size={20} />
            </button>
          </form>

          {/* Send Button */}
          {chatInputText.trim() && (
            <button 
              onClick={() => handleSendMessage()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ee4d2d',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(238,77,45,0.4)',
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          )}
        </div>

      </div>

      {/* ================= PRODUCT PICKER MODAL SHEET ================= */}
      {showProductPickerModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={() => setShowProductPickerModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '75vh',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '1.25rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
              animation: 'slideUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} color="#ee4d2d" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                  Pilih Produk Berkah Pancing
                </h3>
              </div>
              <button 
                onClick={() => setShowProductPickerModal(false)}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Product List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {catalogProducts.map((p) => (
                <div 
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    transition: 'all 0.15s'
                  }}
                >
                  <img src={p.image} alt={p.name} style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ee4d2d', marginTop: '2px' }}>
                      {productService.formatIDR(p.price)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendProductToChat(p)}
                    style={{
                      background: '#ee4d2d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(238,77,45,0.3)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Tag & Kirim
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;
