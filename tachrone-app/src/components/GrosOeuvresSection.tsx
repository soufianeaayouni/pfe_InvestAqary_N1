import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '../data/apiService';

export default function GrosOeuvresSection() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/professionals', { 
          type: 'entreprise',
          category: 'Gros oeuvres'
        });
        if (response.success) {
          setCompanies(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching companies for Gros Oeuvres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading && companies.length === 0) return null;

  return (
    <section className="px-4 md:px-10 lg:px-16 py-10 bg-white font-poppins">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-[28px] font-extrabold text-navy m-0">Gros œuvres</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {companies.map(company => {
          const displayName = company.professional_profile?.company_name || company.name;
          const initials = displayName.substring(0, 2).toUpperCase();
          return (
            <Link 
              key={company.id}
              to={`/entreprise/${company.id}`} 
              className="bg-white border border-gray-200 rounded-[15px] p-[15px] flex flex-col gap-3 no-underline transition-transform hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(30,41,59,0.11)]"
            >
              <div className="bg-slate-200 h-[120px] rounded-[10px] flex items-center justify-center text-[40px]">
                {company.professional_profile?.category === 'Gros oeuvres' ? '🏗️' : '🏢'}
              </div>
              <div className="flex justify-between items-end -mt-[30px]">
                <div className="bg-white p-1 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-[60px] h-[60px] flex items-center justify-center font-extrabold text-forest text-xl relative z-10">
                  {initials}
                </div>
              </div>
              <div className="text-sm font-bold text-navy mt-1 uppercase">{displayName}</div>
              <div className="inline-block px-2.5 py-1 bg-cream text-forest rounded-md text-[10px] font-bold w-fit">
                {company.professional_profile?.category || 'Gros oeuvres'}
              </div>
              {company.professional_profile?.description && (
                <p className="text-[11px] text-slate leading-[1.5] line-clamp-2 uppercase">
                  {company.professional_profile?.description}
                </p>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="flex justify-end mt-5">
        <Link to="/entreprises?category=Gros%20oeuvres" className="flex items-center gap-1.5 px-[18px] py-2 rounded-lg border-[1.5px] border-navy bg-transparent text-navy font-semibold text-xs transition-colors hover:bg-navy hover:text-white no-underline">
          Tout voir <i className="ti ti-chevrons-right"></i>
        </Link>
      </div>
    </section>
  );
}
