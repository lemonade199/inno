import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  User, 
  Search, 
  CheckCheck, 
  ShoppingBag, 
  Clock, 
  Filter, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Smile,
  Plus
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { productService } from '../../services/productService';

const AdminChat = () => {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState('thread-1');
  const [replyInputText, setReplyInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to live chat updates
  useEffect(() => {
    setThreads(chatService.getThreads());
    const unsubscribe = chatService.subscribe((updatedThreads) => {
      setThreads(updatedThreads);
    });
    return () => unsubscribe();
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSelectThread = (threadId) => {
    setActiveThreadId(threadId);
    chatService.markAsRead(threadId);
  };

  const handleAdminReply = (e) => {
    if (e) e.preventDefault();
    if (!replyInputText.trim() || !activeThread) return;

    chatService.sendMessage(activeThread.id, null, {
      sender: 'seller',
      text: replyInputText.trim()
    });

    setReplyInputText('');
  };

  const handleSendQuickTemplate = (templateText) => {
    if (!activeThreadId) return;
    chatService.sendMessage(activeThreadId, {
      sender: 'seller',
      text: templateText
    });
  };

  const filteredThreads = threads.filter((t) => 
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  return (
    <div style={{ 
      width: '100%', 
      height: 'calc(100vh - 70px)', 
      display: 'grid', 
      gridTemplateColumns: '340px 1fr', 
      background: '#ffffff',
      overflow: 'hidden'
    }}>
        
        {/* LEFT PANEL: CUSTOMER THREADS LIST */}
        <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#f8fafc', height: '100%', overflow: 'hidden' }}>
          
          {/* Search Thread Bar */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Cari nama / email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
            </div>
          </div>

          {/* Threads List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredThreads.map((t) => {
              const isActive = t.id === activeThreadId;
              const lastMsg = t.messages[t.messages.length - 1];
              return (
                <div 
                  key={t.id}
                  onClick={() => handleSelectThread(t.id)}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid #f1f5f9',
                    background: isActive ? '#ffffff' : 'transparent',
                    borderLeft: isActive ? '4px solid #00a896' : '4px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={t.customerAvatar} alt={t.customerName} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                    {t.unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.unreadCount}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: isActive ? '800' : '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.customerName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {t.lastUpdated}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: t.unreadCount > 0 ? '#0f172a' : '#64748b', fontWeight: t.unreadCount > 0 ? '700' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {lastMsg?.text || (lastMsg?.product ? `📌 Tagged: ${lastMsg.product.name}` : 'Foto Lampiran')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: ACTIVE THREAD CONVERSATION STREAM */}
        {activeThread ? (
          <div style={{ display: 'flex', flexDirection: 'column', background: '#f1f5f9', height: '100%', overflow: 'hidden' }}>
            
            {/* Active Thread Header */}
            <div style={{ padding: '12px 20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={activeThread.customerAvatar} alt={activeThread.customerName} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      {activeThread.customerName}
                    </h3>
                    <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      Pelanggan Setia
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    {activeThread.customerEmail}
                  </div>
                </div>
              </div>

            </div>

            {/* Messages Scroll Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeThread.messages.map((msg) => (
                <div 
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === 'seller' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'seller' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {msg.product ? (
                    <div style={{ background: '#ffffff', borderRadius: '12px', padding: '12px', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '100%' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#00a896', textTransform: 'uppercase', marginBottom: '6px' }}>
                        📌 Produk Yang Ditanyakan Pelanggan
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <img src={msg.product.image} alt={msg.product.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{msg.product.name}</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ee4d2d', marginTop: '2px' }}>{productService.formatIDR(msg.product.price)}</div>
                        </div>
                      </div>
                    </div>
                  ) : msg.image ? (
                    <div style={{ background: '#ffffff', padding: '6px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                      <img src={msg.image} alt="Lampiran Foto" style={{ maxWidth: '220px', maxHeight: '220px', borderRadius: '8px', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div 
                      style={{
                        background: msg.sender === 'seller' ? '#00a896' : '#ffffff',
                        color: msg.sender === 'seller' ? '#ffffff' : '#0f172a',
                        padding: '12px 16px',
                        borderRadius: msg.sender === 'seller' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        fontSize: '0.86rem',
                        lineHeight: 1.55,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {msg.text}
                    </div>
                  )}

                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{msg.time}</span>
                    {msg.sender === 'seller' && <CheckCheck size={14} color="#00a896" />}
                  </div>
                </div>
              ))}
            </div>



            {/* Admin Reply Input Box */}
            <form 
              onSubmit={handleAdminReply}
              style={{ background: '#ffffff', padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}
            >
              <input 
                type="text" 
                placeholder={`Balas pesan ke ${activeThread.customerName}...`}
                value={replyInputText}
                onChange={(e) => setReplyInputText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '24px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              />
              <button 
                type="submit"
                disabled={!replyInputText.trim()}
                style={{
                  background: replyInputText.trim() ? '#00a896' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '24px',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  cursor: replyInputText.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: replyInputText.trim() ? '0 4px 12px rgba(0,168,150,0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={16} /> Balas
              </button>
            </form>

          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            Pilih percakapan pelanggan untuk mulai membalas chat.
          </div>
        )}

    </div>
  );
};

export default AdminChat;
