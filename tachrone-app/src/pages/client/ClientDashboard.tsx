import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import { apiService } from '../../data/apiService';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulations' | 'devis' | 'messages' | 'profile'>('overview');
  const { logout, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoadingSims, setIsLoadingSims] = useState(false);

  // Messaging State
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (newProfile: any) => {
    try {
      const response = await apiService.put('/profile', newProfile);
      if (response.success) {
        const updatedUser = response.data;
        updateUser(updatedUser);
        setProfile({
          name: updatedUser.name || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          city: updatedUser.city || ''
        });
        alert('Profil mis à jour avec succès !');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      alert(error.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  // State for data
  const [simulations, setSimulations] = useState<any[]>([]);
  const [devis, setDevis] = useState<any[]>([]);

  // Load data from API
  useEffect(() => {
    const fetchData = async (isFirstLoad = false) => {
      if (!user) return;
      if (isFirstLoad) setIsLoadingSims(true);
      try {
        const [simulationsRes, leadsRes, convRes] = await Promise.all([
          apiService.get('/simulations'),
          apiService.get('/leads'),
          apiService.get('/conversations')
        ]);

        if (simulationsRes.success) {
          const apiSims = simulationsRes.simulations.map((s: any) => ({
            id: s.id,
            name: s.project_type + " " + s.area + "m²",
            type: s.project_type,
            budget: `${new Intl.NumberFormat('fr-MA').format(s.budget_min)} DH`,
            date: new Date(s.created_at).toLocaleDateString('fr-FR'),
            details: s.raw_data
          }));
          setSimulations(apiSims);
        }

        if (convRes.success) {
          setConversations(convRes.data);
        }

        if (leadsRes.success) {
          const formattedDevis = leadsRes.data.map((l: any) => ({
            id: l.id,
            pro: l.professional?.professional_profile?.company_name || l.professional?.name || l.pro?.name || "Prestataire",
            status: l.status === 'pending' ? 'En attente' : l.status === 'accepted' ? 'Reçu' : l.status === 'rejected' ? 'Refusé' : l.status,
            price: l.price ? `${l.price} DH` : '-',
            date: new Date(l.created_at).toLocaleDateString(),
            details: {
              description: l.description,
              subject: l.subject,
              phone: l.phone,
              pro_notes: l.pro_notes,
              quote: l.quote_details // Include the full quote details
            }
          }));
          setDevis(formattedDevis);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        if (isFirstLoad) setIsLoadingSims(false);
      }
    };

    fetchData(true);
    const interval = setInterval(() => fetchData(false), 10000); // Poll every 10 seconds

    // Listen for storage events (sent when DevisModal saves)
    window.addEventListener('storage', () => fetchData(false));
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', () => fetchData(false));
    };
  }, [user.id]);

  // Poll for messages if a conversation is selected
  useEffect(() => {
    let interval: any;
    if (activeTab === 'messages' && selectedConversation) {
      interval = setInterval(async () => {
        try {
          const res = await apiService.get(`/conversations/${selectedConversation.id}/messages`);
          if (res.success) {
            setConversationMessages(res.data);
          }
        } catch (error) {
          console.error("Error polling messages", error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeTab, selectedConversation]);

  const [selectedSimulation, setSelectedSimulation] = useState<any | null>(null);
  const [selectedDevis, setSelectedDevis] = useState<any | null>(null);
  const [showNewSimModal, setShowNewSimModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const deleteSimulation = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette simulation ?')) {
      try {
        const res = await apiService.delete(`/simulations/${id}`);
        if (res.success) {
          setSimulations(prev => prev.filter(s => s.id !== id));
        } else {
          alert(res.message || 'Erreur lors de la suppression');
        }
      } catch (error: any) {
        alert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleSaveSimulation = async (simData: any) => {
    try {
      // Map the local modal data to the backend format
      const apiPayload = {
        project_type: simData.name,
        area: simData.details?.etages?.reduce((sum: number, e: any) => sum + (parseFloat(e.superficie) || 0), 0) || 0,
        budget_min: simData.rawBudget || 0,
        budget_max: simData.rawBudget || 0,
        raw_data: simData.details
      };

      const res = await apiService.post('/simulations', apiPayload);
      
      if (res.success) {
        const savedSim = {
          id: res.simulation.id,
          name: res.simulation.project_type,
          type: "Construction", // Default or derived
          budget: new Intl.NumberFormat('fr-MA').format(res.simulation.budget_min) + " DH",
          date: new Date(res.simulation.created_at).toLocaleDateString('fr-FR'),
          details: res.simulation.raw_data
        };
        setSimulations(prev => [savedSim, ...prev]);
        setShowNewSimModal(false);
      }
    } catch (error) {
      console.error("Error saving simulation:", error);
      alert("Erreur lors de la sauvegarde de la simulation");
    }
  };

  const handleSelectConversation = async (conv: any) => {
    setSelectedConversation(conv);
    try {
      const res = await apiService.get(`/conversations/${conv.id}/messages`);
      if (res.success) {
        setConversationMessages(res.data);
        // Mark as read in local state
        setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
      }
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSendingMessage) return;

    setIsSendingMessage(true);
    const receiverId = selectedConversation.sender_id === user?.id ? selectedConversation.receiver_id : selectedConversation.sender_id;
    
    try {
      const res = await apiService.post('/messages', {
        receiver_id: receiverId,
        body: newMessage
      });
      if (res.success) {
        setConversationMessages(prev => [...prev, res.data]);
        setNewMessage('');
        // Update last message in conversations list
        setConversations(prev => prev.map(c => 
          c.id === selectedConversation.id ? { ...c, last_message_at: res.data.created_at } : c
        ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header hideNav={true} />
      
      <main className="max-w-[1400px] mx-auto px-6 md:px-15 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-forest text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Mon Espace</h2>
                    <p className="text-[11px] text-white/80">{user?.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    title="Déconnexion"
                  >
                    <i className="ti ti-logout text-xl"></i>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                    {profile.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{profile.name}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-70">Client Particulier</p>
                  </div>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-layout-dashboard text-lg"></i> Vue d'ensemble
                </button>
                <button 
                  onClick={() => setActiveTab('simulations')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'simulations' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-calculator text-lg"></i> Mes Simulations
                </button>
                <button 
                  onClick={() => setActiveTab('devis')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'devis' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-file-text text-lg"></i> Mes Devis
                </button>
                <button 
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-messages text-lg"></i> Messages
                  {conversations.some(c => c.unread_count > 0) && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-user text-lg"></i> Mon Profil
                </button>
              </nav>

              <div className="p-4 pt-0">
                <div className="p-4 bg-forest/5 rounded-2xl border border-forest/10">
                  <p className="text-[10px] font-black text-forest uppercase tracking-widest mb-2">Besoin d'aide ?</p>
                  <p className="text-[11px] text-navy/70 mb-3">Trouvez les meilleurs prestataires et matériaux pour votre projet.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full py-2.5 bg-forest text-white rounded-xl text-[11px] font-bold shadow-lg shadow-green-100 hover:scale-[1.02] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="ti ti-search"></i> Explorer les services
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-black text-forest">Dashboard Client</h1>
                <p className="text-gray-500 text-sm">Suivez vos projets et vos devis</p>
              </div>
              <div className="flex items-center gap-3 bg-forest/5 px-4 py-2 rounded-xl border border-forest/10">
                <div className="w-2 h-2 rounded-full bg-forest animate-pulse"></div>
                <span className="text-[10px] font-bold text-forest uppercase tracking-widest">Espace Particulier</span>
              </div>
            </div>

            {activeTab === 'overview' && <Overview user={user} simulationsCount={simulations.length} devisList={devis} onViewDevis={setSelectedDevis} messagesCount={conversations.length} />}
            {activeTab === 'simulations' && <MySimulations simulations={simulations} onDelete={deleteSimulation} onNewClick={() => setShowNewSimModal(true)} onView={setSelectedSimulation} />}
            {activeTab === 'devis' && <MyDevis devisList={devis} onView={setSelectedDevis} />}
            {activeTab === 'messages' && (
              <MessagesManagement 
                conversations={conversations}
                selectedConversation={selectedConversation}
                messages={conversationMessages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSelectConversation={handleSelectConversation}
                onSendMessage={handleSendMessage}
                isSending={isSendingMessage}
                currentUserId={user?.id}
              />
            )}
            {activeTab === 'profile' && <ProfileSettings profile={profile} onUpdate={handleProfileUpdate} />}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showNewSimModal && (
        <NewSimulationModal onClose={() => setShowNewSimModal(false)} onSave={handleSaveSimulation} />
      )}

      {selectedSimulation && (
        <ViewSimulationModal simulation={selectedSimulation} onClose={() => setSelectedSimulation(null)} />
      )}

      {selectedDevis && (
        <ViewDevisModal devis={selectedDevis} onClose={() => setSelectedDevis(null)} />
      )}

      <Footer />
    </div>
  );
}

function NewSimulationModal({ onClose, onSave }: { onClose: () => void, onSave: (sim: any) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  
  // Step 1: Terrain
  const [superficieTerrain, setSuperficieTerrain] = useState('');
  const [prixAchatTerrain, setPrixAchatTerrain] = useState('');

  // Step 2: Superficie
  const [etages, setEtages] = useState([
    { id: 1, nom: 'Sous-sol 1', superficie: '' },
    { id: 2, nom: 'RDC', superficie: '' },
    { id: 3, nom: 'Mezzanine', superficie: '' },
    { id: 4, nom: 'Étage 1', superficie: '' },
  ]);

  // Step 3: Coûts
  const [standing, setStanding] = useState('');
  const [coutConstruction, setCoutConstruction] = useState('');

  // Step 4: Prix de vente
  const [prixVenteAppart, setPrixVenteAppart] = useState('');
  const [prixVenteRDC, setPrixVenteRDC] = useState('');

  const totalSuperficieConstruite = etages.reduce((sum, e) => sum + (parseFloat(e.superficie) || 0), 0);
  const coutTerrain = (parseFloat(superficieTerrain) || 0) * (parseFloat(prixAchatTerrain) || 0);
  const coutConst = totalSuperficieConstruite * (parseFloat(coutConstruction) || 0);
  const totalCharges = coutTerrain + coutConst;

  const addEtage = () => {
    const newId = Math.max(...etages.map(e => e.id), 0) + 1;
    const numEtages = etages.filter(e => e.nom.startsWith('Étage')).length;
    setEtages([...etages, { id: newId, nom: `Étage ${numEtages + 1}`, superficie: '' }]);
  };

  const deleteEtage = (id: number) => {
    setEtages(etages.filter(e => e.id !== id));
  };

  const handleFinish = () => {
    onSave({
      name: name || 'Nouveau Projet',
      budget: new Intl.NumberFormat('fr-MA').format(totalCharges),
      rawBudget: totalCharges, // Pass the raw numeric value for API
      details: {
        terrain: { superficie: superficieTerrain, prix: prixAchatTerrain },
        etages: etages.filter(e => e.superficie !== ''),
        couts: { standing: standing === "2300" ? "Économique" : standing === "3000" ? "Moyen standing" : "Haut standing", construction: coutConstruction },
        vente: { appart: prixVenteAppart, rdc: prixVenteRDC }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-scaleIn h-full max-h-[90vh] flex flex-col">
        <div className="p-6 bg-forest text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Lancer une nouvelle simulation</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        {/* Stepper Header */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between gap-2 shrink-0 overflow-x-auto">
          {[
            { num: 1, icon: 'ti-map-pin', label: 'Terrain' },
            { num: 2, icon: 'ti-building', label: 'Superficie' },
            { num: 3, icon: 'ti-coin', label: 'Coûts' },
            { num: 4, icon: 'ti-tag', label: 'Vente' },
            { num: 5, icon: 'ti-checkbox', label: 'Résultats' },
          ].map((step) => (
            <div key={step.num} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all shrink-0 ${currentStep === step.num ? 'border-forest bg-forest text-white' : 'border-gray-200 text-gray-400 bg-white'}`}>
              <i className={`ti ${step.icon}`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom de la simulation</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Villa Tanger" className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Superficie terrain (m²)</label>
                  <input type="number" value={superficieTerrain} onChange={e => setSuperficieTerrain(e.target.value)} placeholder="ex: 600" className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix achat (DH/m²)</label>
                  <input type="number" value={prixAchatTerrain} onChange={e => setPrixAchatTerrain(e.target.value)} placeholder="ex: 5000" className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="overflow-hidden border border-gray-200 rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Niveau</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Superficie (m²)</th>
                      <th className="p-4 w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {etages.map(e => (
                      <tr key={e.id}>
                        <td className="p-4 text-sm font-bold text-navy">{e.nom}</td>
                        <td className="p-4">
                          <input 
                            type="number" 
                            value={e.superficie} 
                            onChange={val => setEtages(etages.map(item => item.id === e.id ? { ...item, superficie: val.target.value } : item))}
                            placeholder="0"
                            className="w-full p-2 rounded-lg border border-gray-200 focus:border-forest outline-none"
                          />
                        </td>
                        <td className="p-4">
                          <button 
                            type="button"
                            onClick={() => deleteEtage(e.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                type="button"
                onClick={addEtage}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-black text-navy uppercase tracking-widest hover:bg-gray-100 transition-all cursor-pointer"
              >
                <i className="ti ti-plus text-forest"></i> Ajouter un étage
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standing</label>
                  <select 
                    value={standing} 
                    onChange={e => {
                      setStanding(e.target.value);
                      setCoutConstruction(e.target.value);
                    }}
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none bg-white"
                  >
                    <option value="">-- choisir --</option>
                    <option value="2300">Économique — 2 300 DH/m²</option>
                    <option value="3000">Moyen standing — 3 000 DH/m²</option>
                    <option value="5000">Haut standing — 5 000 DH/m²</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coût Construction (DH/m²)</label>
                  <input type="number" value={coutConstruction} onChange={e => setCoutConstruction(e.target.value)} className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix Vente Appart (DH/m²)</label>
                  <input type="number" value={prixVenteAppart} onChange={e => setPrixVenteAppart(e.target.value)} className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prix Vente RDC (DH/m²)</label>
                  <input type="number" value={prixVenteRDC} onChange={e => setPrixVenteRDC(e.target.value)} className="w-full p-4 rounded-2xl border border-gray-200 focus:border-forest outline-none transition-all" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-forest/5 p-6 rounded-3xl border border-forest/10 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Coût Total Estimé</p>
                  <p className="text-3xl font-black text-forest">{new Intl.NumberFormat('fr-MA').format(totalCharges)} DH</p>
                </div>
                <div className="bg-navy/5 p-6 rounded-3xl border border-navy/10 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Rentabilité</p>
                  <p className="text-3xl font-black text-navy">Est. +15%</p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-navy uppercase tracking-widest">Résumé du projet</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Superficie Terrain:</span>
                    <span className="font-bold text-navy">{superficieTerrain} m²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Superficie Bâtie:</span>
                    <span className="font-bold text-navy">{totalSuperficieConstruite} m²</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between shrink-0">
          <button 
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-8 py-3 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-all border-none cursor-pointer"
          >
            Précédent
          </button>
          {currentStep < 5 ? (
            <button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-10 py-3 rounded-xl font-bold text-sm bg-forest text-white shadow-lg hover:scale-[1.02] transition-all border-none cursor-pointer"
            >
              Suivant
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="px-10 py-3 rounded-xl font-bold text-sm bg-navy text-white shadow-lg hover:scale-[1.02] transition-all border-none cursor-pointer"
            >
              Sauvegarder la simulation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewSimulationModal({ simulation, onClose }: { simulation: any, onClose: () => void }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const details = simulation.details || {};
        
        // Header
        doc.setFillColor(11, 44, 36); // Forest color
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('INVESTAQARY.MA', 20, 25);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Plateforme de construction et rénovation au Maroc', 20, 32);

        // Title
        doc.setTextColor(11, 44, 36);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('RAPPORT DE SIMULATION DÉTAILLÉ', 20, 55);
        
        // Line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 60, 190, 60);

        // --- Section 1: Infos Générales ---
        doc.setFontSize(12);
        doc.setTextColor(11, 44, 36);
        doc.text('1. Informations Générales', 20, 70);
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Nom du Projet : ${simulation.name}`, 25, 78);
        doc.text(`Date de simulation : ${simulation.date}`, 25, 84);
        doc.text(`Type : ${simulation.type}`, 25, 90);

        // --- Section 2: Détails du Terrain ---
        doc.setFontSize(12);
        doc.setTextColor(11, 44, 36);
        doc.text('2. Terrain', 20, 105);
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Superficie du terrain : ${details.terrain?.superficie || 'N/A'} m²`, 25, 113);
        doc.text(`Prix d'achat : ${details.terrain?.prix || 'N/A'} DH/m²`, 25, 119);

        // --- Section 3: Détails des Niveaux ---
        doc.setFontSize(12);
        doc.setTextColor(11, 44, 36);
        doc.text('3. Surfaces par niveau', 20, 134);
        
        let yPos = 142;
        if (details.etages && details.etages.length > 0) {
          details.etages.forEach((etage: any) => {
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.text(`- ${etage.nom} :`, 25, yPos);
            doc.setTextColor(0, 0, 0);
            doc.text(`${etage.superficie} m²`, 70, yPos);
            yPos += 7;
          });
        } else {
          doc.text('Aucune donnée d\'étage', 25, yPos);
          yPos += 7;
        }

        // --- Section 4: Coûts et Standing ---
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(11, 44, 36);
        doc.text('4. Coûts de Construction', 20, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Standing choisi : ${details.couts?.standing || 'N/A'}`, 25, yPos);
        yPos += 6;
        doc.text(`Coût estimé : ${details.couts?.construction || 'N/A'} DH/m²`, 25, yPos);

        // --- Section 5: Prix de Vente Estimés ---
        yPos += 15;
        doc.setFontSize(12);
        doc.setTextColor(11, 44, 36);
        doc.text('5. Estimations de Vente', 20, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Prix Vente Appartements : ${details.vente?.appart || '0'} DH/m²`, 25, yPos);
        yPos += 6;
        doc.text(`Prix Vente RDC (Commerce) : ${details.vente?.rdc || '0'} DH/m²`, 25, yPos);

        // Budget Box
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(20, 230, 170, 30, 5, 5, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('RÉSULTAT : BUDGET ESTIMATIF TOTAL', 30, 240);
        
        doc.setFontSize(20);
        doc.setTextColor(11, 44, 36);
        doc.text(`${simulation.budget}`, 30, 252);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Document généré par InvestaQary.ma - Votre partenaire de confiance au Maroc', 105, 285, { align: 'center' });

        // Save
        doc.save(`Rapport_Detaille_${simulation.name.replace(/\s+/g, '_')}.pdf`);
        
        setIsExporting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Une erreur est survenue lors de la génération du PDF.");
        setIsExporting(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
        <div className="p-6 bg-navy text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Détails de la simulation</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {showSuccess && (
            <div className="p-4 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-100 flex items-center gap-2 animate-fadeIn">
              <i className="ti ti-check text-lg"></i> PDF généré et téléchargé avec succès !
            </div>
          )}
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-forest/10 text-forest flex items-center justify-center text-3xl shrink-0">
              <i className="ti ti-calculator"></i>
            </div>
            <div>
              <h4 className="text-2xl font-black text-navy">{simulation.name}</h4>
              <p className="text-sm text-gray-500">Effectuée le {simulation.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget Estimé</p>
              <p className="text-xl font-black text-forest">{simulation.budget}</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Type de projet</p>
              <p className="text-xl font-black text-navy">{simulation.type}</p>
            </div>
          </div>

          {simulation.details && (
            <div className="space-y-4">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <h5 className="text-[10px] font-black text-navy uppercase tracking-widest mb-3">Récapitulatif technique</h5>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500">Terrain:</div>
                  <div className="font-bold text-right">{simulation.details.terrain?.superficie} m²</div>
                  
                  <div className="text-gray-500">Standing:</div>
                  <div className="font-bold text-right">{simulation.details.couts?.standing}</div>
                  
                  <div className="text-gray-500">Niveaux:</div>
                  <div className="font-bold text-right">{simulation.details.etages?.length}</div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <h5 className="text-[10px] font-black text-navy uppercase tracking-widest mb-3">Détails des surfaces</h5>
                <div className="space-y-2">
                  {simulation.details.etages?.map((etage: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs border-b border-gray-200 pb-1">
                      <span className="text-gray-500">{etage.nom}</span>
                      <span className="font-bold">{etage.superficie} m²</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

            <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50">
            <h5 className="text-xs font-black text-navy uppercase tracking-widest mb-2">Recommandation InvestAqary</h5>
            <p className="text-sm text-navy/80 leading-relaxed italic">
              "Basé sur vos calculs pour ce projet de {simulation.type}, nous vous recommandons de contacter au moins 3 entreprises de gros œuvres pour comparer les devis."
            </p>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border-none cursor-pointer flex items-center justify-center gap-2 ${isExporting ? 'bg-gray-100 text-gray-400' : 'bg-forest text-white shadow-lg hover:scale-[1.02]'}`}
          >
            {isExporting ? (
              <>
                <i className="ti ti-loader animate-spin text-lg"></i>
                Génération en cours...
              </>
            ) : (
              <>
                <i className="ti ti-file-download text-lg"></i>
                Exporter en PDF Complet
              </>
            )}
          </button>
          <button onClick={onClose} className="px-8 py-4 rounded-xl font-bold text-sm bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition-all cursor-pointer">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function Overview({ user, simulationsCount, devisList, onViewDevis, messagesCount = 0 }: { user: any, simulationsCount: number, devisList: any[], onViewDevis: (devis: any) => void, messagesCount?: number }) {
  const navigate = useNavigate();
  
  // Calculate dynamic stats
  const devisRecusCount = devisList.filter(d => d.status === 'Reçu').length;
  const demandesEnCoursCount = devisList.filter(d => d.status === 'En attente' || d.status === 'Nouveau').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-calculator text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium uppercase text-[10px] font-bold tracking-wider">Simulations</h3>
          <p className="text-2xl font-black text-navy mt-1">{simulationsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-file-check text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium uppercase text-[10px] font-bold tracking-wider">Devis Reçus</h3>
          <p className="text-2xl font-black text-navy mt-1">{devisRecusCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-clock text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium uppercase text-[10px] font-bold tracking-wider">En cours</h3>
          <p className="text-2xl font-black text-navy mt-1">{demandesEnCoursCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-messages text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium uppercase text-[10px] font-bold tracking-wider">Messages</h3>
          <p className="text-2xl font-black text-navy mt-1">{messagesCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-navy mb-4">Activités récentes</h3>
          <div className="flex-1">
            {devisList.filter(d => d.status === 'Reçu').length > 0 ? (
              <div className="space-y-4">
                {devisList.filter(d => d.status === 'Reçu').map((devis, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-forest">
                      <i className="ti ti-bell"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-navy">Nouveau devis reçu de "{devis.pro}"</p>
                      <p className="text-[11px] text-gray-500">{devis.date}</p>
                    </div>
                    <button 
                      onClick={() => onViewDevis(devis)}
                      className="text-xs font-bold text-forest hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Voir
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 opacity-80">
                <div className="w-40 h-40 bg-forest/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <i className="ti ti-home-check text-[80px] text-forest group-hover:scale-110 transition-transform duration-500"></i>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Aucune activité pour le moment</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-navy rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Lancer un nouveau projet ?</h3>
            <p className="text-white/70 text-sm mb-6">Explorez notre annuaire de professionnels qualifiés et trouvez les meilleurs prix pour vos matériaux.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <button 
              onClick={() => navigate('/entreprises')}
              className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <i className="ti ti-building"></i> Entreprises
            </button>
            <button 
              onClick={() => navigate('/fournisseurs')}
              className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <i className="ti ti-building-warehouse"></i> Matières
            </button>
          </div>
          {/* Decorative icon */}
          <i className="ti ti-search absolute -bottom-4 -right-4 text-white/5 text-8xl rotate-12"></i>
        </div>
      </div>
    </div>
  );
}

function MySimulations({ simulations, onDelete, onNewClick, onView }: { simulations: any[], onDelete: (id: number) => void, onNewClick: () => void, onView: (sim: any) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-navy">Mes Simulations Sauvegardées</h3>
        <button 
          onClick={onNewClick}
          className="bg-forest text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-forest/90 transition-all border-none cursor-pointer"
        >
          + Nouvelle Simulation
        </button>
      </div>
      <div className="p-6">
        {simulations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Aucune simulation sauvegardée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-4 px-4">Projet</th>
                  <th className="pb-4 px-4">Type</th>
                  <th className="pb-4 px-4">Budget Estimatf</th>
                  <th className="pb-4 px-4">Date</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {simulations.map((sim) => (
                  <tr key={sim.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-navy">{sim.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[11px] font-bold px-2 py-1 rounded bg-blue-50 text-blue-600">{sim.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-600">{sim.budget}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-500">{sim.date}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => onView(sim)}
                        className="p-2 text-gray-400 hover:text-forest transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <i className="ti ti-eye"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(sim.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MyDevis({ devisList, onView }: { devisList: any[], onView: (devis: any) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-navy">Suivi de mes devis</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {devisList.map((devis) => (
            <div key={devis.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-forest/30 transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold text-navy">
                  {devis.pro.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">{devis.pro}</h4>
                  <p className="text-xs text-gray-500">{devis.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Statut</p>
                  <span className={`text-[11px] font-bold ${devis.status === 'Reçu' ? 'text-green-600' : 'text-orange-500'}`}>
                    {devis.status}
                  </span>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Prix Estimé</p>
                  <p className="text-sm font-bold text-navy">{devis.price}</p>
                </div>
                <button 
                  onClick={() => onView(devis)}
                  className="bg-navy text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all border-none cursor-pointer"
                >
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagesManagement({ 
  conversations, 
  selectedConversation, 
  messages, 
  newMessage, 
  setNewMessage, 
  onSelectConversation, 
  onSendMessage,
  isSending,
  currentUserId
}: { 
  conversations: any[], 
  selectedConversation: any | null, 
  messages: any[], 
  newMessage: string, 
  setNewMessage: (msg: string) => void, 
  onSelectConversation: (conv: any) => void, 
  onSendMessage: (e: React.FormEvent) => void,
  isSending: boolean,
  currentUserId?: number
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-[600px] flex">
      {/* Conversations List */}
      <div className="w-full md:w-[320px] border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-navy">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              Aucune conversation pour le moment.
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = conv.sender_id === currentUserId ? conv.receiver : conv.sender;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => onSelectConversation(conv)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 flex items-center gap-4 ${selectedConversation?.id === conv.id ? 'bg-forest/5 border-l-4 border-l-forest' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-navy shrink-0">
                    {otherUser?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-navy truncate">{otherUser?.name}</p>
                      {conv.unread_count > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{conv.unread_count}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {new Date(conv.last_message_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-gray-50/30">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center font-bold">
                {(selectedConversation.sender_id === currentUserId ? selectedConversation.receiver : selectedConversation.sender)?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-navy">
                  {(selectedConversation.sender_id === currentUserId ? selectedConversation.receiver : selectedConversation.sender)?.name}
                </p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">En ligne</p>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.user_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.user_id === currentUserId 
                      ? 'bg-forest text-white rounded-tr-none shadow-md shadow-green-100' 
                      : 'bg-white text-navy shadow-sm rounded-tl-none border border-gray-100'
                  }`}>
                    <p>{msg.body}</p>
                    <p className={`text-[9px] mt-1 ${msg.user_id === currentUserId ? 'text-white/60' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={onSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest transition-all"
              />
              <button 
                type="submit"
                disabled={isSending || !newMessage.trim()}
                className="w-12 h-12 bg-forest text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-100 hover:scale-105 transition-all border-none cursor-pointer disabled:opacity-50"
              >
                <i className="ti ti-send text-xl"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 text-4xl shadow-sm">
              <i className="ti ti-messages"></i>
            </div>
            <div>
              <p className="text-gray-500 font-bold">Sélectionnez une conversation</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">Choisissez un prestataire dans la liste pour commencer à discuter.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewDevisModal({ devis, onClose }: { devis: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
        <div className="p-6 bg-navy text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Détails du Devis</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-navy/10 text-navy flex items-center justify-center text-3xl shrink-0 font-bold">
              {devis.pro.charAt(0)}
            </div>
            <div>
              <h4 className="text-2xl font-black text-navy">{devis.pro}</h4>
              <p className="text-sm text-gray-500">Envoyé {devis.date}</p>
            </div>
            <div className="ml-auto text-right">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${devis.status === 'Reçu' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {devis.status}
              </span>
            </div>
          </div>

          {devis.details?.quote ? (
            <div className="space-y-6">
              <div>
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description des travaux</h5>
                <p className="text-sm text-navy/80 leading-relaxed">{devis.details.quote.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Durée estimée</h5>
                  <div className="flex items-center gap-2 text-navy font-bold">
                    <i className="ti ti-calendar-time text-forest"></i>
                    <span>{devis.details.quote.duration}</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Matériaux principaux</h5>
                  <div className="flex items-center gap-2 text-navy font-bold">
                    <i className="ti ti-box text-forest"></i>
                    <span className="text-xs">{devis.details.quote.materials}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Détail des coûts</h5>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100/50">
                      <tr>
                        <th className="p-3 font-bold text-navy/60">Poste</th>
                        <th className="p-3 text-right font-bold text-navy/60">Prix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {devis.details.quote.breakdown.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3 text-navy/80">{item.item}</td>
                          <td className="p-3 text-right font-bold text-navy">{item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-forest/5">
                      <tr>
                        <td className="p-3 font-black text-forest">TOTAL ESTIMÉ</td>
                        <td className="p-3 text-right font-black text-forest text-lg">{devis.price}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {devis.status === 'Reçu' ? (
                  <>
                    <button className="flex-1 py-4 rounded-xl font-bold text-sm bg-forest text-white shadow-lg hover:scale-[1.02] transition-all border-none cursor-pointer flex items-center justify-center gap-2">
                      <i className="ti ti-phone text-lg"></i>
                      Appeler le professionnel
                    </button>
                    <button className="flex-1 py-4 rounded-xl font-bold text-sm bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all cursor-pointer flex items-center justify-center gap-2">
                      <i className="ti ti-brand-whatsapp text-lg"></i>
                      WhatsApp
                    </button>
                  </>
                ) : (
                  <div className="w-full py-4 px-6 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 text-center text-sm font-bold flex items-center justify-center gap-2">
                    <i className="ti ti-clock-play text-lg"></i>
                    En attente de réponse du professionnel
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto text-4xl">
                <i className="ti ti-clock-hour-4"></i>
              </div>
              <div>
                <h4 className="font-bold text-navy">Devis en cours d'élaboration</h4>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">L'entreprise analyse votre demande. Vous recevrez une notification dès que les détails seront disponibles.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ profile, onUpdate }: { profile: any, onUpdate: (data: any) => void }) {
  const [success, setSuccess] = useState(false);
  const [localData, setLocalData] = useState({ ...profile });
  
  // Update localData when profile prop changes (e.g. after logout/login)
  useEffect(() => {
    setLocalData({ ...profile });
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localData); // Update global state
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <h3 className="text-lg font-bold text-navy mb-6">Paramètres du profil</h3>
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-100 flex items-center gap-2 animate-scaleIn">
          <i className="ti ti-check text-lg"></i> Profil mis à jour avec succès !
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Nom Complet</label>
            <input 
              type="text" 
              value={localData.name}
              onChange={e => setLocalData({ ...localData, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
            <input 
              type="email" 
              value={localData.email}
              onChange={e => setLocalData({ ...localData, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
            <input 
              type="tel" 
              value={localData.phone}
              onChange={e => setLocalData({ ...localData, phone: e.target.value })}
              placeholder="06 XX XX XX XX"
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Ville</label>
            <input 
              type="text" 
              value={localData.city}
              onChange={e => setLocalData({ ...localData, city: e.target.value })}
              placeholder="Ex: Casablanca"
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
          <button type="button" onClick={() => setLocalData({ ...profile })} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all border-none cursor-pointer">
            Annuler
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-forest text-white shadow-lg shadow-green-100 hover:bg-forest/90 transition-all border-none cursor-pointer">
            Sauvegarder les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
