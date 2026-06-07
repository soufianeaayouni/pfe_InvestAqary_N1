import { useState, useEffect, useRef } from 'react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../data/apiService';

export default function ChatModal() {
  const { isChatModalOpen, chatModalData, closeChatModal } = useModal();
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatModalOpen && chatModalData?.proId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isChatModalOpen, chatModalData]);

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    if (!chatModalData?.proId) return;
    try {
      // Find conversation first
      const convRes = await apiService.get('/conversations');
      if (convRes.success) {
        const existingConv = convRes.data.find((c: any) => 
          c.sender_id === chatModalData.proId || c.receiver_id === chatModalData.proId
        );
        
        if (existingConv) {
          setConversationId(existingConv.id);
          const msgRes = await apiService.get(`/conversations/${existingConv.id}/messages`);
          if (msgRes.success) {
            setMessages(msgRes.data);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour envoyer un message');
      return;
    }
    if (!newMessage.trim() || !chatModalData?.proId) return;

    try {
      const res = await apiService.post('/messages', {
        receiver_id: chatModalData.proId,
        body: newMessage
      });
      if (res.success) {
        setMessages([...messages, res.data]);
        setNewMessage('');
        setConversationId(res.conversation_id);
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi du message');
    }
  };

  if (!isChatModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 bg-navy text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {chatModalData?.proName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm">{chatModalData?.proName}</h3>
              <p className="text-[10px] text-white/60">En ligne</p>
            </div>
          </div>
          <button onClick={closeChatModal} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-xl"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 text-3xl shadow-sm">
                <i className="ti ti-messages"></i>
              </div>
              <p className="text-gray-400 text-sm font-medium">
                Dites bonjour à {chatModalData?.proName} !
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.user_id === user?.id 
                    ? 'bg-forest text-white rounded-tr-none' 
                    : 'bg-white text-navy shadow-sm rounded-tl-none border border-gray-100'
                }`}>
                  <p>{msg.body}</p>
                  <p className={`text-[9px] mt-1 ${msg.user_id === user?.id ? 'text-white/60' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-forest text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-100 hover:scale-105 transition-all border-none cursor-pointer disabled:opacity-50 disabled:scale-100"
          >
            <i className="ti ti-send text-xl"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
