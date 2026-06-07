import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiService } from '../data/apiService';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(queryParam);
  const { openDevisModal } = useModal();
  const { t, isRTL } = useLanguage();

  const [results, setResults] = useState<{
    prestataires: any[];
    maalems: any[];
    products: any[];
    projects: any[];
  }>({
    prestataires: [],
    maalems: [],
    products: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalQuery(queryParam);
    if (queryParam) {
      fetchResults(queryParam);
    }
  }, [queryParam]);

  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const [prosRes, productsRes, projectsRes] = await Promise.all([
        apiService.get('/professionals', { search: q }),
        apiService.get('/products', { search: q }),
        apiService.get('/projects', { search: q })
      ]);

      if (prosRes.success && productsRes.success && projectsRes.success) {
        const allPros = prosRes.data.map((u: any) => ({
          ...u,
          name: u.professional_profile?.company_name || u.name,
          category: u.professional_profile?.category || 'Expert',
          type: u.professional_profile?.type || 'entreprise',
          description: u.professional_profile?.description || 'Professionnel qualifié sur InvestAqary.',
          city: u.city || 'Maroc',
          rating: u.professional_profile?.rating || 4.5,
          image: u.image || u.professional_profile?.profile_photo || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800',
          slug: u.id.toString()
        }));

        setResults({
          prestataires: allPros.filter((p: any) => p.type === 'entreprise' || p.type === 'fournisseur'),
          maalems: allPros.filter((p: any) => p.type === 'maalem'),
          products: Array.isArray(productsRes.data) ? productsRes.data : [],
          projects: Array.isArray(projectsRes.data) ? projectsRes.data : []
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  const hasResults = results.prestataires.length > 0 || 
                    results.maalems.length > 0 || 
                    results.products.length > 0 || 
                    results.projects.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="max-w-[1500px] mx-auto px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">
              {t('search_results_for')} : <span className="text-forest">"{queryParam}"</span>
            </h1>
            {!loading && !hasResults && (
              <p className="text-slate-500 mt-2">{t('no_results')}</p>
            )}
          </div>

          <form onSubmit={handleLocalSearch} className="flex-1 max-w-[500px]">
            <div className="relative">
              <input 
                type="text" 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-forest shadow-sm"
              />
              <button type="submit" className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1.5 bottom-1.5 px-4 bg-forest text-white rounded-lg transition-colors hover:bg-opacity-90`}>
                <i className="ti ti-search"></i>
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
          </div>
        ) : (
          <>
            {results.projects.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                    <i className="ti ti-layout-grid text-forest"></i>
                    Projets Réalisés
                  </h2>
                  <span className="text-xs font-medium text-slate-400">{results.projects.length} {t('all').toLowerCase()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {results.prestataires.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                    <i className="ti ti-building text-forest"></i>
                    {t('search_entreprises')}
                  </h2>
                  <span className="text-xs font-medium text-slate-400">{results.prestataires.length} {t('all').toLowerCase()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.prestataires.map(item => (
                    <PrestataireCard key={item.id} item={item} openDevisModal={openDevisModal} t={t} isRTL={isRTL} />
                  ))}
                </div>
              </section>
            )}

            {results.maalems.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                    <i className="ti ti-user-circle text-forest"></i>
                    {t('search_maalems')}
                  </h2>
                  <span className="text-xs font-medium text-slate-400">{results.maalems.length} {t('all').toLowerCase()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.maalems.map(item => (
                    <PrestataireCard key={item.id} item={item} openDevisModal={openDevisModal} t={t} isRTL={isRTL} />
                  ))}
                </div>
              </section>
            )}

            {results.products.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                    <i className="ti ti-package text-blue-500"></i>
                    {t('search_products')}
                  </h2>
                  <span className="text-xs font-medium text-slate-400">{results.products.length} {t('all').toLowerCase()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link to={`/projet/${project.slug}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group no-underline">
      <div className="relative h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <i className="ti ti-photo-off text-4xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Aucune image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-navy text-[10px] font-bold py-1 px-2 rounded-lg">
          {project.location}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-navy mb-2 line-clamp-1">{project.title}</h3>
        {project.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">{project.description}</p>
        )}
        <div className="text-[10px] font-black text-forest uppercase tracking-widest">
          {project.category}
        </div>
      </div>
    </Link>
  );
}

function PrestataireCard({ item, openDevisModal, t, isRTL }: { item: any, openDevisModal: () => void, t: any, isRTL: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
      <div className="relative h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <i className="ti ti-user-circle text-5xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Aucune photo</span>
          </div>
        )}
        <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} bg-white/90 backdrop-blur text-navy text-[10px] font-bold py-1 px-2 rounded-lg flex items-center gap-1 shadow-sm`}>
          <i className="ti ti-map-pin text-forest"></i> {item.city}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-navy uppercase truncate">{item.name}</span>
          <div className={`flex items-center gap-0.5 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            <i className="ti ti-star-filled text-[10px] text-forest"></i>
            <span className="text-[10px] text-gray-400 font-bold">{item.rating}</span>
          </div>
        </div>
        <div className="bg-green-50 text-forest text-[10px] font-bold px-2 py-0.5 rounded inline-block w-fit mb-3">
          {item.category}
        </div>
        {item.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex gap-2 pt-4 border-t border-gray-50">
          <button 
            onClick={openDevisModal}
            className="flex-1 bg-forest text-white text-[10px] font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer border-none"
          >
            {t('btn_quote')}
          </button>
          <Link 
            to={item.type === 'entreprise' ? `/entreprise/${item.slug}` : `/maalem/${item.slug}`}
            className="flex-1 bg-white border border-gray-200 text-navy text-[10px] font-bold py-2 rounded-lg text-center hover:bg-gray-50 transition-all no-underline"
          >
            {t('btn_profile')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/produit/${product.slug}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group no-underline">
      <div className="relative h-[180px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {product.image || (product.images && product.images[0]) ? (
          <img src={product.image || product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <i className="ti ti-package text-4xl"></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">Pas d'image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[13px] font-bold text-navy mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-forest font-black text-xs mb-2">{product.price} {product.unit}</p>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.category}</div>
      </div>
    </Link>
  );
}
