import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../data/apiService';

function HeartButton() {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <button 
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(!isLiked); }}
      className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center border-none cursor-pointer text-[13px] hover:text-[#E24B4A] transition-colors z-10"
      style={{ color: isLiked ? '#E24B4A' : '#94A3B8' }}
    >
      <i className={isLiked ? "ti ti-heart-filled" : "ti ti-heart"}></i>
    </button>
  );
}

export default function MaalemSection() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [maalems, setMaalems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'all', label: t('all') },
    { id: 'Aménagement Terrasse', label: t('cat_terrasse') },
    { id: 'Pose de vitres', label: t('cat_vitres') }
  ];

  useEffect(() => {
    const fetchMaalems = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/professionals', { 
          type: 'maalem',
          category: activeTab === 'all' ? undefined : activeTab
        });
        if (response.success) {
          setMaalems(response.data.slice(0, 8)); // Only show top 8
        }
      } catch (error) {
        console.error('Error fetching maalems for home:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaalems();
  }, [activeTab]);

  if (loading && maalems.length === 0) {
    return (
      <div className="px-4 md:px-10 lg:px-16 py-12 bg-cream border-t border-gray-200 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-16 py-12 bg-cream border-t border-gray-200 font-poppins">
      <div className="text-2xl md:text-[32px] font-extrabold text-[#111827] text-center mb-8">{t('sec_maalem_title')}</div>
      
      <div className="flex gap-3 flex-wrap mb-10 justify-center px-2">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl border-[1.5px] text-sm md:text-[15px] font-bold cursor-pointer transition-all ${
              activeTab === tab.id 
                ? 'bg-[#1E293B] text-white border-[#1E293B]' 
                : 'bg-white text-slate-500 border-gray-200 hover:border-[#1E293B] hover:text-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {maalems.map(maalem => {
          const displayName = maalem.name || `${maalem.first_name} ${maalem.last_name}`;
          const category = maalem.professional_profile?.category || 'Artisan';
          const profileImage = maalem.image;

          return (
            <Link 
              to={`/maalem/${maalem.id}`}
              key={maalem.id}
              className="bg-white rounded-[20px] border border-gray-200 overflow-hidden cursor-pointer transition-all hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(30,41,59,0.08)] relative group no-underline"
            >
              <div className="w-full h-[200px] overflow-hidden relative bg-gray-50 flex items-center justify-center">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={displayName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <i className="ti ti-user-circle text-5xl"></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Aucune photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                <HeartButton />
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-xl shadow-sm">
                  🛠️
                </div>
              </div>
              <div className="p-5 text-right">
                <div className="text-[17px] font-bold text-navy mb-1.5 group-hover:text-forest transition-colors">
                  {displayName}
                </div>
                <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-md mb-3 bg-green-50 text-forest uppercase tracking-wider border border-green-100">
                  {category}
                </span>
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 font-medium">
                  Professionnel qualifié sur la plateforme InvestAqary, engagé à fournir des services de qualité.
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="flex justify-end mt-5">
        <Link to="/maalems" className="flex items-center gap-1.5 px-[18px] py-2 rounded-lg border-[1.5px] border-navy bg-transparent text-navy font-semibold text-xs transition-colors hover:bg-navy hover:text-white no-underline">
          Tout voir <i className="ti ti-chevrons-right"></i>
        </Link>
      </div>
    </div>
  );
}
