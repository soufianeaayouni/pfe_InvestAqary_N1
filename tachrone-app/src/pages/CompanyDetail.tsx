import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiService } from '../data/apiService';

export default function CompanyDetail() {
  const { slug } = useParams();
  const { openDevisModal, openChatModal } = useModal();
  const { isAuthenticated, user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('À propos');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        // Using slug as ID for now since backend show expects ID
        const response = await apiService.get(`/professionals/${slug}`);
        if (response.success) {
          setCompany(response.data);
          
          // Fetch projects for this user
          const projectsRes = await apiService.get('/projects', { user_id: slug });
          if (projectsRes.success) {
            setProjects(projectsRes.data);
          }

          // Fetch reviews
          const reviewsRes = await apiService.get(`/professionals/${response.data.id}/reviews`);
          if (reviewsRes.success) {
            setReviews(reviewsRes.data);
          }
        }
      } catch (error) {
        console.error('Error fetching company detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsSubmittingReview(true);
    try {
      const response = await apiService.post('/reviews', {
        pro_id: company.id,
        rating,
        comment
      });

      if (response.success) {
        setReviews([response.data, ...reviews]);
        setComment('');
        setRating(5);
        alert('Merci pour votre avis !');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi de l\'avis');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Entreprise non trouvée</h1>
        <Link to="/entreprises" className="text-forest font-bold">Retour aux entreprises</Link>
      </div>
    );
  }

  const tabs = ['Projets', 'À propos', 'Villes d\'activité', 'Avis'];
  const displayName = company.professional_profile?.company_name || company.name;
  const initials = (displayName || 'T').substring(0, 2).toUpperCase();
  const profileImage = company.professional_profile?.profile_photo;
  const bannerImage = company.professional_profile?.banner_photo || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1500&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />

      <main className="max-w-[1500px] mx-auto px-4 md:px-10 py-6">
        {/* Company Profile Header */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white mb-6">
          {/* Blurred Banner Background */}
          <div className="h-40 md:h-64 relative">
            <img 
              src={bannerImage} 
              className="w-full h-full object-cover blur-sm opacity-60"
              alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
          </div>

          {/* Profile Card Overlay */}
          <div className="md:absolute md:bottom-6 md:left-6 md:right-6 bg-white/90 backdrop-blur-md md:border border-white/50 md:rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center overflow-hidden shrink-0 -mt-20 md:mt-0 relative z-10">
               {profileImage ? (
                 <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
               ) : (
                 <div className="p-4 flex flex-col items-center justify-center h-full w-full">
                   <div className="text-forest font-black text-base md:text-lg text-center leading-tight mb-2">
                     {initials}
                   </div>
                   <div className="bg-forest text-white text-[8px] font-bold px-2 py-0.5 rounded w-full text-center uppercase">
                     {company.professional_profile?.category || 'BTP'}
                   </div>
                 </div>
               )}
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-4 md:mb-2">
                <h1 className="text-xl md:text-2xl font-black text-navy">{displayName}</h1>
                <div className="flex items-center justify-center md:justify-start gap-0.5">
                   {[1,2,3,4,5].map(s => <i key={s} className="ti ti-star-filled text-mist text-sm"></i>)}
                   <span className="text-xs font-bold text-gray-400 ml-2">12 avis</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1 text-xs font-bold text-gray-500 md:ml-4">
                  <i className="ti ti-map-pin"></i> {company.city || 'Maroc'}
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                <span className="bg-green-50 text-forest text-[10px] font-bold px-3 py-1 rounded-full border border-green-100 uppercase">
                  {company.professional_profile?.category || 'Expert BTP'}
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-navy hover:bg-gray-100 transition-all">
                  <i className="ti ti-phone text-forest"></i> <span className="hidden sm:inline">{company.phone}</span><span className="sm:hidden">Appeler</span>
                </button>
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-navy hover:bg-gray-100 transition-all">
                  <i className="ti ti-brand-whatsapp text-green-500 text-base"></i> WhatsApp
                </button>
                <button onClick={() => openDevisModal({ proName: displayName, proId: company.id })} className="flex items-center gap-2 px-4 md:px-6 py-2 bg-forest text-white rounded-lg text-xs font-bold hover:bg-[#2D4330] transition-all shadow-md shadow-green-100 cursor-pointer border-none">
                  <i className="ti ti-file-text"></i> Devis
                </button>
                <button 
                  onClick={() => openChatModal({ proName: displayName, proId: company.id })}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-navy text-white rounded-lg text-xs font-bold hover:bg-black transition-all cursor-pointer border-none"
                >
                  <i className="ti ti-message-2"></i> <span className="hidden sm:inline">Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 mb-8 shadow-sm flex overflow-x-auto scrollbar-hide gap-1 sticky top-20 md:top-24 z-30">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-xs md:text-[13px] font-bold transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-forest text-white shadow-md' 
                : 'text-gray-400 hover:text-navy hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'Projets' && (
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-lg font-black text-navy">Projets</h2>
                 <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-lg bg-green-50 text-forest text-[10px] font-bold border border-green-100">Tout</button>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {projects.map((proj: any) => (
                   <div key={proj.id} className="group flex flex-col border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative h-48 md:h-64 overflow-hidden">
                        <img 
                          src={proj.image || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                          alt="Project"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1.5">
                           <div className="w-4 h-4 bg-forest rounded-sm flex items-center justify-center text-[8px] text-white font-black">{initials[0]}</div>
                           <span className="text-[9px] font-bold text-navy uppercase">{displayName}</span>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-navy shadow-sm"><i className="ti ti-bookmark text-xs"></i></button>
                          <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-navy shadow-sm"><i className="ti ti-share text-xs"></i></button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="text-[11px] font-black text-navy uppercase mb-2 line-clamp-1">{proj.title}</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed mb-4 line-clamp-3">{proj.description}</p>
                        <div className="mt-auto flex gap-2">
                           <Link to={`/projet/${proj.slug}`} className="flex-1 bg-forest text-white text-[10px] font-bold py-2 rounded-lg hover:bg-[#2D4330] transition-colors text-center no-underline">Voir</Link>
                           <button className="flex-1 border border-navy text-navy text-[10px] font-bold py-2 rounded-lg hover:bg-navy hover:text-white transition-all">Message</button>
                        </div>
                      </div>
                   </div>
                 ))}
                 {projects.length === 0 && (
                   <p className="text-xs text-gray-400 font-medium">Aucun projet publié pour le moment.</p>
                 )}
               </div>
            </section>
          )}

          {activeTab === 'À propos' && (
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
               <h2 className="text-lg font-black text-navy mb-6">À propos</h2>
               <div className="max-w-3xl">
                 <p className="text-xs leading-loose text-gray-500 font-medium whitespace-pre-line mb-10">
                   Professionnel qualifié sur la plateforme InvestAqary, engagé à fournir des services de qualité dans le domaine du BTP.
                 </p>
                 
                 <div className="space-y-4 border-t border-gray-100 pt-8">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-bold text-navy uppercase opacity-40">Nom de l'entreprise</span>
                       <span className="text-xs font-bold text-navy">{displayName}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-gray-50 pt-4">
                       <span className="text-[10px] font-bold text-navy uppercase opacity-40">Catégorie</span>
                       <span className="text-xs font-bold text-navy uppercase">{company.professional_profile?.category || 'BTP'}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-gray-50 pt-4">
                       <span className="text-[10px] font-bold text-navy uppercase opacity-40">Adresse</span>
                       <span className="text-xs font-bold text-navy uppercase">{company.city || 'Maroc'}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-gray-50 pt-4">
                       <span className="text-[10px] font-bold text-navy uppercase opacity-40">Téléphone</span>
                       <span className="text-xs font-bold text-navy">{company.phone}</span>
                    </div>
                 </div>
               </div>
            </section>
          )}

          {activeTab === 'Villes d\'activité' && (
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
               <h2 className="text-lg font-black text-navy mb-6">Villes d'activité</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[company.city || 'Casablanca'].map(city => (
                   <div key={city} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                         <i className="ti ti-map-pin text-forest text-sm"></i>
                      </div>
                      <span className="text-xs font-bold text-navy">{city}</span>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {activeTab === 'Avis' && (
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-lg font-black text-navy">Avis Clients</h2>
                 {isAuthenticated ? (
                   <button 
                     onClick={() => setShowReviewForm(!showReviewForm)}
                     className="px-6 py-2 bg-navy text-white rounded-lg text-xs font-bold hover:bg-black transition-all border-none cursor-pointer"
                   >
                     {showReviewForm ? 'Annuler' : 'Laisser un avis'}
                   </button>
                 ) : (
                    <Link to="/connexion" className="text-xs font-bold text-forest hover:underline bg-green-50 px-4 py-2 rounded-lg transition-all">
                      Connectez-vous pour laisser un avis
                    </Link>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                     <span className="text-4xl font-black text-forest mb-2">
                       {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                     </span>
                     <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i key={s} className={`ti ti-star${s <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? '-filled' : ''} text-forest text-sm`}></i>
                        ))}
                     </div>
                     <span className="text-[10px] font-bold text-forest/70 uppercase tracking-wider">Basé sur {reviews.length} avis</span>
                  </div>

                  <div className="md:col-span-2 flex flex-col justify-center">
                     <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = reviews.filter(r => r.rating === star).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-4">
                               <span className="text-[10px] font-bold text-navy w-4">{star}</span>
                               <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-forest rounded-full" style={{ width: `${percentage}%` }}></div>
                               </div>
                               <span className="text-[10px] font-bold text-gray-400 w-8">{percentage.toFixed(0)}%</span>
                            </div>
                          );
                        })}
                     </div>
                  </div>
               </div>

               {/* Review Form (Only for logged in users) */}
               {isAuthenticated && showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-12 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-navy uppercase opacity-60">Votre note :</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className={`text-xl cursor-pointer transition-all border-none bg-transparent ${s <= rating ? 'text-forest' : 'text-gray-300'}`}
                          >
                            <i className={`ti ti-star${s <= rating ? '-filled' : ''}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Laissez votre avis ici..."
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-forest transition-all h-24 resize-none"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-navy text-white px-8 py-2.5 rounded-lg text-xs font-bold hover:bg-black transition-all border-none cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Envoi...' : 'Publier mon avis'}
                    </button>
                  </form>
               )}

               <div className="space-y-8">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-navy text-xs shrink-0 uppercase">
                            {review.user?.name?.charAt(0) || 'U'}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="text-xs font-bold text-navy">{review.user?.name || 'Utilisateur'}</h4>
                               <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                               {[1, 2, 3, 4, 5].map((s) => (
                                 <i key={s} className={`ti ti-star${s <= review.rating ? '-filled' : ''} text-forest text-[10px]`}></i>
                               ))}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                               {review.comment}
                            </p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                       <i className="ti ti-message-off text-3xl text-gray-200 mb-2"></i>
                       <p className="text-xs text-gray-400 font-medium">Aucun avis pour le moment.</p>
                    </div>
                  )}
               </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

