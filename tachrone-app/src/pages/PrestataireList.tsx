import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../data/apiService';

export default function PrestataireList() {
  const PAGE_SIZE = 6;
  const [searchParams] = useSearchParams();
  const { openDevisModal } = useModal();
  const categoryParam = searchParams.get('category') || '';

  const [prestataires, setPrestataires] = useState<any[]>([]);
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

  // Sidebar Filter States
  const [showEntreprises, setShowEntreprises] = useState(true);
  const [showMaalems, setShowMaalems] = useState(true);
  const [cityInput, setCityInput] = useState('');
  const [professionnelType, setProfessionnelType] = useState('Professionnel');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Applied Sidebar States
  const [appliedFilters, setAppliedFilters] = useState({
    city: '',
    type: 'Professionnel',
    showEntreprises: true,
    showMaalems: true
  });

  useEffect(() => {
    const fetchPrestataires = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/professionals');
        if (response.success) {
          const mapped = response.data.map((u: any) => ({
            ...u,
            id: u.id,
            name: u.name || u.professional_profile?.company_name || `${u.first_name} ${u.last_name}`,
            slug: u.slug || u.id.toString(),
            type: u.professional_profile?.type || u.type || 'entreprise',
            category: u.professional_profile?.category || u.category || 'BTP',
            description: u.description || u.professional_profile?.description || 'Expert qualifié sur la plateforme InvestAqary.',
            city: u.city || 'Maroc',
            rating: u.rating || u.professional_profile?.rating || 4.5,
            isBoosted: u.isBoosted || u.professional_profile?.is_verified || false,
            image: u.image || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=500&auto=format&fit=crop",
          }));
          setPrestataires(mapped);
        }
      } catch (error) {
        console.error('Error fetching prestataires:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrestataires();
  }, []);

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

  const availableProfessions = useMemo(() => {
    const categories = prestataires.map(item => item.category).filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [prestataires]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      city: cityInput,
      type: professionnelType,
      showEntreprises,
      showMaalems
    });
  };

  const handleClearFilters = () => {
    setCityInput('');
    setProfessionnelType('Professionnel');
    setShowEntreprises(true);
    setShowMaalems(true);
    setSearchTerm('');
    setAppliedFilters({
      city: '',
      type: 'Professionnel',
      showEntreprises: true,
      showMaalems: true
    });
  };

  const filteredPrestataires = useMemo(() => {
    return prestataires.filter(item => {
      const name = item.name;
      const description = item.description || '';
      const city = item.city || '';
      const category = item.category || '';
      const type = item.type || 'entreprise';

      // 1. Search
      if (searchTerm) {
        const words = searchTerm.toLowerCase().split(' ').filter(w => w.length > 0);
        const searchableText = `${name} ${description} ${city} ${category}`.toLowerCase();
        if (!words.every(word => searchableText.includes(word))) return false;
      }

      // 2. Type (Entreprise/Maalem)
      if (!appliedFilters.showEntreprises && type === 'entreprise') return false;
      if (!appliedFilters.showMaalems && type === 'maalem') return false;

      // 3. City
      if (appliedFilters.city && !city.toLowerCase().includes(appliedFilters.city.toLowerCase())) return false;

      // 4. Profession
      if (appliedFilters.type && appliedFilters.type !== 'Professionnel') {
        const superNormalize = (str: string) => 
          str.normalize('NFD')
             .replace(/[\u0300-\u036f]/g, '')
             .toLowerCase()
             .replace(/[^a-z0-9]/g, '')
             .trim();
             
        const target = superNormalize(appliedFilters.type);
        const current = superNormalize(category || '');
        const currentType = superNormalize(type || '');
        
        // Flexible matching: check if target is in current category or vice-versa
        if (!current.includes(target) && !target.includes(current) && currentType !== target) return false;
      }

      return true;
    });
  }, [prestataires, searchTerm, appliedFilters]);

  const totalResults = filteredPrestataires.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const showPagination = totalPages > 1;

  const paginatedPrestataires = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredPrestataires.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredPrestataires, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters]);

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
      
      <main className="max-w-[1500px] mx-auto px-4 md:px-10 py-8">
        <h1 className="text-xl md:text-2xl font-bold text-[#1E293B] mb-2">Prestataires, Maalems & Artisans BTP au Maroc</h1>
        <p className="text-[#64748B] text-xs mb-8">Comparez les prestataires, maalems et artisans BTP disponibles au Maroc. Consultez les avis vérifiés et obtenez un devis gratuit sur InvestAqary.ma.</p>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl mb-6 text-sm font-bold text-navy shadow-sm cursor-pointer"
        >
          <i className="ti ti-adjustments-horizontal text-forest"></i>
          {isSidebarOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[280px] flex-shrink-0`}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm lg:sticky lg:top-24 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-[#1E293B] text-sm uppercase tracking-wide">
                  <i className="ti ti-adjustments-horizontal text-forest"></i>
                  Filtres
                </div>
                <button onClick={handleClearFilters} className="text-[10px] text-forest font-bold hover:underline uppercase">Effacer les filtres</button>
              </div>

              {/* Search input */}
              <div className="mb-5">
                <div className="relative">
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:border-forest transition-colors">
                    <i className="ti ti-search text-gray-400 mr-2 text-sm"></i>
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-xs text-[#64748B] focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Type Checkboxes */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showEntreprises} 
                      onChange={(e) => setShowEntreprises(e.target.checked)}
                      className="w-4 h-4 accent-forest" 
                    />
                    <span className="text-[11px] font-bold text-[#475569]">Entreprises</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showMaalems} 
                      onChange={(e) => setShowMaalems(e.target.checked)}
                      className="w-4 h-4 accent-forest" 
                    />
                    <span className="text-[11px] font-bold text-[#475569]">Maalems</span>
                  </label>
                </div>

                {/* Profession Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold text-[#1E293B] mb-1.5 uppercase">Professionnel</label>
                  <div className="relative">
                    <select 
                      value={professionnelType}
                      onChange={(e) => setProfessionnelType(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#64748B] focus:outline-none focus:border-forest"
                    >
                      <option value="Professionnel">Toutes les professions</option>
                      {availableProfessions.map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                    <i className="ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                  </div>
                </div>

                {/* City Input */}
                <div>
                  <label className="block text-[10px] font-bold text-[#1E293B] mb-1.5 uppercase">Périmètre</label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Ville (ex: Casablanca)"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#64748B] focus:outline-none focus:border-forest"
                    />
                    <i className="ti ti-map-pin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-[#1E293B] mb-1.5 uppercase">Note minimale</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#64748B] focus:outline-none focus:border-forest"
                    >
                      <option value="0">Toutes les notes</option>
                      <option value="4">4 étoiles et +</option>
                      <option value="3">3 étoiles et +</option>
                    </select>
                    <i className="ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                  </div>
                </div>

                {/* Verified Toggle */}
                <div className="flex items-center justify-between bg-[#F1FDF4] p-2.5 rounded-lg border border-[#D1F7D9]">
                  <div className="flex items-center gap-2">
                    <i className="ti ti-shield-check text-[#12B886] text-sm"></i>
                    <span className="text-[10px] font-bold text-[#099268]">Vérifiés uniquement</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#12B886]"></div>
                  </label>
                </div>

                <button 
                  onClick={handleApplyFilters}
                  className="w-full bg-forest text-white font-bold py-3 rounded-lg text-xs shadow-md hover:bg-[#2D4330] transition-all uppercase"
                >
                  Appliquer le filtre
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full md:flex-1 md:max-w-[400px]">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-forest shadow-sm"
                />
                <button className="absolute right-0 top-0 bottom-0 px-4 bg-forest text-white rounded-r-lg border-none cursor-pointer">
                  <i className="ti ti-search"></i>
                </button>
              </div>

              {showPagination && (
                <div className="flex flex-wrap justify-center items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-300 hover:border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ti ti-chevron-left text-xs"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                        currentPage === page
                          ? 'bg-forest text-white'
                          : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-300 hover:border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ti ti-chevron-right text-xs"></i>
                  </button>
                  <span className="text-[10px] text-gray-400 ml-2 hidden sm:inline">{totalResults} résultats</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-bold text-[#1E293B]">Prestataires disponibles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPrestataires.map(item => {
                const profile = item.professional_profile;
                const name = profile?.company_name || item.name;
                const type = profile?.type || 'maalem';
                const slug = item.id; // Using ID as slug for now since we don't have real slugs in DB yet
                const image = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=500"; // Fallback image

                return (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative cursor-pointer" onClick={() => window.location.href = `/${type === 'maalem' ? 'maalem' : 'entreprise'}/${slug}`}>
                    <div className="relative h-[240px] overflow-hidden">
                      <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                        <i className="ti ti-map-pin text-xs"></i>
                      </div>
                      <div 
                        onClick={(e) => handleLike(item.id, e)}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer hover:scale-110 z-10"
                      >
                        <i className={`ti ${likedProIds.includes(item.id) ? 'ti-heart-filled text-red-500' : 'ti-heart text-gray-400 hover:text-red-500'}`}></i>
                      </div>
                      {/* Company Logo Thumbnail */}
                      <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center p-1 border border-gray-100">
                        <div className="w-full h-full bg-cream rounded flex items-center justify-center font-bold text-forest text-xs uppercase">
                          {name.substring(0, 2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Link to={`/${type === 'maalem' ? 'maalem' : 'entreprise'}/${slug}`} className="text-sm font-bold text-navy truncate hover:text-forest transition-colors no-underline uppercase">
                          {name}
                        </Link>
                        <i className="ti ti-discount-check-filled text-mist text-sm"></i>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <i className="ti ti-star-filled text-mist text-[10px]"></i>
                          <span className="text-[10px] font-bold text-navy">4.5</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="bg-green-50 text-forest text-[9px] font-bold px-2 py-0.5 rounded border border-green-50 uppercase">
                          {profile?.category || 'BTP'}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 leading-relaxed mb-4 line-clamp-3 uppercase">
                        {profile?.description || 'Prestataire qualifié sur InvestAqary.'}
                      </p>

                      <div className="mt-auto flex gap-2">
                        <button 
                          onClick={() => openDevisModal({ proName: name, proId: item.id })}
                          className="flex-1 bg-forest text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2D4330] transition-colors shadow-sm border-none cursor-pointer"
                        >
                          <i className="ti ti-file-text text-xs"></i>
                          Devis
                        </button>
                        <button 
                          className="flex-1 border border-navy text-navy text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-navy hover:text-white transition-all bg-transparent cursor-pointer"
                        >
                          <i className="ti ti-message-2 text-xs"></i>
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
