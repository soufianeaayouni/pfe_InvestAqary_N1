import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useModal } from '../context/ModalContext';
import { apiService } from '../data/apiService';

export default function SupplierDetail() {
  const { id } = useParams();
  const { openDevisModal } = useModal();

  const [supplier, setSupplier] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/professionals/${id}`);
        if (response.success) {
          setSupplier(response.data);
          
          // Fetch products for this supplier
          const productsRes = await apiService.get('/products', { user_id: id });
          if (productsRes.success) {
            setProducts(productsRes.data);
          }
        }
      } catch (error) {
        console.error('Error fetching supplier detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplierData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-poppins">
        <Header />
        <main className="max-w-[1400px] mx-auto px-15 py-8">
          <Link to="/fournisseurs" className="inline-flex items-center gap-2 text-sm font-bold text-forest mb-6 no-underline bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
            <i className="ti ti-chevron-left"></i> Retour à la liste
          </Link>
          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-navy mb-4">Fournisseur introuvable</h1>
            <p className="text-sm text-gray-500">Le fournisseur demandé n'existe pas ou a été supprimé.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = supplier.professional_profile;
  const name = profile?.company_name || supplier.name;
  const image = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200"; // Fallback image

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 md:px-15 py-8">
        <Link to="/fournisseurs" className="inline-flex items-center gap-2 text-sm font-bold text-forest mb-6 no-underline bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
          <i className="ti ti-chevron-left"></i> Retour aux fournisseurs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative h-[320px] overflow-hidden bg-gray-100">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest bg-forest/10 rounded-full px-3 py-1 mb-4">
                {profile?.category || 'BTP'}
              </span>
              <h1 className="text-4xl font-extrabold text-navy mb-4 uppercase">{name}</h1>
              <p className="text-sm leading-7 text-gray-600 mb-8 uppercase">{profile?.description || 'Fournisseur qualifié sur InvestAqary.'}</p>

              <div className="grid gap-3 sm:grid-cols-1">
                <div className="rounded-3xl border border-gray-200 p-5 bg-gray-50">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Catégorie principale</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold text-navy bg-white border border-gray-200 rounded-full px-3 py-1 uppercase">{profile?.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-navy mb-4">Informations</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-navy">Ville :</span>
                  <span className="uppercase">{supplier.city || 'Maroc'}</span>
                </div>
                {supplier.phone && (
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-navy">Téléphone :</span>
                    <span>{supplier.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-navy">Email :</span>
                  <span>{supplier.email}</span>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => openDevisModal({ proName: name, proId: supplier.id })}
                  className="w-full bg-forest text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 hover:bg-black transition-all active:scale-95 border-none cursor-pointer uppercase"
                >
                  Demander un devis
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Products */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-navy mb-8">Catalogue de produits</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => {
                const pImage = product.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800";
                return (
                  <Link key={product.id} to={`/produit/${product.slug}`} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-xl hover:shadow-green-50/50 transition-all no-underline flex flex-col">
                    <div className="aspect-square relative overflow-hidden bg-gray-50">
                      <img src={pImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-navy mb-1 group-hover:text-forest transition-colors uppercase">{product.name}</h3>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 uppercase">{product.description}</p>
                      <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-sm font-bold text-forest">{product.price} MAD</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{product.unit}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
              <p className="text-gray-500">Aucun produit dans le catalogue pour le moment.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
