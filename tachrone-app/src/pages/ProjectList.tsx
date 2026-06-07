import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../data/apiService';

export default function ProjectList() {
  const { t, language, isRTL } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/projects');
        if (response.success) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="max-w-[1220px] mx-auto px-4 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-navy mb-2">
              {language === 'ar' ? 'جميع المشاريع' : language === 'en' ? 'All Projects' : 'Tous les projets'}
            </h1>
            <p className="text-slate-500 font-medium">
              {language === 'ar' ? 'اكتشف الإنجازات الرائعة لمزودينا' : language === 'en' ? 'Discover the amazing achievements of our providers' : 'Découvrez les réalisations exceptionnelles de nos prestataires'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-navy">{projects.length} {language === 'ar' ? 'مشاريع' : 'projets'}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link 
              to={`/projet/${project.slug}`} 
              key={project.slug}
              className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group no-underline"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-gray-50 flex items-center justify-center">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <i className="ti ti-photo-off text-5xl"></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Aucune image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-navy shadow-sm">
                  {project.category}
                </div>
              </div>
              
              <div className="p-5 text-right">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-forest to-navy text-white text-[10px] font-bold flex items-center justify-center">
                    {(project.user?.professional_profile?.company_name || project.user?.name || 'I').substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[12px] font-bold text-navy truncate">
                    {project.user?.professional_profile?.company_name || project.user?.name}
                  </span>
                </div>
                
                <h3 className="text-[15px] font-bold text-navy mb-2 group-hover:text-forest transition-colors line-clamp-1 uppercase">
                  {project.title}
                </h3>
                
                {project.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-4 uppercase">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-mist">
                    <i className="ti ti-star-filled text-[12px]"></i>
                    <span className="text-[11px] font-bold text-navy">4.5</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    <i className="ti ti-map-pin mr-1"></i> {project.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-xl font-bold text-navy">Aucun projet trouvé</h2>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
