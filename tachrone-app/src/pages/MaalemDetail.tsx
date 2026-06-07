import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../data/apiService';

export default function MaalemDetail() {
  const { slug } = useParams();
  const [maalem, setMaalem] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Projets');
  const [activeProjectCategory, setActiveProjectCategory] = useState('Tout');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { openDevisModal, openChatModal } = useModal();
  const { isAuthenticated, user } = useAuth();

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchMaalemData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/professionals/${slug}`);
        if (response.success) {
          setMaalem(response.data);
          
          // Fetch projects for this specific user
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
        console.error('Error fetching maalem detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaalemData();
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsSubmittingReview(true);
    try {
      const response = await apiService.post('/reviews', {
        pro_id: maalem.id,
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

  if (!maalem) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-navy mb-4">Professionnel non trouvé</h1>
        <Link to="/maalems" className="text-forest font-bold">Retour aux maalems</Link>
      </div>
    );
  }

  const displayName = maalem.name || `${maalem.first_name} ${maalem.last_name}`;
  const category = maalem.professional_profile?.category || 'Artisan';
  const profileImage = maalem.professional_profile?.profile_photo || "https://images.unsplash.com/photo-1590059132213-f91575ee300b?q=80&w=500&auto=format&fit=crop";
  const bannerImage = maalem.professional_profile?.banner_photo || "https://images.unsplash.com/photo-1590059132213-f91575ee300b?q=80&w=500&auto=format&fit=crop";

  const filteredProjects = activeProjectCategory === 'Tout' 
    ? projects 
    : projects.filter(p => p.category === activeProjectCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 md:px-15 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div className="relative h-[300px]">
            <img src={bannerImage} alt="Banner" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 -mt-16 relative z-10">
              <div className="w-48 h-48 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-white shrink-0 self-center md:self-start">
                <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
              </div>
              
              <div className="mt-4 md:mt-20 flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] mb-1">{displayName}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex gap-2 text-gray-200">
                        <i className="ti ti-brand-facebook text-xl hover:text-blue-600 cursor-pointer"></i>
                        <i className="ti ti-brand-instagram text-xl hover:text-pink-600 cursor-pointer"></i>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <span className="flex text-forest">
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-half-filled"></i>
                        </span>
                        <span className="text-[#1E293B] font-bold">4.5</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center md:justify-start gap-2 mb-6">
                      <span className="px-3 py-1 border border-forest text-forest rounded-full text-xs font-bold uppercase">
                        {category}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#1E293B] hover:bg-gray-50 transition-colors">
                        <i className="ti ti-phone text-forest"></i> {maalem.phone || '+212 600 000 000'}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#1E293B] hover:bg-gray-50 transition-colors">
                        <i className="ti ti-brand-whatsapp text-green-500"></i> WhatsApp
                      </button>
                      <button 
                        onClick={() => openDevisModal({ proName: displayName, proId: maalem.id })}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#1E293B] hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <i className="ti ti-file-text text-forest"></i> Devis
                      </button>
                      <button 
                        onClick={() => openChatModal({ proName: displayName, proId: maalem.id })}
                        className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-xs font-bold hover:bg-navy/90 transition-all cursor-pointer border-none"
                      >
                        <i className="ti ti-message text-white"></i> Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex border-b border-gray-200 bg-[#F1F5F9]/30 overflow-x-auto scrollbar-hide">
            {['Projets', 'À propos', "Villes d'activité", 'Avis'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-10 py-4 text-sm font-bold transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? 'text-forest bg-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute top-0 left-0 right-0 h-1 bg-forest"></div>}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-8">
            {activeTab === 'Projets' && (
              <div>
                <h2 className="text-xl font-bold text-[#1E293B] mb-6">Projets</h2>
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                  {['Tout', category].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveProjectCategory(cat)}
                      className={`px-4 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${
                        activeProjectCategory === cat 
                        ? 'border-forest bg-green-50 text-forest' 
                        : 'border-gray-200 text-gray-500 hover:border-forest'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filteredProjects.map(project => (
                    <div key={project.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group shadow-sm hover:shadow-md transition-all">
                      <div className="relative h-48 md:h-[400px]">
                        <img src={project.image || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800"} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 border-t border-gray-100">
                        <h3 className="font-bold text-[#1E293B] mb-1">{project.title}</h3>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex gap-3">
                          <Link to={`/projet/${project.slug}`} className="flex-1 bg-forest text-white text-xs font-bold py-2.5 rounded-lg hover:bg-forest/90 transition-all shadow-sm text-center no-underline">
                            Voir le projet
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-gray-400 font-medium">Aucun projet disponible.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'À propos' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-[#1E293B] mb-4">À propos</h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    Maalem professionnel qualifié sur la plateforme InvestAqary, spécialisé dans le domaine du BTP. Engagement, qualité et respect des délais.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Villes d'activité" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-[#1E293B] mb-6">Villes d'activité</h2>
                <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-slate-50/50 w-fit">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-forest">
                    <i className="ti ti-map-pin"></i>
                  </div>
                  <span className="text-sm font-bold text-[#1E293B]">{maalem.city || 'Casablanca'}</span>
                </div>
              </div>
            )}

            {activeTab === 'Avis' && (
              <div className="animate-fadeIn space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold text-[#1E293B]">Avis Clients</h2>
                  {isAuthenticated ? (
                    <button 
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-6 py-2 bg-navy text-white rounded-lg text-xs font-bold hover:bg-black transition-all border-none cursor-pointer"
                    >
                      {showReviewForm ? 'Annuler' : 'Laisser un avis'}
                    </button>
                  ) : (
                    <Link to="/connexion" className="text-sm font-bold text-forest hover:underline bg-green-50 px-4 py-2 rounded-lg transition-all">
                      Connectez-vous pour laisser un avis
                    </Link>
                  )}
                </div>

                {/* Average Rating Display */}
                {reviews.length > 0 && (
                  <div className="bg-green-50/30 border border-green-100 rounded-2xl p-8 flex flex-col items-center justify-center w-full md:w-64 mb-8">
                    <span className="text-5xl font-black text-forest mb-2">
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <div className="flex text-forest text-xl mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className={`ti ti-star${s <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? '-filled' : ''}`}></i>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Basé sur {reviews.length} avis</span>
                  </div>
                )}

                {/* Review Form (Only for logged in users) */}
                {isAuthenticated && showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-10 space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-bold text-navy">Votre note :</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className={`text-2xl cursor-pointer transition-all border-none bg-transparent ${s <= rating ? 'text-forest' : 'text-gray-200'}`}
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
                      placeholder="Partagez votre expérience avec ce professionnel..."
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all h-32 resize-none"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-forest text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-green-100 border-none cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Envoi...' : 'Laisser un avis'}
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-50 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-navy">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-navy">{review.user?.name || 'Utilisateur'}</p>
                              <p className="text-[10px] text-gray-400">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className="flex text-forest text-xs">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <i key={s} className={`ti ti-star${s <= review.rating ? '-filled' : ''}`}></i>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-13">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                        <i className="ti ti-message-off"></i>
                      </div>
                      <p className="text-gray-400 text-sm font-medium">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
