import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../data/apiService';

export default function ProjectSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/projects');
        if (response.success) {
          setProjects(response.data.slice(0, 4)); // Show top 4
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading && projects.length === 0) return null;

  return (
    <div className="px-4 md:px-10 lg:px-16 py-12 bg-white border-t border-gray-200 font-poppins">
      <div className="text-2xl md:text-[32px] font-extrabold text-[#111827] text-center mb-10">Découvrir les derniers projets</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map(project => (
          <Link 
            key={project.id}
            to={`/projet/${project.slug}`} 
            className="bg-white rounded-[20px] border border-gray-200 overflow-hidden cursor-pointer transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(30,41,59,0.08)] relative group no-underline"
          >
            <div className="w-full h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center">
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <i className="ti ti-photo-off text-4xl"></i>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Aucune image</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="text-sm font-bold text-navy mb-2 uppercase group-hover:text-forest transition-colors line-clamp-2">{project.title}</div>
              {(project.subtitle || project.description) && (
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 font-medium">{project.subtitle || project.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-end mt-8">
        <Link to="/projets" className="flex items-center gap-1.5 px-[18px] py-2 rounded-lg border-[1.5px] border-navy bg-transparent text-navy font-semibold text-xs transition-colors hover:bg-navy hover:text-white no-underline">
          Tout voir <i className="ti ti-chevrons-right"></i>
        </Link>
      </div>
    </div>
  );
}
