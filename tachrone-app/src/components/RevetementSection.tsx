import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../data/apiService';

function HeartButton() {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <button 
      onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center border-none cursor-pointer text-[13px] hover:text-[#E24B4A] transition-colors z-10"
      style={{ color: isLiked ? '#E24B4A' : '#94A3B8' }}
    >
      <i className={isLiked ? "ti ti-heart-filled" : "ti ti-heart"}></i>
    </button>
  );
}

export default function RevetementSection() {
  const [activeTab, setActiveTab] = useState('Tout');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['Tout', 'Parquet', 'Parquet stratifié'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/products', { category: 'Revêtement sol' });
        if (response.success) {
          setProducts(response.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching products for Revetement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'Tout') return products.slice(0, 4);

    return products
      .filter(product => {
        const subCat = product.sub_category || product.subCategory || '';
        return subCat.toLowerCase() === activeTab.toLowerCase();
      })
      .slice(0, 4);
  }, [products, activeTab]);

  if (loading && products.length === 0) {
    return null; // Or a skeleton
  }

  return (
    <div className="px-4 md:px-10 lg:px-16 py-9 bg-cream border-t border-gray-200 font-poppins">
      <div className="text-xl md:text-2xl font-extrabold text-navy text-center mb-[30px]">Revêtement sol</div>
      
      <div className="flex gap-2 flex-wrap mb-6 justify-center px-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-[7px] rounded-lg border-[1.5px] text-xs font-medium cursor-pointer transition-all ${
              activeTab === tab 
                ? 'bg-navy text-white border-navy' 
                : 'bg-white text-slate border-gray-200 hover:border-navy hover:text-navy'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => {
          const displayName = product.supplierName || product.user?.professional_profile?.company_name || product.user?.name || 'InvestAqary Pro';
          const image = product.image || product.images?.[0];

          return (
            <Link 
              key={product.id}
              to={`/produit/${product.slug}`} 
              className="bg-white rounded-[14px] border border-gray-200 overflow-hidden cursor-pointer transition-transform hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(30,41,59,0.11)] relative no-underline flex flex-col"
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="w-8 h-8 rounded-md bg-cream border border-gray-200 flex items-center justify-center text-[10px] font-bold text-slate shrink-0 uppercase">
                  {displayName.substring(0, 2)}
                </div>
                <span className="text-xs font-semibold text-navy whitespace-nowrap overflow-hidden text-ellipsis uppercase">{displayName}</span>
              </div>
              <div className="w-full h-[185px] overflow-hidden relative bg-gray-50 flex items-center justify-center">
                {image ? (
                  <img src={image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <i className="ti ti-package text-4xl"></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Pas d'image</span>
                  </div>
                )}
                <HeartButton />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-navy truncate mr-2 uppercase">{product.name}</span>
                  <i className="ti ti-share text-sm text-slate-400"></i>
                </div>
                <div className="text-[13px] font-bold text-forest mb-0.5">{product.price} MAD</div>
                <p className="text-[10.5px] text-slate-500 leading-[1.5] line-clamp-2 flex-1 uppercase">{product.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="flex justify-end mt-5">
        <Link to="/fournisseurs?category=Revêtement%20sol" className="flex items-center gap-1.5 px-[18px] py-2 rounded-lg border-[1.5px] border-navy bg-transparent text-navy font-semibold text-xs transition-colors hover:bg-navy hover:text-white no-underline">
          Tout voir <i className="ti ti-chevrons-right"></i>
        </Link>
      </div>
    </div>
  );
}
