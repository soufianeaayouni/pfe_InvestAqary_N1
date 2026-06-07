import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../data/apiService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'content' | 'consultations'>('overview');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // State for real data
  const [users, setUsers] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, statsRes, simulationsRes, projectsRes, productsRes] = await Promise.all([
          apiService.get('/admin/users'),
          apiService.get('/admin/stats'),
          apiService.get('/admin/simulations'),
          apiService.get('/admin/projects'),
          apiService.get('/admin/products')
        ]);

        if (usersRes.success) {
          setUsers(usersRes.data);
          setProviders(usersRes.data.filter((u: any) => u.role === 'pro'));
        }
        if (statsRes.success) setStats(statsRes.data);
        if (simulationsRes.success) setConsultations(simulationsRes.data);
        if (projectsRes.success) setProjects(projectsRes.data);
        if (productsRes.success) setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const deleteUser = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const res = await apiService.delete(`/admin/users/${id}`);
        if (res.success) {
          setUsers(prev => prev.filter(u => u.id !== id));
          setProviders(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const deleteProject = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        const res = await apiService.delete(`/admin/projects/${id}`);
        if (res.success) {
          setProjects(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleProjectStatus = async (id: number) => {
    try {
      const res = await apiService.post(`/admin/projects/${id}/toggle`, {});
      if (res.success) {
        setProjects(prev => prev.map(p => p.id === id ? res.data : p));
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const res = await apiService.delete(`/admin/products/${id}`);
        if (res.success) {
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const deleteSimulation = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette simulation ?')) {
      try {
        const res = await apiService.delete(`/admin/simulations/${id}`);
        if (res.success) {
          setConsultations(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleProductStatus = async (id: number) => {
    try {
      const res = await apiService.post(`/admin/products/${id}/toggle`, {});
      if (res.success) {
        setProducts(prev => prev.map(p => p.id === id ? res.data : p));
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header hideNav={true} />
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-15 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden lg:sticky lg:top-24">
              <div className="p-6 border-b border-gray-100 bg-navy text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Admin Panel</h2>
                    <p className="text-[11px] text-gray-300">{user?.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                    title="Déconnexion"
                  >
                    <i className="ti ti-logout text-xl"></i>
                  </button>
                </div>
              </div>
              <nav className="p-4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 no-scrollbar">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-layout-dashboard text-lg"></i> Vue d'ensemble
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-users text-lg"></i> Utilisateurs
                </button>
                <button 
                  onClick={() => setActiveTab('providers')}
                  className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'providers' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-hammer text-lg"></i> Prestataires
                </button>
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'content' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-layout-grid text-lg"></i> Contenus
                </button>
                <button 
                  onClick={() => setActiveTab('consultations')}
                  className={`flex-none lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'consultations' ? 'bg-forest text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className="ti ti-file-text text-lg"></i> Consultations
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <OverviewAdmin 
                stats={stats} 
                consultations={consultations} 
                onSetActiveTab={setActiveTab} 
                onOpenApproval={() => setShowApprovalModal(true)}
              />
            )}
            {activeTab === 'users' && (
              <UserManagement 
                users={users} 
                onDelete={deleteUser} 
                onUpdateStatus={async (id, status) => {
                  try {
                    const res = await apiService.post(`/admin/users/${id}/status`, { status });
                    if (res.success) {
                      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: res.data.status } : u));
                      // Refresh stats to update alert count
                      const statsRes = await apiService.get('/admin/stats');
                      if (statsRes.success) setStats(statsRes.data);
                    }
                  } catch (error) {
                    alert('Erreur lors de la modification du statut');
                  }
                }}
              />
            )}
            {activeTab === 'providers' && (
              <ProviderManagement 
                providers={providers} 
                onDelete={deleteUser} 
                onToggleVerification={async (id) => {
                  try {
                    const res = await apiService.post(`/admin/users/${id}/toggle-verification`, {});
                    if (res.success) {
                      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
                      setProviders(prev => prev.map(p => p.id === id ? res.data : p));
                      // Refresh stats to update alert count
                      const statsRes = await apiService.get('/admin/stats');
                      if (statsRes.success) setStats(statsRes.data);
                    }
                  } catch (error) {
                    alert('Erreur lors de la modification');
                  }
                }}
              />
            )}
            {activeTab === 'content' && (
              <ContentModeration 
                projects={projects} 
                products={products}
                onToggleStatus={toggleProjectStatus} 
                onDelete={deleteProject} 
                onToggleProductStatus={toggleProductStatus}
                onDeleteProduct={deleteProduct}
              />
            )}
            {activeTab === 'consultations' && (
              <ConsultationTracking 
                consultations={consultations} 
                onDelete={deleteSimulation}
              />
            )}
          </div>
        </div>
      </main>

      {showApprovalModal && (
        <QuickApprovalModal 
          users={users} 
          onClose={() => setShowApprovalModal(false)}
          onApprove={async (id) => {
            try {
              const res = await apiService.post(`/admin/users/${id}/status`, { status: 'active' });
              if (res.success) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
                // Refresh stats
                const statsRes = await apiService.get('/admin/stats');
                if (statsRes.success) setStats(statsRes.data);
              }
            } catch (error) {
              alert('Erreur lors de l\'activation');
            }
          }}
          onReject={deleteUser}
        />
      )}

      <Footer />
    </div>
  );
}

function QuickApprovalModal({ 
  users, 
  onClose, 
  onApprove, 
  onReject 
}: { 
  users: any[], 
  onClose: () => void, 
  onApprove: (id: number) => void, 
  onReject: (id: number) => void 
}) {
  const pendingUsers = users.filter(u => u.status === 'pending');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn flex flex-col max-h-[80vh]">
        <div className="p-6 bg-red-500 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <i className="ti ti-user-plus text-2xl"></i>
            <h3 className="font-bold text-lg">Approbation des comptes</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer">
            <i className="ti ti-x text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {pendingUsers.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                <i className="ti ti-check"></i>
              </div>
              <p className="text-gray-500 font-bold">Aucun compte en attente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-navy shadow-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{u.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onApprove(u.id)}
                      className="px-4 py-2 bg-forest text-white rounded-xl text-xs font-bold hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-2"
                    >
                      <i className="ti ti-check"></i> Accepter
                    </button>
                    <button 
                      onClick={() => onReject(u.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                      title="Supprimer"
                    >
                      <i className="ti ti-trash text-lg"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center shrink-0">
          <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-navy transition-all bg-transparent border-none cursor-pointer">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewAdmin({ stats, onSetActiveTab, onOpenApproval }: { stats: any, onSetActiveTab: (tab: any) => void, onOpenApproval: () => void }) {
  const displayStats = [
    { label: 'Utilisateurs', count: stats?.total_users || 0, icon: 'ti-users', color: 'bg-blue-50 text-blue-600' },
    { label: 'Prestataires', count: stats?.total_pros || 0, icon: 'ti-hammer', color: 'bg-green-50 text-green-600' },
    { label: 'Projets', count: stats?.total_projects || 0, icon: 'ti-layout-grid', color: 'bg-purple-50 text-purple-600' },
    { label: 'Produits', count: stats?.total_products || 0, icon: 'ti-package', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Simulations', count: stats?.total_simulations || 0, icon: 'ti-file-text', color: 'bg-orange-50 text-orange-600' },
  ];

  const unverifiedCount = stats?.unverified_pros_count || 0;
  const pendingUsersCount = stats?.pending_users_count || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => {
              if (stat.label === 'Utilisateurs') onSetActiveTab('users');
              if (stat.label === 'Prestataires') onSetActiveTab('providers');
              if (stat.label === 'Projets' || stat.label === 'Produits') onSetActiveTab('content');
              if (stat.label === 'Simulations') onSetActiveTab('consultations');
            }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
              <i className={`ti ${stat.icon}`}></i>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-black text-navy mt-1">{stat.count}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-navy">Alertes Système</h3>
            {(unverifiedCount > 0 || pendingUsersCount > 0) && (
              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Action requise</span>
            )}
          </div>
          <div className="p-6 space-y-4 flex-1">
            {pendingUsersCount > 0 && (
              <div className="flex items-center gap-4 p-4 bg-red-50/50 rounded-xl border border-red-100 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500">
                  <i className="ti ti-user-plus text-xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">{pendingUsersCount} nouveaux comptes à activer</p>
                  <p className="text-xs text-gray-500">Nouveaux utilisateurs en attente d'approbation.</p>
                </div>
                <button 
                  onClick={onOpenApproval}
                  className="text-xs font-bold text-forest hover:underline bg-transparent border-none cursor-pointer"
                >
                  Gérer
                </button>
              </div>
            )}
            {unverifiedCount > 0 && (
              <div className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500">
                  <i className="ti ti-alert-triangle text-xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">{unverifiedCount} prestataires à vérifier</p>
                  <p className="text-xs text-gray-500">Documents d'identité et ICE في انتظار المراجعة.</p>
                </div>
                <button 
                  onClick={() => onSetActiveTab('providers')}
                  className="text-xs font-bold text-forest hover:underline bg-transparent border-none cursor-pointer"
                >
                  Gérer
                </button>
              </div>
            )}
            {unverifiedCount === 0 && pendingUsersCount === 0 && (
              <div className="flex items-center gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500">
                  <i className="ti ti-check text-xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">Aucune alerte critique</p>
                  <p className="text-xs text-gray-500">Tout est sous contrôle.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-navy">Activités Récentes</h3>
            <i className="ti ti-history text-gray-400"></i>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {stats?.recent_activities?.length > 0 ? (
              stats.recent_activities.map((activity: any, idx: number) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== stats.recent_activities.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-24px] w-[1px] bg-gray-100"></div>
                  )}
                  <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 z-10 ${activity.color}`}>
                    <i className={`ti ${activity.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-navy">{activity.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm italic">
                Aucune activité récente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagement({ users, onDelete, onUpdateStatus }: { users: any[], onDelete: (id: number) => void, onUpdateStatus: (id: number, status: string) => void }) {
  // Search and Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Count pending by type for badges
  const pendingMaalemCount = useMemo(() => users.filter(u => u.role === 'pro' && u.status === 'pending' && u.professional_profile?.type === 'maalem').length, [users]);
  const pendingEntrepriseCount = useMemo(() => users.filter(u => u.role === 'pro' && u.status === 'pending' && u.professional_profile?.type === 'entreprise').length, [users]);
  const pendingClientCount = useMemo(() => users.filter(u => u.role === 'client' && u.status === 'pending').length, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const name = u.name || `${u.first_name || ''} ${u.last_name || ''}`;
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                            u.email.toLowerCase().includes(search.toLowerCase());
      
      // Role / type filter
      let matchesRole = true;
      if (roleFilter === 'all') {
        matchesRole = true;
      } else if (roleFilter === 'maalem') {
        matchesRole = u.role === 'pro' && u.professional_profile?.type === 'maalem';
      } else if (roleFilter === 'entreprise') {
        matchesRole = u.role === 'pro' && u.professional_profile?.type === 'entreprise';
      } else {
        matchesRole = u.role === roleFilter;
      }

      // Status filter
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Helper to get display type for a user
  const getUserTypeLabel = (user: any) => {
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'client') return 'Client';
    if (user.role === 'pro') {
      const type = user.professional_profile?.type;
      if (type === 'maalem') return 'Maalem';
      if (type === 'entreprise') return 'Entreprise';
      if (type === 'fournisseur') return 'Fournisseur';
      return 'Pro';
    }
    return user.role;
  };

  const getUserTypeColor = (user: any) => {
    if (user.role === 'admin') return 'bg-purple-50 text-purple-600';
    if (user.role === 'client') return 'bg-green-50 text-green-600';
    const type = user.professional_profile?.type;
    if (type === 'maalem') return 'bg-amber-50 text-amber-700';
    if (type === 'entreprise') return 'bg-blue-50 text-blue-600';
    if (type === 'fournisseur') return 'bg-indigo-50 text-indigo-600';
    return 'bg-blue-50 text-blue-600';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-navy">Gestion des Utilisateurs</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest transition-all"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest outline-none bg-white font-medium text-gray-600"
          >
            <option value="all">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="pro">Tous les Professionnels</option>
            <option value="maalem">🔨 Maalems {pendingMaalemCount > 0 ? `(${pendingMaalemCount} en attente)` : ''}</option>
            <option value="entreprise">🏢 Entreprises {pendingEntrepriseCount > 0 ? `(${pendingEntrepriseCount} en attente)` : ''}</option>
            <option value="admin">Administrateurs</option>
          </select>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest outline-none bg-white font-medium text-gray-600"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">⏳ En attente</option>
            <option value="active">✅ Actifs</option>
            <option value="suspended">🚫 Suspendus</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${user.status === 'pending' ? 'bg-orange-50/30' : ''}`}
              >
                <td className="px-6 py-4 text-sm text-gray-400">#{user.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-navy">{user.name || `${user.first_name} ${user.last_name}`}</div>
                  <div className="text-[11px] text-gray-400">{user.email}</div>
                  {user.city && <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><i className="ti ti-map-pin text-forest"></i>{user.city}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getUserTypeColor(user)}`}>
                    {getUserTypeLabel(user)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-500">
                    {user.professional_profile?.category || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.status === 'active' ? 'bg-green-50 text-green-600' : 
                    user.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                    'bg-red-50 text-red-600'
                  }`}>
                    {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : user.status === 'suspended' ? 'Suspendu' : (user.status || 'actif')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-navy hover:text-white transition-all border-none cursor-pointer flex items-center justify-center animate-pulse-slow"
                      title="Voir les détails"
                    >
                      <i className="ti ti-eye"></i>
                    </button>
                    {user.status === 'pending' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(user.id, 'active'); }}
                        className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all border-none cursor-pointer"
                        title="Accepter"
                      >
                        <i className="ti ti-check"></i>
                      </button>
                    )}
                    {user.status === 'active' && user.role !== 'admin' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(user.id, 'suspended'); }}
                        className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all border-none cursor-pointer"
                        title="Suspendre"
                      >
                        <i className="ti ti-ban"></i>
                      </button>
                    )}
                    {user.status === 'suspended' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(user.id, 'active'); }}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all border-none cursor-pointer"
                        title="Réactiver"
                      >
                        <i className="ti ti-refresh"></i>
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDelete(user.id); }} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"><i className="ti ti-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">Aucun utilisateur trouvé.</div>
        )}
      </div>

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-navy text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <i className="ti ti-info-circle text-2xl"></i>
                <h3 className="font-bold text-lg">Détails de l'utilisateur</h3>
              </div>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer"
              >
                <i className="ti ti-x text-2xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 flex-1 overflow-y-auto space-y-6">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-forest/10 text-forest flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  {(selectedUser.name || `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-navy truncate">{selectedUser.name || `${selectedUser.first_name} ${selectedUser.last_name}`}</h4>
                  <p className="text-xs text-gray-500 truncate">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getUserTypeColor(selectedUser)}`}>
                      {getUserTypeLabel(selectedUser)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedUser.status === 'active' ? 'bg-green-50 text-green-600' : 
                      selectedUser.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {selectedUser.status === 'active' ? 'Actif' : selectedUser.status === 'pending' ? 'En attente' : selectedUser.status === 'suspended' ? 'Suspendu' : (selectedUser.status || 'actif')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informations</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Téléphone</p>
                    <p className="text-sm font-bold text-navy mt-0.5">
                      {selectedUser.phone ? (
                        <a href={`tel:${selectedUser.phone}`} className="text-navy hover:text-forest no-underline flex items-center gap-1">
                          <i className="ti ti-phone text-forest"></i>
                          {selectedUser.phone}
                        </a>
                      ) : '—'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Ville / Région</p>
                    <p className="text-sm font-bold text-navy mt-0.5 flex items-center gap-1">
                      <i className="ti ti-map-pin text-forest"></i>
                      {selectedUser.city || 'Maroc'}
                    </p>
                  </div>
                  {selectedUser.role === 'pro' && (
                    <>
                      <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Catégorie</p>
                        <p className="text-sm font-bold text-navy mt-0.5 flex items-center gap-1">
                          <i className="ti ti-category text-forest"></i>
                          {selectedUser.professional_profile?.category || '—'}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Vérification</p>
                        <p className="text-sm font-bold mt-0.5 flex items-center gap-1">
                          <span className={selectedUser.professional_profile?.is_verified ? 'text-green-600' : 'text-orange-500'}>
                            <i className={`ti ${selectedUser.professional_profile?.is_verified ? 'ti-circle-check' : 'ti-alert-circle'}`}></i>
                            {selectedUser.professional_profile?.is_verified ? 'Vérifié' : 'Non vérifié'}
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                  <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Date d'inscription</p>
                    <p className="text-sm font-bold text-navy mt-0.5 flex items-center gap-1">
                      <i className="ti ti-calendar text-forest"></i>
                      {new Date(selectedUser.created_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 justify-between shrink-0">
              <div className="flex gap-2">
                {selectedUser.status === 'pending' && (
                  <button 
                    onClick={() => {
                      onUpdateStatus(selectedUser.id, 'active');
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-2"
                  >
                    <i className="ti ti-check"></i> Accepter
                  </button>
                )}
                {selectedUser.status === 'active' && selectedUser.role !== 'admin' && (
                  <button 
                    onClick={() => {
                      onUpdateStatus(selectedUser.id, 'suspended');
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-2"
                  >
                    <i className="ti ti-ban"></i> Suspendre
                  </button>
                )}
                {selectedUser.status === 'suspended' && (
                  <button 
                    onClick={() => {
                      onUpdateStatus(selectedUser.id, 'active');
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-2"
                  >
                    <i className="ti ti-refresh"></i> Réactiver
                  </button>
                )}
                {selectedUser.role !== 'admin' && (
                  <button 
                    onClick={() => {
                      onDelete(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-bold transition-all border-none cursor-pointer flex items-center gap-2"
                  >
                    <i className="ti ti-trash"></i> Refuser / Supprimer
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-bold transition-all border-none cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderManagement({ providers, onDelete, onToggleVerification }: { providers: any[], onDelete: (id: number) => void, onToggleVerification: (id: number) => void }) {
  // Search and Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const name = p.professional_profile?.company_name || p.name || `${p.first_name || ''} ${p.last_name || ''}`;
      const category = p.professional_profile?.category || '';
      const city = p.city || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                            category.toLowerCase().includes(search.toLowerCase()) ||
                            city.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || p.professional_profile?.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [providers, search, typeFilter]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-navy">Gestion des Prestataires</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Rechercher par nom, catégorie, ville..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest transition-all"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest outline-none bg-white font-medium text-gray-600"
          >
            <option value="all">Tous les types</option>
            <option value="entreprise">Entreprises</option>
            <option value="maalem">Maalems</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prestataire</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProviders.map((pro) => (
              <tr key={pro.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-navy">
                      {(pro.professional_profile?.company_name || pro.name || 'P').substring(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-navy">{pro.professional_profile?.company_name || pro.name}</div>
                      <div className="text-[11px] text-gray-400">{pro.city || 'Maroc'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-600 font-medium">{pro.professional_profile?.category || 'BTP'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${pro.professional_profile?.type === 'entreprise' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-forest'}`}>
                    {pro.professional_profile?.type || 'Maalem'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold ${pro.professional_profile?.is_verified ? 'text-green-500' : 'text-orange-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${pro.professional_profile?.is_verified ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                    {pro.professional_profile?.is_verified ? 'Vérifié' : 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onToggleVerification(pro.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border-none cursor-pointer ${pro.professional_profile?.is_verified ? 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'}`}
                      title={pro.professional_profile?.is_verified ? 'Dé-vérifier' : 'Vérifier'}
                    >
                      <i className={`ti ${pro.professional_profile?.is_verified ? 'ti-x' : 'ti-check'}`}></i>
                    </button>
                    <button onClick={() => onDelete(pro.id)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"><i className="ti ti-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProviders.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">Aucun prestataire trouvé.</div>
        )}
      </div>
    </div>
  );
}

function ContentModeration({ 
  projects, 
  products,
  onToggleStatus, 
  onDelete,
  onToggleProductStatus,
  onDeleteProduct
}: { 
  projects: any[], 
  products: any[],
  onToggleStatus: (id: number) => void, 
  onDelete: (id: number) => void,
  onToggleProductStatus: (id: number) => void,
  onDeleteProduct: (id: number) => void
}) {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'products'>('projects');
  const [search, setSearch] = useState('');
  
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      (p.category || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.category || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-navy">Modération des Contenus</h2>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveSubTab('projects')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'projects' ? 'bg-white text-navy shadow-sm' : 'text-gray-400'}`}
              >
                Projets
              </button>
              <button 
                onClick={() => setActiveSubTab('products')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'products' ? 'bg-white text-navy shadow-sm' : 'text-gray-400'}`}
              >
                Produits
              </button>
            </div>
          </div>
          <div className="relative">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder={`Rechercher un ${activeSubTab === 'projects' ? 'projet' : 'produit'}...`} 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{activeSubTab === 'projects' ? 'Projet' : 'Produit'}</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Auteur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeSubTab === 'projects' ? (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={project.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=200'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div className="text-sm font-bold text-navy line-clamp-1">{project.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-600">
                      {project.user?.professional_profile?.company_name || project.user?.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-bold uppercase">
                      {project.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        project.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onToggleStatus(project.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border-none cursor-pointer ${
                            project.status === 'online' ? 'bg-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white' : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white'
                          }`}
                          title={project.status === 'online' ? 'Mettre hors ligne' : 'Mettre en ligne'}
                        >
                          <i className={`ti ${project.status === 'online' ? 'ti-eye-off' : 'ti-eye'}`}></i>
                        </button>
                        <button onClick={() => onDelete(project.id)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"><i className="ti ti-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div className="text-sm font-bold text-navy line-clamp-1">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-600">
                      {product.user?.professional_profile?.company_name || product.user?.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-bold uppercase">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        product.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onToggleProductStatus(product.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border-none cursor-pointer ${
                            product.status === 'online' ? 'bg-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white' : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white'
                          }`}
                          title={product.status === 'online' ? 'Mettre hors ligne' : 'Mettre en ligne'}
                        >
                          <i className={`ti ${product.status === 'online' ? 'ti-eye-off' : 'ti-eye'}`}></i>
                        </button>
                        <button onClick={() => onDeleteProduct(product.id)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"><i className="ti ti-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {(activeSubTab === 'projects' ? filteredProjects.length : filteredProducts.length) === 0 && (
            <div className="p-10 text-center text-gray-400 text-sm">Aucun contenu trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConsultationTracking({ consultations, onDelete }: { consultations: any[], onDelete: (id: number) => void }) {
  const [search, setSearch] = useState('');
  
  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => 
      (c.user?.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (c.project_type || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [consultations, search]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-navy mb-6">Suivi des Simulations</h2>
        <div className="relative">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Rechercher par client ou type..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-forest transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type de projet</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Surface</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredConsultations.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-navy">{c.user?.name || 'Visiteur'}</div>
                  <div className="text-[11px] text-gray-400">{c.user?.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-forest uppercase">{c.project_type}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{c.area} m²</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-navy">{c.budget_min} - {c.budget_max} DH</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onDelete(c.id)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"
                    title="Supprimer"
                  >
                    <i className="ti ti-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredConsultations.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm italic">
            <i className="ti ti-info-circle text-lg mb-2 block"></i>
            Aucune simulation trouvée.
          </div>
        )}
      </div>
    </div>
  );
}
