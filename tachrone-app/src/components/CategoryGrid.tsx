import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryGrid() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[30px] px-4 md:px-10 lg:px-16 py-10 bg-[#fcfcfc] font-poppins">
      
      {/* Trouver Prestataire */}
      <div className="bg-white rounded-[20px] p-6 md:p-[30px] border border-gray-200">
        <div className="flex justify-center items-center mb-6 md:mb-[30px] relative">
          <h3 className="text-xl md:text-[22px] font-bold text-navy m-0">{t('find_provider')}</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-[15px] text-center">
          <Link to="/prestataires?category=Gros oeuvres" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🏗️</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Gros oeuvres</div>
          </Link>
          <Link to="/prestataires?category=Travaux d'aménagement" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🛠️</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Travaux d'aménagem...</div>
          </Link>
          <Link to="/prestataires?category=Installation Électrique" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">⚡</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Installation Électrique</div>
          </Link>
          <Link to="/prestataires?category=Architecte" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">📐</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Architecte</div>
          </Link>
          <Link to="/prestataires?category=Architecte d'intérieur" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🏠</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Architecte d'intérieur</div>
          </Link>
        </div>
        
        <Link to="/prestataires" className="mt-[30px] w-full p-2.5 border border-gray-200 rounded-[10px] bg-white text-slate text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer no-underline hover:bg-gray-50 transition-colors">
          {t('view_all')} <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'}`}></i>
        </Link>
      </div>

      {/* Trouver Matière */}
      <div className="bg-white rounded-[20px] p-6 md:p-[30px] border border-gray-200">
        <div className="flex justify-center items-center mb-6 md:mb-[30px] relative">
          <h3 className="text-xl md:text-[22px] font-bold text-navy m-0">{t('find_material')}</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-[15px] text-center">
          <Link to="/fournisseurs?category=Matériaux de construction" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🧱</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Matériaux de construction</div>
          </Link>
          <Link to="/fournisseurs?category=Matériel électrique" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🔌</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Matériel électrique</div>
          </Link>
          <Link to="/fournisseurs?category=Salle de bain/sanitaire" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🛁</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Salle de bain/sanitaire</div>
          </Link>
          <Link to="/fournisseurs?category=Peinture" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🎨</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Peinture</div>
          </Link>
          <Link to="/fournisseurs?category=Piscine" className="cursor-pointer no-underline group">
            <div className="w-[70px] h-[70px] bg-off-white rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-[30px] shadow-[0_4px_10_rgba(0,0,0,0.03)] group-hover:-translate-y-1 transition-transform">🏊</div>
            <div className="text-[11px] font-semibold text-navy leading-[1.3]">Piscine</div>
          </Link>
        </div>
        
        <Link to="/fournisseurs" className="mt-[30px] w-full p-2.5 border border-gray-200 rounded-[10px] bg-white text-slate text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer no-underline hover:bg-gray-50 transition-colors">
          {t('view_all')} <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'}`}></i>
        </Link>
      </div>

    </div>
  );
}
