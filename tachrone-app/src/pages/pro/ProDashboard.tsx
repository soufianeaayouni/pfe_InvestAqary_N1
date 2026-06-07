import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../data/apiService';

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'messages' | 'projects' | 'products' | 'profile' | 'likes'>('overview');
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [proStats, setProStats] = useState<{
    profile_views: number;
    profile_views_week_change: number;
    pending_leads: number;
    average_rating: number | null;
    reviews_count: number;
  } | null>(null);

  // Messaging State
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company_name: user?.professional_profile?.company_name || user?.name || '',
    category: user?.professional_profile?.category || '',
    description: user?.professional_profile?.description || '',
    ice: user?.professional_profile?.ice || '',
    experience: user?.professional_profile?.experience || '',
    city: user?.city || ''
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [showSendQuoteModal, setShowSendQuoteModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [viewingProject, setViewingProject] = useState<any | null>(null);

  // Likes State
  const [likers, setLikers] = useState<any[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  const handleSendQuote = async (quoteData: any) => {
    if (!selectedLead) return;
    try {
      const response = await apiService.put(`/leads/${selectedLead.id}`, {
        status: 'accepted',
        price: quoteData.total,
        quote_details: quoteData
      });

      if (response.success) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'Envoyé' } : l));
        setShowSendQuoteModal(false);
        setSelectedLead(null);
        alert('Devis envoyé avec succès !');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi du devis');
    }
  };

  const handleRefuseLead = async () => {
    if (!selectedLead) return;
    if (!window.confirm('Voulez-vous vraiment refuser cette demande ?')) return;

    try {
      const response = await apiService.put(`/leads/${selectedLead.id}`, {
        status: 'rejected'
      });

      if (response.success) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: 'Refusé' } : l));
        setSelectedLead(null);
      }
    } catch (error) {
      alert('Erreur lors du refus de la demande');
    }
  };

  useEffect(() => {
    const fetchData = async (isFirstLoad = false) => {
      if (!user) {
        if (isFirstLoad) setLoading(false);
        return;
      }
      if (isFirstLoad) setLoading(true);
      try {
        const [projectsRes, productsRes, leadsRes, convRes, statsRes] = await Promise.all([
          apiService.get('/projects', { user_id: user.id }),
          apiService.get('/products', { user_id: user.id }),
          apiService.get('/leads'),
          apiService.get('/conversations'),
          apiService.get('/pro/stats').catch(() => ({ success: false }))
        ]);

        if (projectsRes.success) setProjects(projectsRes.data);
        if (productsRes.success) setProducts(productsRes.data);
        if (convRes.success) setConversations(convRes.data);
        if (leadsRes.success) {
          const formattedLeads = leadsRes.data.map((l: any) => ({
            id: l.id,
            client: l.client?.name || "Client",
            project: l.subject,
            city: l.client?.city || "Maroc",
            budget: l.price ? `${l.price} DH` : "À définir",
            status: l.status === 'pending' ? 'Nouveau' : l.status === 'accepted' ? 'Envoyé' : l.status,
            date: new Date(l.created_at).toLocaleDateString(),
            description: l.description,
            phone: l.phone,
            email: l.client?.email
          }));
          setLeads(formattedLeads);
        }
        if (statsRes.success) {
          setProStats(statsRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        if (isFirstLoad) {
          setLoading(false);
          setStatsLoading(false);
        }
      }
    };

    fetchData(true);
    const interval = setInterval(() => fetchData(false), 10000); // Poll every 10 seconds background
    return () => clearInterval(interval);
  }, [user?.id]);

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

  const handleProfileUpdate = async (newProfile: any) => {
    try {
      const response = await apiService.put('/professional/profile', newProfile);
      if (response.success) {
        setProfile({
          ...profile,
          ...newProfile,
          company_name: response.data.professional_profile?.company_name,
          name: response.data.name
        });
        alert('Profil mis à jour avec succès !');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  const deleteProject = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      try {
        const res = await apiService.delete(`/projects/${id}`);
        if (res.success) {
          setProjects(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const addProject = async (newProject: any) => {
    try {
      const res = await apiService.post('/projects', newProject);
      if (res.success) {
        setProjects(prev => [res.data, ...prev]);
        setShowAddProjectModal(false);
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout du projet');
    }
  };

  const updateProject = async (updatedData: any) => {
    try {
      const res = await apiService.put(`/projects/${editingProject.id}`, updatedData);
      if (res.success) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? res.data : p));
        setEditingProject(null);
      }
    } catch (error) {
      alert('Erreur lors de la modification');
    }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        const res = await apiService.delete(`/products/${id}`);
        if (res.success) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const addProduct = async (newProduct: any) => {
    try {
      const res = await apiService.post('/products', newProduct);
      if (res.success) {
        setProducts(prev => [res.data, ...prev]);
        setShowAddProductModal(false);
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout du produit');
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
      console.error("Error sending message", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'likes') {
      const fetchLikers = async () => {
        setIsLoadingLikes(true);
        try {
          const response = await apiService.get('/pro/likes-received');
          if (response.success) {
            setLikers(response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des likes:", error);
        } finally {
          setIsLoadingLikes(false);
        }
      };
      fetchLikers();
    }
  }, [activeTab]);


  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const handleUpdateLeadStatus = async (id: number, status: string, price?: number) => {
    try {
      const res = await apiService.post(`/leads/${id}/status`, { status, price });
      if (res.success) {
        setLeads(prev => prev.map(l => l.id === id ? { 
          ...l, 
          status: status === 'accepted' ? 'Envoyé' : status === 'rejected' ? 'Refusé' : status,
          budget: price ? `${price} DH` : l.budget
        } : l));
        alert('Statut mis à jour !');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  const proType = user?.professional_profile?.type;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header hideNav={true} />
      
      <main className="max-w-[1400px] mx-auto px-6 md:px-15 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-navy text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Espace Pro</h2>
                    <p className="text-[11px] text-gray-300">{user?.email}</p>
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
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                    {(profile.company_name || profile.name)?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{profile.company_name || profile.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase tracking-wider opacity-70">
                        {proType === 'fournisseur' ? 'Fournisseur' : proType === 'entreprise' ? 'Entreprise' : 'Maalem'}
                      </span>
                      {user?.professional_profile?.is_verified && <i className="ti ti-circle-check-filled text-blue-400 text-[12px]"></i>}
                    </div>
                  </div>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-chart-bar text-lg"></i> Statistiques
                </button>
                <button 
                  onClick={() => setActiveTab('leads')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-users text-lg"></i> Demandes (Leads)
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
                {proType !== 'fournisseur' && (
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <i className="ti ti-photo text-lg"></i> Mes Réalisations
                  </button>
                )}
                {proType === 'fournisseur' && (
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <i className="ti ti-package text-lg"></i> Mon Catalogue
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-building text-lg"></i> Profil Entreprise
                </button>
                <button 
                  onClick={() => setActiveTab('likes')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'likes' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-heart-filled text-lg"></i> Intéressés
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-black text-navy uppercase">Espace Professionnel</h1>
                <p className="text-gray-500 text-sm uppercase">Gérez vos leads et votre vitrine</p>
              </div>
              <div className="flex items-center gap-3 bg-navy/5 px-4 py-2 rounded-xl border border-navy/10">
                <div className="w-2 h-2 rounded-full bg-navy animate-pulse"></div>
                <span className="text-[10px] font-bold text-navy uppercase tracking-widest">
                  {user?.professional_profile?.is_verified ? 'Compte Vérifié' : 'En attente de vérification'}
                </span>
              </div>
            </div>

            {activeTab === 'overview' && <ProOverview stats={proStats} isLoading={statsLoading} />}
            {activeTab === 'leads' && <LeadsManagement leads={leads} onViewDetails={setSelectedLead} onUpdateStatus={handleUpdateLeadStatus} />}
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
            {activeTab === 'projects' && (
              <ProjectGallery 
                projects={projects} 
                onDelete={deleteProject} 
                onAddClick={() => setShowAddProjectModal(true)} 
                onEditClick={setEditingProject} 
                onViewClick={setViewingProject} 
              />
            )}
            {activeTab === 'products' && (
              <ProductCatalog 
                products={products} 
                onDelete={deleteProduct} 
                onAddClick={() => setShowAddProductModal(true)} 
              />
            )}
            {activeTab === 'profile' && <CompanySettings profile={profile} onUpdate={handleProfileUpdate} />}
            {activeTab === 'likes' && (
              <LikersManagement likers={likers} isLoading={isLoadingLikes} />
            )}
          </div>
        </div>
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && !showSendQuoteModal && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onAccept={() => setShowSendQuoteModal(true)}
          onRefuse={handleRefuseLead}
        />
      )}

      {/* Send Quote Modal */}
      {showSendQuoteModal && selectedLead && (
        <SendQuoteModal 
          lead={selectedLead} 
          onClose={() => setShowSendQuoteModal(false)} 
          onSend={handleSendQuote}
        />
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <AddProjectModal onClose={() => setShowAddProjectModal(false)} onSave={addProject} />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onSave={updateProject} />
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <AddProductModal onClose={() => setShowAddProductModal(false)} onSave={addProduct} />
      )}

      {viewingProject && (
        <ViewProjectModal project={viewingProject} onClose={() => setViewingProject(null)} />
      )}

      <Footer />
    </div>
  );
}

function ProductCatalog({ products, onDelete, onAddClick }: { products: any[], onDelete: (id: number) => void, onAddClick: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-navy uppercase">Mon Catalogue de Produits</h3>
        <button 
          onClick={onAddClick}
          className="bg-forest text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-forest/90 transition-all border-none cursor-pointer uppercase"
        >
          + Ajouter un produit
        </button>
      </div>
      {products.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-400 uppercase">Votre catalogue est vide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img 
                  src={product.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={product.name}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="w-8 h-8 bg-white/90 backdrop-blur rounded-full text-red-500 flex items-center justify-center shadow-sm border-none cursor-pointer hover:bg-red-500 hover:text-white transition-all"
                  >
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-navy group-hover:text-forest transition-colors uppercase truncate">{product.name}</h4>
                <p className="text-xs font-bold text-forest mt-1">{product.price} MAD / {product.unit}</p>
                <p className="text-[10px] text-gray-400 mt-2 uppercase truncate">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProOverview({ stats, isLoading }: {
  stats: {
    profile_views: number;
    profile_views_week_change: number;
    pending_leads: number;
    average_rating: number | null;
    reviews_count: number;
  } | null;
  isLoading: boolean;
}) {
  const formatWeekChange = (change: number) => {
    if (change > 0) return `+${change}% cette semaine`;
    if (change < 0) return `${change}% cette semaine`;
    return 'Stable cette semaine';
  };

  const weekChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-eye text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Vues du profil</h3>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mt-1"></div>
          ) : (
            <>
              <p className="text-2xl font-bold text-navy">{(stats?.profile_views ?? 0).toLocaleString('fr-FR')}</p>
              <p className={`text-[11px] font-bold mt-1 ${weekChangeColor(stats?.profile_views_week_change ?? 0)}`}>
                {formatWeekChange(stats?.profile_views_week_change ?? 0)}
              </p>
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-message-2 text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Nouvelles demandes</h3>
          {isLoading ? (
            <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mt-1"></div>
          ) : (
            <>
              <p className="text-2xl font-bold text-navy">{stats?.pending_leads ?? 0}</p>
              <p className="text-[11px] text-orange-500 font-bold mt-1">
                {(stats?.pending_leads ?? 0) > 0 ? 'À traiter urgemment' : 'Aucune demande en attente'}
              </p>
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 bg-forest/10 text-forest rounded-xl flex items-center justify-center mb-4">
            <i className="ti ti-star text-2xl"></i>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Note moyenne</h3>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-100 rounded animate-pulse mt-1"></div>
          ) : (stats?.reviews_count ?? 0) > 0 && stats?.average_rating != null ? (
            <>
              <p className="text-2xl font-bold text-navy">{stats.average_rating}/5</p>
              <p className="text-[11px] text-gray-500 font-bold mt-1">
                Basé sur {stats.reviews_count} avis
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-navy">—</p>
              <p className="text-[11px] text-gray-500 font-bold mt-1">Aucun avis pour le moment</p>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-navy mb-4">Performance mensuelle</h3>
        <div className="h-48 flex items-end justify-between gap-2 px-4">
          {[40, 65, 45, 90, 55, 70, 85].map((h, i) => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-lg relative group">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-forest rounded-t-lg transition-all duration-500" 
                style={{ height: `${h}%` }}
              ></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {h * 10} vues
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 px-4">
          <span>LUN</span><span>MAR</span><span>MER</span><span>JEU</span><span>VEN</span><span>SAM</span><span>DIM</span>
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
                placeholder="Écrivez votre réponse..."
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
              <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">Choisissez un client dans la liste pour commencer à discuter.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeadsManagement({ leads, onViewDetails, onUpdateStatus }: { leads: any[], onViewDetails: (lead: any) => void, onUpdateStatus: (id: number, status: string, price?: number) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-navy">Demandes de devis reçues (Leads)</h3>
      </div>
      <div className="p-6">
        {leads.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Aucune demande reçue pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div 
                key={lead.id} 
                className="p-4 rounded-xl border border-gray-100 hover:border-forest/30 hover:bg-gray-50/50 transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4 cursor-pointer" onClick={() => onViewDetails(lead)}>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {lead.client.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy group-hover:text-forest transition-colors">{lead.client}</h4>
                      <p className="text-xs text-gray-500">{lead.project} • {lead.city}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{lead.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Budget Client</p>
                      <p className="text-sm font-black text-navy">{lead.budget}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      lead.status === 'Nouveau' ? 'bg-green-100 text-green-700' : 
                      lead.status === 'Envoyé' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {lead.status}
                    </span>
                    <div className="flex gap-2">
                      {lead.status === 'Nouveau' && (
                        <>
                          <button 
                            onClick={() => {
                              const price = prompt('Entrez votre estimation de prix (DH) :');
                              if (price) onUpdateStatus(lead.id, 'accepted', parseFloat(price));
                            }}
                            className="bg-forest text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-forest/90 transition-all border-none cursor-pointer"
                          >
                            Accepter
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Refuser cette demande ?')) onUpdateStatus(lead.id, 'rejected');
                            }}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => onViewDetails(lead)}
                        className="bg-navy text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all border-none cursor-pointer"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectGallery({ projects, onDelete, onAddClick, onEditClick, onViewClick }: { projects: any[], onDelete: (id: number) => void, onAddClick: () => void, onEditClick: (project: any) => void, onViewClick: (project: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-navy">Mes Réalisations</h3>
        <button 
          onClick={onAddClick}
          className="bg-forest text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-forest/90 transition-all border-none cursor-pointer"
        >
          + Ajouter un projet
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-400">Votre galerie est vide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => onViewClick(project)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={project.title}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(project);
                    }}
                    className="p-2 bg-white rounded-full text-navy hover:text-forest transition-colors border-none cursor-pointer"
                  >
                    <i className="ti ti-edit"></i>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project.id);
                    }}
                    className="p-2 bg-white rounded-full text-navy hover:text-red-500 transition-colors border-none cursor-pointer"
                  >
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-navy group-hover:text-forest transition-colors">{project.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400">{project.city}</span>
                </div>
                <p className="text-[11px] text-gray-500">Publié le {project.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompanySettings({ profile, onUpdate }: { profile: any, onUpdate: (data: any) => void }) {
  const [success, setSuccess] = useState(false);
  const [localData, setLocalData] = useState({ ...profile });

  useEffect(() => {
    setLocalData({ ...profile });
  }, [profile]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localData); 
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <h3 className="text-lg font-bold text-navy mb-6 uppercase">Profil Professionnel</h3>
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-bold rounded-xl border border-green-100 flex items-center gap-2 animate-scaleIn">
          <i className="ti ti-check text-lg"></i> Vitrine mise à jour avec succès !
        </div>
      )}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Nom de l'enseigne</label>
            <input 
              type="text" 
              value={localData.company_name} 
              onChange={e => setLocalData({ ...localData, company_name: e.target.value })}
              required 
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Catégorie principale</label>
            <input 
              type="text" 
              value={localData.category}
              onChange={e => setLocalData({ ...localData, category: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Ville</label>
            <input 
              type="text" 
              value={localData.city}
              onChange={e => setLocalData({ ...localData, city: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Numéro ICE</label>
            <input 
              type="text" 
              value={localData.ice}
              onChange={e => setLocalData({ ...localData, ice: e.target.value })}
              placeholder="00XXXXXXXXXXXXX" 
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Description de l'activité</label>
            <textarea 
              rows={4} 
              value={localData.description}
              onChange={e => setLocalData({ ...localData, description: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase" 
              placeholder="Décrivez votre savoir-faire..."
            ></textarea>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
          <button type="submit" className="px-8 py-3 rounded-xl text-sm font-bold bg-navy text-white hover:bg-black transition-all border-none cursor-pointer shadow-lg uppercase">
            Mettre à jour ma vitrine
          </button>
        </div>
      </form>
    </div>
  );
}

function AddProductModal({ onClose, onSave }: { onClose: () => void, onSave: (product: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sub_category: '',
    price: '',
    unit: 'm²',
    min_order: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scaleIn h-full max-h-[90vh] flex flex-col">
        <div className="p-6 bg-forest text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg uppercase">Ajouter un nouveau produit</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nom du produit</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Fenêtre Aluminium Noir"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</label>
              <input 
                type="text" 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="Ex: Aluminium"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sous-catégorie</label>
              <input 
                type="text" 
                value={formData.sub_category}
                onChange={e => setFormData({...formData, sub_category: e.target.value})}
                placeholder="Ex: Coulissants"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prix (MAD)</label>
              <input 
                type="text" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="Ex: 1200"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unité</label>
              <select 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none bg-white"
              >
                <option value="m²">m²</option>
                <option value="unité">Unité</option>
                <option value="kg">kg</option>
                <option value="sac">Sac</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commande minimum</label>
              <input 
                type="text" 
                value={formData.min_order}
                onChange={e => setFormData({...formData, min_order: e.target.value})}
                placeholder="Ex: 10 m²"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Détails du produit..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all uppercase"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 shrink-0">
            <button 
              type="submit"
              className="flex-1 py-4 rounded-xl font-bold text-sm bg-forest text-white shadow-lg shadow-green-100 hover:scale-[1.02] transition-all border-none cursor-pointer uppercase"
            >
              Publier le produit
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border-none cursor-pointer uppercase"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onAccept, onRefuse }: { lead: any, onClose: () => void, onAccept: () => void, onRefuse: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className="p-6 bg-navy text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {lead.client.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{lead.client}</h3>
              <p className="text-xs text-white/60">{lead.project}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coordonnées</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-navy">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-forest">
                    <i className="ti ti-phone"></i>
                  </div>
                  <span className="text-sm font-bold">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-navy">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-forest">
                    <i className="ti ti-mail"></i>
                  </div>
                  <span className="text-sm font-bold">{lead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-navy">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-forest">
                    <i className="ti ti-map-pin"></i>
                  </div>
                  <span className="text-sm font-bold">{lead.city}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détails du projet</h4>
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Budget estimé</span>
                  <span className="text-sm font-black text-forest">{lead.budget}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Date de demande</span>
                  <span className="text-xs text-navy font-bold">{lead.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Statut</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${lead.status === 'Nouveau' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description du besoin</h4>
            <p className="text-sm text-navy leading-relaxed bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
              "{lead.description}"
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            {lead.status === 'Envoyé' ? (
              <div className="w-full p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-center font-bold text-sm">
                <i className="ti ti-check mr-2"></i> Devis déjà envoyé au client
              </div>
            ) : (
              <>
                <button 
                  onClick={onAccept}
                  className="flex-1 py-4 rounded-xl font-bold text-sm bg-forest text-white shadow-lg shadow-green-100 hover:scale-[1.02] transition-all border-none cursor-pointer"
                >
                  Accepter & Envoyer un Devis
                </button>
                <button 
                  onClick={onRefuse}
                  className="flex-1 py-4 rounded-xl font-bold text-sm bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                  Refuser la demande
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SendQuoteModal({ lead, onClose, onSend }: { lead: any, onClose: () => void, onSend: (data: any) => void }) {
  const [formData, setFormData] = useState({
    description: '',
    duration: '',
    materials: '',
    total: '',
    breakdown: [{ item: '', cost: '' }]
  });

  const addBreakdownLine = () => {
    setFormData({
      ...formData,
      breakdown: [...formData.breakdown, { item: '', cost: '' }]
    });
  };

  const updateBreakdownLine = (index: number, field: string, value: string) => {
    const newBreakdown = [...formData.breakdown];
    newBreakdown[index] = { ...newBreakdown[index], [field]: value };
    setFormData({ ...formData, breakdown: newBreakdown });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn h-full max-h-[90vh] flex flex-col">
        <div className="p-6 bg-forest text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Préparer le Devis pour {lead.client}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description des travaux prévus</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Expliquez ce que vous allez réaliser..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Durée estimée</label>
              <input 
                type="text" 
                required
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                placeholder="Ex: 5 jours, 2 semaines..."
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matériaux principaux</label>
              <input 
                type="text" 
                required
                value={formData.materials}
                onChange={e => setFormData({...formData, materials: e.target.value})}
                placeholder="Ex: Ciment, Carrelage..."
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détail des coûts (Lignes de devis)</label>
              <button 
                type="button" 
                onClick={addBreakdownLine}
                className="text-[10px] font-bold text-forest hover:underline bg-transparent border-none cursor-pointer"
              >
                + Ajouter une ligne
              </button>
            </div>
            {formData.breakdown.map((line, idx) => (
              <div key={idx} className="flex gap-4">
                <input 
                  type="text" 
                  required
                  placeholder="Désignation (ex: Main d'œuvre)"
                  value={line.item}
                  onChange={e => updateBreakdownLine(idx, 'item', e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
                />
                <input 
                  type="text" 
                  required
                  placeholder="Prix (ex: 5000 DH)"
                  value={line.cost}
                  onChange={e => updateBreakdownLine(idx, 'cost', e.target.value)}
                  className="w-32 p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Montant Total Estimé (DH)</label>
            <input 
              type="text" 
              required
              value={formData.total}
              onChange={e => setFormData({...formData, total: e.target.value})}
              placeholder="Ex: 12,000"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-black text-forest focus:border-forest outline-none transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4 shrink-0">
            <button 
              type="submit"
              className="flex-1 py-4 rounded-xl font-bold text-sm bg-forest text-white shadow-lg shadow-green-100 hover:scale-[1.02] transition-all border-none cursor-pointer"
            >
              Envoyer le devis au client
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border-none cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewProjectModal({ project, onClose }: { project: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-scaleIn flex flex-col md:flex-row h-full max-h-[90vh]">
        {/* Image Side */}
        <div className="md:w-[45%] h-[300px] md:h-auto relative overflow-hidden bg-gray-100">
          <img 
            src={project.image} 
            className="w-full h-full object-cover"
            alt={project.title}
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-forest shadow-lg uppercase tracking-wider">
              <i className="ti ti-tag mr-2"></i>{project.category}
            </span>
            <span className="bg-navy/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-white shadow-lg uppercase tracking-wider">
              <i className="ti ti-tool mr-2"></i>{project.projectType || 'Réalisation'}
            </span>
          </div>
        </div>

        {/* Info Side */}
        <div className="md:w-[55%] flex flex-col p-8 md:p-10 bg-white overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1 pr-4">
              <h3 className="text-3xl font-black text-navy leading-[1.1] mb-2">{project.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-calendar-event text-forest"></i> Publié le {project.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-map-pin text-forest"></i> {project.city}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400 border-none bg-transparent cursor-pointer group">
              <i className="ti ti-x text-2xl group-hover:rotate-90 transition-transform"></i>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-forest/5 p-5 rounded-3xl border border-forest/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center text-xl shadow-lg shadow-green-100">
                <i className="ti ti-currency-dirham"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Budget</p>
                <p className="text-lg font-black text-navy">{project.budget || 'Sur devis'}</p>
              </div>
            </div>
            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-100">
                <i className="ti ti-clock"></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Durée</p>
                <p className="text-lg font-black text-navy">{project.duration || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Materials Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <i className="ti ti-package text-forest text-sm"></i> Matériaux & Marques utilisés
              </h4>
              <div className="flex flex-wrap gap-2">
                {(project.materials || "Non spécifié").split(',').map((item: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold text-navy flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest"></span> {item.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <i className="ti ti-align-left text-forest text-sm"></i> Description détaillée
              </h4>
              <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 relative overflow-hidden">
                <i className="ti ti-quote text-gray-100 text-6xl absolute -top-2 -right-2 rotate-12"></i>
                <p className="text-[15px] text-navy/80 leading-relaxed relative z-10 font-medium italic">
                  "{project.description || "Aucune description détaillée n'a été fournie pour ce projet."}"
                </p>
              </div>
            </div>
          </div>

          <div className="pt-10 mt-auto">
            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-black text-sm bg-navy text-white shadow-xl shadow-navy/20 hover:bg-black hover:scale-[1.02] transition-all border-none cursor-pointer"
              >
                Fermer l'aperçu
              </button>
              <button className="px-6 py-4 rounded-2xl bg-forest/10 text-forest hover:bg-forest hover:text-white transition-all border-none cursor-pointer">
                <i className="ti ti-share text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProjectModal({ project, onClose, onSave }: { project: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: project.title,
    category: project.category || 'Rénovation',
    city: project.location || project.city || '',
    budget: project.budget || '',
    duration: project.duration || '',
    materials: project.materials || '',
    projectType: project.projectType || 'Intérieur',
    description: project.description || '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(project.image || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, (formData as any)[key]);
    });
    if (selectedFile) {
      data.append('image_file', selectedFile);
    }
    // Add _method for Laravel to handle multipart PUT
    data.append('_method', 'PUT');
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scaleIn h-full max-h-[90vh] flex flex-col">
        <div className="p-6 bg-navy text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Modifier la réalisation</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Photos du projet</label>
            <div className="flex gap-4 items-start">
              <div 
                onClick={() => document.getElementById('edit-project-image')?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-forest hover:bg-forest/5 transition-all overflow-hidden shrink-0"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <i className="ti ti-camera text-2xl text-gray-400"></i>
                    <span className="text-[10px] font-bold text-gray-400 mt-2">Modifier</span>
                  </>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Modifiez la photo de votre réalisation. Formats acceptés: JPG, PNG. Max 5MB.</p>
                <input 
                  id="edit-project-image"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Titre du projet</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none bg-white"
              >
                <option>Rénovation</option>
                <option>Gros Œuvres</option>
                <option>Menuiserie Aluminium</option>
                <option>Décoration d'intérieur</option>
                <option>Électricité & Plomberie</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ville</label>
              <input 
                type="text" 
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type de projet</label>
              <select 
                value={formData.projectType}
                onChange={e => setFormData({...formData, projectType: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none bg-white"
              >
                <option>Intérieur</option>
                <option>Extérieur</option>
                <option>Construction</option>
                <option>Tertiaire / Bureau</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget approximatif</label>
              <input 
                type="text" 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Durée des travaux</label>
              <input 
                type="text" 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matériaux & Marques</label>
            <input 
              type="text" 
              value={formData.materials}
              onChange={e => setFormData({...formData, materials: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description détaillée</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 shrink-0">
            <button 
              type="submit"
              className="flex-1 py-4 rounded-xl font-bold text-sm bg-navy text-white shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all border-none cursor-pointer"
            >
              Enregistrer les modifications
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border-none cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddProjectModal({ onClose, onSave }: { onClose: () => void, onSave: (project: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Rénovation',
    city: '',
    budget: '',
    duration: '',
    materials: '',
    projectType: 'Intérieur',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, (formData as any)[key]);
    });
    if (selectedFile) {
      data.append('image_file', selectedFile);
    }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scaleIn h-full max-h-[90vh] flex flex-col">
        <div className="p-6 bg-forest text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg">Ajouter une nouvelle réalisation</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Photos du projet</label>
            <div className="flex gap-4 items-start">
              <div 
                onClick={() => document.getElementById('project-image')?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-forest hover:bg-forest/5 transition-all overflow-hidden shrink-0"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <i className="ti ti-camera text-2xl text-gray-400"></i>
                    <span className="text-[10px] font-bold text-gray-400 mt-2">Ajouter</span>
                  </>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Ajoutez une photo représentative de votre travail. Formats acceptés: JPG, PNG. Max 5MB.</p>
                <input 
                  id="project-image"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-forest/10 text-forest px-3 py-1.5 rounded-lg w-fit">
                    <i className="ti ti-check text-sm"></i>
                    <span className="text-xs font-bold truncate max-w-[150px]">{selectedFile.name}</span>
                    <button 
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="bg-transparent border-none text-forest cursor-pointer hover:text-red-500"
                    >
                      <i className="ti ti-x text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Titre du projet</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Villa Moderne Tanger"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catégorie</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none bg-white"
              >
                <option>Rénovation</option>
                <option>Gros Œuvres</option>
                <option>Menuiserie Aluminium</option>
                <option>Décoration d'intérieur</option>
                <option>Électricité & Plomberie</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ville</label>
              <input 
                type="text" 
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="Ex: Casablanca"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type de projet</label>
              <select 
                value={formData.projectType}
                onChange={e => setFormData({...formData, projectType: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none bg-white"
              >
                <option>Intérieur</option>
                <option>Extérieur</option>
                <option>Construction</option>
                <option>Tertiaire / Bureau</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget approximatif</label>
              <input 
                type="text" 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                placeholder="Ex: 150,000 DH"
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Durée des travaux</label>
              <input 
                type="text" 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                placeholder="Ex: 3 semaines, 2 mois..."
                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matériaux & Marques (séparés par des virgules)</label>
            <input 
              type="text" 
              value={formData.materials}
              onChange={e => setFormData({...formData, materials: e.target.value})}
              placeholder="Ex: Peinture Astral, Parquet chêne, LED Philips..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description détaillée</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Décrivez les défis relevés, les techniques utilisées..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-forest outline-none transition-all"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 shrink-0">
            <button 
              type="submit"
              className="flex-1 py-4 rounded-xl font-bold text-sm bg-forest text-white shadow-lg shadow-green-100 hover:scale-[1.02] transition-all border-none cursor-pointer"
            >
              Publier le projet
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all border-none cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LikersManagement({ likers, isLoading }: { likers: any[], isLoading: boolean }) {
  if (isLoading) {
    return <div className="text-center py-10">Chargement des favoris...</div>;
  }

  if (likers.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
        <i className="ti ti-heart-broken text-4xl text-gray-300 mb-4 block"></i>
        <h3 className="text-xl font-bold text-navy mb-2">Aucun intéressé pour le moment</h3>
        <p className="text-gray-500 text-sm">Les utilisateurs qui ajoutent votre profil en favoris apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <i className="ti ti-heart-filled text-red-500"></i>
          Personnes intéressées ({likers.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {likers.map((liker) => (
          <div key={liker.id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
              <i className="ti ti-user text-xl"></i>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-navy mb-1">{liker.name || `${liker.first_name} ${liker.last_name}`}</h3>
              <p className="text-sm text-gray-500">{liker.email}</p>
              {liker.city && (
                <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-gray-400 mt-2">
                  <i className="ti ti-map-pin"></i> {liker.city}
                </div>
              )}
            </div>
            <div className="shrink-0 flex gap-2">
               <button className="px-6 py-2.5 bg-forest text-white rounded-xl font-bold text-xs hover:bg-[#2D4330] transition-colors border-none cursor-pointer flex items-center gap-2">
                  <i className="ti ti-message-2"></i> Contacter
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

