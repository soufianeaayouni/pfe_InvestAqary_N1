import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { apiService } from '../data/apiService';

const defaultSubCategories: Record<string, string[]> = {
  "Aluminium": ["Coulissants", "Frappe", "Garde corps", "Mur rideau", "Portail", "Portes", "Véranda", "Volet roulant", "Autres"],
  "Revêtement sol": ["Parquet", "Carrelage", "Marbre", "Résine", "Parquet stratifié", "Plinthes"],
  "Plomberie": ["Tuyauterie", "Sanitaire", "Robinetterie", "Chauffage", "Chauffe-eau"],
  "Peinture": ["Intérieur", "Extérieur", "Enduits", "Outillage"],
};

const categoryHeroContent: Record<string, { title: string; description: string }> = {
  "Aluminium": {
    title: "Menuiserie Aluminium au Maroc - Fournisseurs de Matériaux BTP - Devis & Prix",
    description: "Retrouvez les fabricants et fournisseurs de menuiserie aluminium au Maroc : fenêtres double vitrage, portes coulissantes, volets roulants et garde-corps. Comparez les devis, consultez les références et choisissez votre prestataire.",
  },
  "Climatisation/chauffage": {
    title: "Climatisation et Chauffage au Maroc - Fournisseurs BTP - Devis & Prix",
    description: "Retrouvez les fabricants et fournisseurs de climatisation et chauffage au Maroc : climatiseurs, systèmes split, gainables, ventilation et solutions thermiques. Comparez les devis, consultez les références et choisissez le bon fournisseur.",
  },
};

export default function SupplierList() {
  const PAGE_SIZE = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [viewMode, setViewMode] = useState<'fournisseurs' | 'produits'>('fournisseurs');
  const [currentPage, setCurrentPage] = useState(1);
  const { openDevisModal } = useModal();

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [suppliersRes, productsRes] = await Promise.all([
          apiService.get('/professionals', { type: 'fournisseur' }),
          apiService.get('/products')
        ]);

        if (suppliersRes.success && Array.isArray(suppliersRes.data)) {
          setSuppliers(suppliersRes.data.map((u: any) => ({
            ...u,
            category: u.category || u.professional_profile?.category || 'Matériaux',
            description: u.professional_profile?.description || u.description,
            city: u.city || 'Maroc',
          })));
        }
        if (productsRes.success && Array.isArray(productsRes.data)) {
          setProducts(productsRes.data);
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Dynamic Sub-categories based on categoryParam
  const currentSubCats = useMemo(() => {
    return defaultSubCategories[categoryParam] || [];
  }, [categoryParam]);

  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);

  // Update selectedSubCats when category changes
  useEffect(() => {
    setSelectedSubCats(defaultSubCategories[categoryParam] || []);
  }, [categoryParam]);

  const toggleSubCat = (cat: string) => {
    setSelectedSubCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleAll = () => {
    if (selectedSubCats.length === currentSubCats.length) {
      setSelectedSubCats([]);
    } else {
      setSelectedSubCats(currentSubCats);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCity('');
    setSelectedSubCats(currentSubCats);
    setSearchParams({});
  };

  const handleApplyFilters = () => {
    // Scroll to results or show feedback
    const element = document.getElementById('results-count');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearCategory = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('category');
      return next;
    });
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(item => {
      const name = item.name || item.professional_profile?.company_name;
      const category = item.category || item.professional_profile?.category || '';
      const itemCity = item.city || item.address || 'Maroc';

      // 1. Search
      if (searchTerm) {
        const words = searchTerm.toLowerCase().split(' ').filter(w => w.length > 0);
        const searchableText = `${name} ${item.description || ''} ${itemCity} ${category}`.toLowerCase();
        if (!words.every(word => searchableText.includes(word))) return false;
      }

      // 2. City
      if (city && !itemCity.toLowerCase().includes(city.toLowerCase())) return false;

      // 3. Category (from URL)
      if (categoryParam) {
        const superNormalize = (str: string) => 
          str.normalize('NFD')
             .replace(/[\u0300-\u036f]/g, '')
             .toLowerCase()
             .replace(/[^a-z0-9]/g, '')
             .trim();
             
        const target = superNormalize(categoryParam);
        const current = superNormalize(category || '');
        if (current !== target && !current.includes(target) && !target.includes(current)) return false;
      }

      // 4. Sub-categories
      if (selectedSubCats.length > 0 && selectedSubCats.length < currentSubCats.length) {
        const itemSubCats = item.subCategories || [];
        if (!selectedSubCats.some(sc => itemSubCats.includes(sc))) return false;
      }

      return true;
    });
  }, [suppliers, searchTerm, city, categoryParam, selectedSubCats, currentSubCats]);

  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      // 1. Category from URL
      if (categoryParam && !(item.category || '').toLowerCase().includes(categoryParam.toLowerCase())) return false;

      // 2. Sub-categories Filter
      if (selectedSubCats.length > 0 && !selectedSubCats.includes(item.sub_category)) return false;

      // 3. Search
      if (searchTerm) {
        const searchableText = `${item.name || ''} ${item.description || ''}`.toLowerCase();
        if (!searchableText.includes(searchTerm.toLowerCase())) return false;
      }

      // 4. City (Filter by supplier city)
      if (city && !item.user?.city?.toLowerCase().includes(city.toLowerCase())) return false;

      return true;
    });
  }, [products, categoryParam, selectedSubCats, searchTerm, city]);

  const totalResults = viewMode === 'fournisseurs' ? filteredSuppliers.length : filteredProducts.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const showPagination = totalPages > 1;

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredSuppliers.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSuppliers, currentPage]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, categoryParam, searchTerm, city, selectedSubCats]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const heroContent = useMemo(() => {
    if (!categoryParam) {
      return {
        title: 'Fournisseurs de Matériaux BTP au Maroc - Devis & Prix',
        description: 'Retrouvez les fabricants et fournisseurs de matériaux BTP au Maroc. Comparez les devis, filtrez par catégorie et découvrez les meilleurs fournisseurs pour vos projets.',
      };
    }

    if (categoryHeroContent[categoryParam]) {
      return categoryHeroContent[categoryParam];
    }

    return {
      title: `${categoryParam} au Maroc - Fournisseurs de Matériaux BTP - Devis & Prix`,
      description: `Retrouvez les fabricants et fournisseurs de ${categoryParam.toLowerCase()} au Maroc. Comparez les devis, consultez les références et trouvez les produits et prestataires adaptés à votre projet.`,
    };
  }, [categoryParam]);

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
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-15 py-8">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">{heroContent.title}</h1>
        <p className="text-[#64748B] text-sm mb-8">{heroContent.description}</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-[#1E293B]">
                  <i className="ti ti-adjustments-horizontal text-xl text-forest"></i>
                  Filtres
                </div>
                <button 
                  onClick={handleClearFilters}
                  className="text-xs text-forest font-medium hover:underline border-none bg-transparent cursor-pointer"
                >
                  Effacer les filtres
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="viewMode" 
                      checked={viewMode === 'fournisseurs'} 
                      onChange={() => setViewMode('fournisseurs')}
                      className="w-4 h-4 accent-forest" 
                    />
                    <span className={`text-sm ${viewMode === 'fournisseurs' ? 'text-[#475569] font-bold' : 'text-gray-400'}`}>Fournisseurs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="viewMode" 
                      checked={viewMode === 'produits'} 
                      onChange={() => setViewMode('produits')}
                      className="w-4 h-4 accent-forest" 
                    />
                    <span className={`text-sm ${viewMode === 'produits' ? 'text-[#475569] font-bold' : 'text-gray-400'}`}>Produits</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">
                    Professionnel({categoryParam ? 1 : 0})
                  </label>
                  <div className="border border-gray-200 rounded-lg p-2 bg-slate-50">
                    {categoryParam ? (
                      <>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="bg-green-50 text-forest text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            {categoryParam} <i onClick={clearCategory} className="ti ti-x cursor-pointer hover:text-red-500"></i>
                          </span>
                        </div>
                        {currentSubCats.length > 0 && (
                          <div className="space-y-2 mt-2 px-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={selectedSubCats.length === currentSubCats.length} 
                                onChange={toggleAll}
                                className="w-4 h-4 accent-forest" 
                              />
                              <span className="text-xs text-forest font-bold">{categoryParam}</span>
                            </label>
                            <div className="pl-4 space-y-2">
                              {currentSubCats.map(cat => (
                                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedSubCats.includes(cat)} 
                                    onChange={() => toggleSubCat(cat)}
                                    className="w-4 h-4 accent-forest" 
                                  />
                                  <span className={`text-[11px] ${selectedSubCats.includes(cat) ? 'text-forest font-bold' : 'text-gray-500'}`}>{cat}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-[10px] text-gray-400 italic px-1">Aucune catégorie sélectionnée</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">Ville de livraison</label>
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus-within:border-forest transition-colors">
                      <i className="ti ti-map-pin text-forest mr-2"></i>
                      <input 
                        type="text" 
                        placeholder="Ville" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-sm text-[#64748B] focus:outline-none bg-transparent" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleApplyFilters}
                  className="w-full bg-forest text-white font-bold py-3 rounded-lg text-sm shadow-lg shadow-green-100 transition-all active:scale-[0.98] hover:bg-black border-none cursor-pointer"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-[400px]">
                <input 
                  type="text" 
                  placeholder="Rechercher.." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-forest shadow-sm"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-forest text-white rounded-md border-none cursor-pointer">
                  <i className="ti ti-search"></i>
                </button>
              </div>
              {showPagination && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 enabled:hover:bg-white bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ti ti-chevron-left"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs cursor-pointer ${
                        currentPage === page
                          ? 'bg-forest text-white border-none'
                          : 'border border-gray-200 text-gray-500 hover:bg-white bg-transparent'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 enabled:hover:bg-white bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ti ti-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>

            <div id="results-count" className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1E293B]">
                {viewMode === 'fournisseurs' ? 'Fournisseurs de Matériaux' : 'Produits et Matériaux'}
              </h2>
              {showPagination && (
                <span className="text-xs text-gray-400 font-medium">
                  {totalResults} résultats trouvés
                </span>
              )}
            </div>

            <div className="flex gap-2 mb-6">
              <span className="bg-forest text-white text-[10px] font-bold px-3 py-1 rounded flex items-center gap-2">
                <i className="ti ti-check text-[8px]"></i> 100% Certifié
              </span>
            </div>

            {viewMode === 'fournisseurs' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedSuppliers.map(supplier => {
                  const profile = supplier.professional_profile;
                  const name = profile?.company_name || supplier.name;
                  const category = profile?.category || 'BTP';
                  const initials = name.substring(0, 2).toUpperCase();

                  return (
                    <div key={supplier.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 group hover:border-forest transition-all">
                      <div className="w-24 h-24 bg-cream rounded-xl flex items-center justify-center font-bold text-forest text-2xl shrink-0 uppercase">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-[#1E293B] text-sm group-hover:text-forest transition-colors uppercase">{name}</h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <i className="ti ti-star-filled text-forest text-[8px]"></i>
                              <span className="text-[10px] font-bold text-gray-500">4.8</span>
                            </div>
                          </div>
                          <span className="bg-green-100 text-forest text-[10px] font-bold px-2 py-0.5 rounded">
                            PRO
                          </span>
                        </div>
                        <div className="flex gap-1.5 mb-3">
                          <span className="bg-green-50 text-forest text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {category}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            to={`/fournisseurs/${supplier.id}`}
                            className="flex-1 bg-forest text-white text-[11px] font-bold py-2.5 rounded flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm cursor-pointer border-none no-underline"
                          >
                            Voir catalogue
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map(product => {
                  const image = product.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800";
                  return (
                    <Link key={product.id} to={`/produit/${product.slug}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-green-50/50 hover:border-forest transition-all no-underline flex flex-col">
                      <div className="aspect-square relative overflow-hidden bg-gray-50">
                        <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                          <i className="ti ti-heart"></i>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-navy mb-1 group-hover:text-forest transition-colors uppercase">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-3">
                          <span className="text-xs font-bold text-forest">{product.price} MAD / {product.unit}</span>
                        </div>
                        <div className="mt-auto flex gap-2">
                          <button onClick={(e) => { e.preventDefault(); openDevisModal({ proName: product.user?.professional_profile?.company_name || product.user?.name, proId: product.user_id }); }} className="flex-1 bg-forest text-white text-[10px] font-bold py-2.5 rounded-lg hover:bg-black transition-all shadow-sm border-none cursor-pointer">
                            <i className="ti ti-file-text mr-2"></i> Devis
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
