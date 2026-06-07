import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../data/apiService';

export default function ProductDetail() {
  const { slug } = useParams();
  const { openDevisModal } = useModal();
  const { t, isRTL } = useLanguage();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/products/${slug}`);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-navy mb-4">Produit non trouvé</h1>
        <Link to="/fournisseurs" className="text-forest font-bold hover:underline">Retour aux fournisseurs</Link>
      </div>
    );
  }

  const supplierName = product.user?.professional_profile?.company_name || product.user?.name;
  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-15 py-8">
        {/* Breadcrumb / Back button */}
        <Link to="/fournisseurs" className="inline-flex items-center gap-2 text-sm font-bold text-forest mb-6 no-underline bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
          <i className={`ti ${isRTL ? 'ti-chevron-right' : 'ti-chevron-left'}`}></i> {isRTL ? 'رجوع' : 'Retour'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl border border-gray-200 overflow-hidden bg-white group flex items-center justify-center">
              {images.length > 0 ? (
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-200">
                  <i className="ti ti-package text-8xl"></i>
                  <span className="text-sm font-bold uppercase tracking-widest">Aucune image disponible</span>
                </div>
              )}
              
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-navy shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ti ti-chevron-left"></i>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-navy shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ti ti-chevron-right"></i>
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-forest w-4' : 'bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => openDevisModal({ proName: supplierName, proId: product.user_id })}
                className="w-full bg-forest text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 hover:bg-black transition-all border-none cursor-pointer uppercase"
              >
                Demander un devis
              </button>
              <button className="w-full border border-navy text-navy font-bold py-4 rounded-xl hover:bg-navy hover:text-white transition-all bg-transparent cursor-pointer uppercase">
                Contacter le fournisseur
              </button>
            </div>
          </div>

          {/* Right Column: Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-cream border border-gray-100 flex items-center justify-center font-bold text-forest text-xs uppercase">
                {supplierName?.substring(0, 2)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy uppercase">{supplierName}</h3>
                <p className="text-[11px] text-gray-400 uppercase">{product.user?.city || 'Maroc'}</p>
              </div>
              <span className="ml-auto text-[10px] text-gray-400 font-medium uppercase tracking-wider">{product.category}</span>
            </div>

            <h1 className="text-4xl font-extrabold text-navy mb-4 uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-6">
              <div className="flex text-forest">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ti ti-star-filled text-xs"></i>
                ))}
              </div>
              <span className="text-xs text-gray-400">(4.5 avis)</span>
            </div>

            <div className="bg-forest/5 rounded-2xl p-6 border border-forest/10 mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-forest">{product.price} MAD</span>
                <span className="text-sm text-gray-500 font-bold uppercase">/ {product.unit}</span>
              </div>
              <p className="text-xs text-forest font-bold uppercase">Commande min: {product.min_order}</p>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
              {['Description', 'Spécifications', 'Livraison'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-forest' : 'text-gray-400'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-forest rounded-t-full"></div>}
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-600 leading-7 mb-8">
              {activeTab === 'Description' && (
                <p className="uppercase">{product.description || 'Pas de description disponible.'}</p>
              )}
              {activeTab === 'Spécifications' && (
                <ul className="space-y-2 list-none p-0 uppercase">
                  <li className="flex gap-4 border-b border-gray-50 py-2">
                    <span className="font-bold text-navy min-w-[120px]">Catégorie:</span>
                    <span>{product.category}</span>
                  </li>
                  <li className="flex gap-4 border-b border-gray-50 py-2">
                    <span className="font-bold text-navy min-w-[120px]">Sous-catégorie:</span>
                    <span>{product.sub_category}</span>
                  </li>
                </ul>
              )}
              {activeTab === 'Livraison' && (
                <p className="uppercase">Livraison disponible partout au Maroc. Contactez le fournisseur pour plus de détails sur les frais et délais.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
