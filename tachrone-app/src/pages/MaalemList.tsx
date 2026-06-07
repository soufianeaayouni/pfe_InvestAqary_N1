import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../data/apiService';

export default function MaalemList() {
  const PAGE_SIZE = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const { openDevisModal } = useModal();
  const categoryParam = searchParams.get('category') || '';

  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [likedProIds, setLikedProIds] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLikes = async () => {
        try {
          const res = await apiService.get('/likes');
          if (res.success) {
            setLikedProIds(res.data.map((pro: any) => pro.id));
          }
        } catch (error) {
          console.error("Error fetching likes", error);
        }
      };
      fetchLikes();
    }
  }, [isAuthenticated]);

  const handleLike = async (proId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert("Veuillez vous connecter pour ajouter aux favoris.");
      navigate('/login');
      return;
    }
    
    const isCurrentlyLiked = likedProIds.includes(proId);
    
    // Optimistic update
    setLikedProIds(prev => 
      isCurrentlyLiked ? prev.filter(id => id !== proId) : [...prev, proId]
    );
    
    try {
      const res = await apiService.post(`/professionals/${proId}/like`);
      if (!res.success) {
        // Revert on error
        setLikedProIds(prev => 
          isCurrentlyLiked ? [...prev, proId] : prev.filter(id => id !== proId)
        );
      }
    } catch (error) {
      console.error("Error toggling like", error);
      // Revert on error
      setLikedProIds(prev => 
        isCurrentlyLiked ? [...prev, proId] : prev.filter(id => id !== proId)
      );
    }
  };

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/professionals', { 
          category: categoryParam,
          type: 'maalem'
        });
        if (response.success) {
          // Map backend data to match frontend expectations
          const mapped = response.data.map((u: any) => ({
            id: u.id,
            name: u.name || `${u.first_name} ${u.last_name}`,
            slug: u.slug || u.id.toString(),
            category: u.professional_profile?.category || u.category || 'Artisan',
            type: u.professional_profile?.type || 'maalem',
            description: u.professional_profile?.description || u.description,
            city: u.city || 'Maroc',
            rating: u.rating || u.professional_profile?.rating || 4.5,
            verified: u.verified || u.professional_profile?.is_verified || false,
            image: u.image || u.professional_profile?.profile_photo || "https://images.unsplash.com/photo-1590059132213-f91575ee300b?q=80&w=500&auto=format&fit=crop",
          }));
          setProfessionals(mapped);

          // Force update applied filters if categoryParam exists
          if (categoryParam) {
            setAppliedFilters(prev => ({
              ...prev,
              type: categoryParam
            }));
            setProfessionnelType(categoryParam);
          }
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [categoryParam]);

  // Handle Initial Category from URL
  useEffect(() => {
    if (categoryParam) {
      setProfessionnelType(categoryParam);
      setAppliedFilters(prev => ({
        ...prev,
        type: categoryParam
      }));
    }
  }, [categoryParam]);

  // Filter States (Sidebar)
  const [cityInput, setCityInput] = useState('');
  const [professionnelType, setProfessionnelType] = useState('Professionnel');
  const [minRating, setMinRating] = useState('0');
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  // Search State (Top bar)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Applied Sidebar States
  const [appliedFilters, setAppliedFilters] = useState({
    city: '',
    type: 'Professionnel',
    rating: '0',
    verified: false
  });

  // Dynamic Professions for Maalems
  const availableProfessions = useMemo(() => {
    const categories = professionals.map(item => item.category);
    return Array.from(new Set(categories)).sort();
  }, [professionals]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      city: cityInput,
      type: professionnelType,
      rating: minRating,
      verified: onlyVerified
    });
  };

  const handleClearFilters = () => {
    setCityInput('');
    setProfessionnelType('Professionnel');
    setMinRating('0');
    setOnlyVerified(false);
    setSearchTerm('');
    setAppliedFilters({
      city: '',
      type: 'Professionnel',
      rating: '0',
      verified: false
    });
    setSearchParams({});
  };

  const filteredMaalems = useMemo(() => {
    return professionals.filter(item => {
      // Advanced Search Logic (Multi-field & Multi-word)
      if (searchTerm) {
        const words = searchTerm.toLowerCase().split(' ').filter(w => w.length > 0);
        const searchableText = `${item.name} ${item.description} ${item.city} ${item.category}`.toLowerCase();
        
        const matchesSearch = words.every(word => searchableText.includes(word));
        if (!matchesSearch) return false;
      }

      // 3. City (Applied)
      if (appliedFilters.city && !item.city.toLowerCase().includes(appliedFilters.city.toLowerCase())) return false;

      // 5. Professionnel Type Filter (Applied)
       if (appliedFilters.type && appliedFilters.type !== 'Professionnel') {
         const superNormalize = (str: string) => 
           str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '')
              .trim();
              
         const target = superNormalize(appliedFilters.type);
         const current = superNormalize(item.category || '');
         const currentType = superNormalize(item.type || '');
         
         // Flexible matching: check if target is in current category or vice-versa
         if (!current.includes(target) && !target.includes(current) && currentType !== target) return false;
       }

      // 5. Min Rating (Applied)
      if (item.rating < parseFloat(appliedFilters.rating)) return false;

      // 6. Only Verified (Applied)
      if (appliedFilters.verified && !item.verified) return false;

      return true;
    });
  }, [searchTerm, professionals, appliedFilters]);

  const totalResults = filteredMaalems.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const showPagination = totalPages > 1;

  const paginatedMaalems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredMaalems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredMaalems, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters, categoryParam]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-15 py-8">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Maalems & Artisans BTP au Maroc</h1>
        <p className="text-[#64748B] text-sm mb-8">Comparez les artisans et maalems qualifiés. Trouvez l'expert de confiance pour vos travaux de finition.</p>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                  <i className="ti ti-adjustments-horizontal text-xl"></i>
                  Filtres
                </div>
                <button onClick={handleClearFilters} className="text-xs text-forest font-medium hover:underline">Effacer</button>
              </div>

              {/* Search input */}
              <div className="mb-6">
                <div className="relative">
                  <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus-within:border-forest transition-colors">
                    <i className="ti ti-search text-gray-400 mr-2"></i>
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-sm text-[#64748B] focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Type selection - Logical for Maalem Page */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                    <input type="checkbox" checked={false} disabled className="w-4 h-4" />
                    <span className="text-sm text-[#475569]">Entreprises</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-default">
                    <input type="checkbox" checked={true} readOnly className="w-4 h-4 accent-forest" />
                    <span className="text-sm text-[#475569] font-bold">Maalems</span>
                  </label>
                </div>

                {/* Profession selection */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">Professionnel</label>
                  <div className="relative">
                    <select 
                      value={professionnelType}
                      onChange={(e) => setProfessionnelType(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#64748B] focus:outline-none focus:border-forest"
                    >
                      <option value="Professionnel">Toutes les professions</option>
                      {availableProfessions.map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                    <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]"></i>
                  </div>
                </div>

                {/* City selection */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">Périmètre</label>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus-within:border-forest transition-colors">
                      <i className="ti ti-map-pin text-forest mr-2"></i>
                      <input 
                        type="text" 
                        placeholder="Ville (ex: Casablanca)" 
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="w-full text-sm text-[#64748B] focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Rating selection - ADVANCED LOGIC */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">Note minimale</label>
                  <div className="relative">
                    <select 
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#64748B] focus:outline-none focus:border-forest"
                    >
                      <option value="0">Toutes les notes</option>
                      <option value="4.5">★ 4.5 et plus</option>
                      <option value="4">★ 4.0 et plus</option>
                      <option value="3">★ 3.0 et plus</option>
                    </select>
                    <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]"></i>
                  </div>
                </div>

                {/* Verified toggle - ADVANCED LOGIC */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2">
                    <i className="ti ti-shield-check text-forest text-lg"></i>
                    <span className="text-xs font-bold text-forest">Vérifiés uniquement</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest"></div>
                  </label>
                </div>

                <button 
                  onClick={handleApplyFilters}
                  className="w-full bg-forest text-white font-bold py-3 rounded-lg text-sm shadow-lg shadow-green-100 hover:bg-forest/90 transition-all transform active:scale-[0.98]"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="relative flex-1 max-w-[400px]">
                <input 
                  type="text" 
                  placeholder="Rechercher un maalem qualifié.." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-forest shadow-sm"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-forest text-white rounded-md">
                  <i className="ti ti-search"></i>
                </button>
              </div>
              {showPagination && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ti ti-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${
                        currentPage === page
                          ? 'bg-forest text-white'
                          : 'bg-white border border-gray-200 text-gray-500 hover:bg-white transition-colors'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ti ti-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              {paginatedMaalems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                  <div className="relative h-[250px] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {item.verified && (
                      <div className="absolute top-4 left-4 bg-forest/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                        <i className="ti ti-discount-check-filled"></i> VÉRIFIÉ
                      </div>
                    )}
                    <div 
                      onClick={(e) => handleLike(item.id, e)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer hover:scale-110"
                    >
                      <i className={`ti ${likedProIds.includes(item.id) ? 'ti-heart-filled text-red-500' : 'ti-heart text-gray-400 hover:text-red-500'}`}></i>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link to={`/maalem/${item.slug}`} className="text-lg font-bold text-[#1E293B] hover:text-forest transition-colors no-underline block mb-1">
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="flex text-forest text-xs">
                            <i className="ti ti-star-filled"></i>
                            <i className="ti ti-star-filled"></i>
                            <i className="ti ti-star-filled"></i>
                            <i className="ti ti-star-filled"></i>
                            <i className="ti ti-star-half-filled"></i>
                          </span>
                          <span className="text-xs font-bold text-[#1E293B]">{item.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-forest bg-green-50 px-2 py-1 rounded uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
                      <span className="flex items-center gap-1"><i className="ti ti-map-pin text-forest"></i> {item.city}</span>
                      <span className="text-gray-200">|</span>
                      <span className="flex items-center gap-1"><i className="ti ti-briefcase text-forest"></i> 10+ ans d'exp</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Link 
                        to={`/maalem/${item.slug}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-xs font-bold text-[#1E293B] hover:bg-gray-50 transition-colors no-underline"
                      >
                        Voir profil
                      </Link>
                      <button 
                        onClick={() => openDevisModal({ proName: item.name, proId: item.id })}
                        className="flex items-center justify-center gap-2 bg-forest text-white text-xs font-bold py-2.5 rounded-lg hover:bg-forest/90 transition-all shadow-md shadow-green-100 cursor-pointer"
                      >
                        <i className="ti ti-file-text"></i> Devis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
