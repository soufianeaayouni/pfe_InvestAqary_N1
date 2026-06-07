import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useModal } from '../context/ModalContext';
import { apiService } from '../data/apiService';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { openDevisModal, language } = useModal();
  const [project, setProject] = useState<any>(null);
  const [similarProjects, setSimilarProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('investaqary_token');
      if (token) {
        try {
          const res = await apiService.get('/user');
          if (res.success) {
            setUser(res.user);
          }
        } catch (e) {
          localStorage.removeItem('investaqary_token');
        }
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const [projectRes, similarRes] = await Promise.all([
          apiService.get(`/projects/${slug}`),
          apiService.get('/projects', { limit: 4 })
        ]);

        if (projectRes.success) {
          setProject(projectRes.data);
          // Fetch reviews for the professional who did this project
          if (projectRes.data.user_id) {
            const reviewsRes = await apiService.get(`/professionals/${projectRes.data.user_id}/reviews`);
            if (reviewsRes.success) {
              setReviews(reviewsRes.data);
            }
          }
        }
        if (similarRes.success) {
          setSimilarProjects(similarRes.data.filter((p: any) => p.slug !== slug).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [slug]);

  const handleRedigerAvis = () => {
    if (!user) {
      if (window.confirm('Voulez-vous vous connecter ou créer un compte pour laisser un avis ?')) {
        navigate('/connexion');
      }
      return;
    }

    if (user.role !== 'client') {
      alert('Seuls les clients peuvent laisser des avis sur les projets.');
      return;
    }

    setShowReviewForm(!showReviewForm);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/connexion');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiService.post('/reviews', {
        pro_id: project.user_id,
        rating,
        comment
      });

      if (res.success) {
        setReviews([res.data, ...reviews]);
        setShowReviewForm(false);
        setComment('');
        setRating(5);
        alert('Merci pour votre avis !');
      }
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!project) return null;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'NA';

  const ratingCounts = [5, 4, 3, 2, 1].map(level => ({
    level,
    count: reviews.filter(r => r.rating === level).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === level).length / reviews.length) * 100 : 0
  }));

  const displayTitle = project.title;
  const displayCompanyName = project.user?.professional_profile?.company_name || project.user?.name;
  const displayCity = project.location;
  const displayCategory = project.category;
  const companyInitials = (displayCompanyName || 'T').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-poppins">
      <Header />

      <main className="max-w-[1500px] mx-auto px-10 py-8">
        <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFD43B] rounded text-[11px] font-bold no-underline text-navy mb-6 uppercase tracking-wider">
          <i className="ti ti-chevron-left"></i> Retour
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6 mb-8">
          {/* Left Section: Info and Actions */}
          <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col relative">
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-mist border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                   <span className="text-navy font-extrabold text-sm">{companyInitials}</span>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-navy">{displayCompanyName}</div>
                  <div className="text-[11px] text-slate font-medium">{displayCity}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{displayCategory}</div>
            </div>

            <div className="mb-auto">
              <h1 className="text-[26px] font-bold text-navy leading-tight mb-3">
                {displayTitle}
              </h1>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>

            <div className="mt-12 flex gap-3">
              <button 
                onClick={() => openDevisModal({ proName: displayCompanyName })}
                className="flex-1 py-3 rounded-lg bg-[#FF6B00] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-orange-600 transition-colors uppercase"
              >
                Demander un devis
              </button>
              <button className="flex-1 py-3 rounded-lg border border-navy text-navy text-[13px] font-bold bg-white cursor-pointer hover:bg-gray-50 transition-colors uppercase">
                Contacter le fournisseur
              </button>
            </div>
          </section>

          {/* Right Section: Image Gallery */}
          <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-2 relative">
            <div className="rounded-lg overflow-hidden h-[450px] relative group">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-navy shadow-md border-none cursor-pointer hover:bg-white transition-colors">
                <i className="ti ti-chevron-left"></i>
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-navy shadow-md border-none cursor-pointer hover:bg-white transition-colors">
                <i className="ti ti-chevron-right"></i>
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                <span className="w-2 h-2 rounded-full bg-white/50"></span>
                <span className="w-2 h-2 rounded-full bg-white/50"></span>
              </div>
            </div>
          </section>
        </div>

        {/* Reviews Section */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-[14px] font-bold text-slate-400 mb-8">Avis</h2>
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <strong className="text-[32px] font-bold text-navy leading-none">{averageRating}</strong>
                <span className="text-[13px] text-slate-400 font-medium">| {reviews.length} Avis</span>
              </div>
              <div className="flex gap-1 text-forest text-sm mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className={`ti ti-star${s <= Math.round(Number(averageRating === 'NA' ? 0 : averageRating)) ? '-filled' : ''}`}></i>
                ))}
              </div>
              <button 
                onClick={handleRedigerAvis}
                className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg bg-black text-white text-[12px] font-bold border-none cursor-pointer hover:bg-gray-800 transition-colors uppercase"
              >
                {showReviewForm ? 'Annuler' : 'Rédiger un avis'}
              </button>
            </div>
            <div className="grid gap-3 max-w-md">
              {ratingCounts.map((rc) => (
                <div key={rc.level} className="grid grid-cols-[15px_1fr] gap-6 items-center">
                  <span className="text-[12px] text-slate-400 font-medium">{rc.level}</span>
                  <div className="h-[6px] rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div className="h-full rounded-full bg-[#FF6B00]" style={{ width: `${rc.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mt-12 pt-12 border-t border-gray-50 animate-fadeIn">
              <h3 className="text-sm font-bold text-navy mb-6">Laisser un avis pour ce professionnel</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">Votre note :</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`text-xl cursor-pointer transition-all border-none bg-transparent ${s <= rating ? 'text-forest' : 'text-gray-200'}`}
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
                  disabled={isSubmitting}
                  className="bg-forest text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-green-100 border-none cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi...' : 'Publier l\'avis'}
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gray-50 space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0">
                  <div className="flex justify-between items-start mb-4">
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
              ))}
            </div>
          )}
        </section>

        {/* Similar Projects Section */}
        <section>
          <h2 className="text-[14px] font-bold text-slate-400 mb-8 uppercase tracking-wider">Projets similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProjects.map((p) => (
              <article key={p.slug} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-mist border border-gray-100 text-navy text-[10px] font-bold flex items-center justify-center">
                      {(p.user?.professional_profile?.company_name || 'T').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-bold text-navy truncate">{p.user?.professional_profile?.company_name}</span>
                  </div>
                  
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative mb-4 bg-gray-50 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-300">
                        <i className="ti ti-photo-off text-2xl"></i>
                        <span className="text-[8px] font-bold uppercase">Aucune image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <button className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-navy shadow-sm hover:bg-white border-none cursor-pointer">
                        <i className="ti ti-bookmark text-[12px]"></i>
                      </button>
                      <button className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-navy shadow-sm hover:bg-white border-none cursor-pointer">
                        <i className="ti ti-share text-[12px]"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-[12px] font-bold text-navy leading-snug mb-2 line-clamp-1">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
                         {p.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#FF6B00] text-white text-[10px] font-bold rounded flex items-center justify-center gap-2">
                       <i className="ti ti-file-text"></i> Devis
                    </button>
                    <button className="flex-1 py-2 border border-gray-200 text-navy text-[10px] font-bold rounded flex items-center justify-center gap-2">
                       <i className="ti ti-message text-gray-400"></i> Message
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
