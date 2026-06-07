import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { enterpriseMenuSections, matiereCategories, maalemCategories } from '../data/companyData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { Language } from '../data/translations';

interface HeaderProps {
  hideNav?: boolean;
}

export default function Header({ hideNav = false }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<'none' | 'choices' | 'entreprise' | 'maalem' | 'matieres' | 'language' | 'user' | 'blog'>('none');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[1];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu('none');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePrestataires = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(prev => (prev === 'choices' || prev === 'entreprise' || prev === 'maalem') ? 'none' : 'choices');
  };

  const toggleMatieres = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === 'matieres' ? 'none' : 'matieres');
  };

  const toggleBlog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === 'blog' ? 'none' : 'blog');
  };

  const toggleLanguage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === 'language' ? 'none' : 'language');
  };

  const toggleUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(prev => prev === 'user' ? 'none' : 'user');
  };

  const handleChoiceClick = (e: React.MouseEvent, type: 'entreprise' | 'maalem') => {
    e.stopPropagation();
    setActiveMenu(type);
  };

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    setActiveMenu('none');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setActiveMenu('none');
    setIsMobileMenuOpen(false);
  };

  return (
    <header ref={navRef} className="relative z-50 font-poppins" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center px-4 md:px-10 lg:px-16 py-4 bg-white border-b border-gray-100">
        <Link to="/" className="flex items-center no-underline" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="text-xl md:text-2xl font-black text-[#3D5A40]">InvestAqary</span>
        </Link>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleUser}
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-[13px] font-bold text-navy bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ti ti-user-circle text-lg text-forest"></i>
                {user?.name}
                <i className={`ti ti-chevron-down transition-transform ${activeMenu === 'user' ? 'rotate-180' : ''}`}></i>
              </button>
              
              {activeMenu === 'user' && (
                <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-2 w-[200px] bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-[100] overflow-hidden animate-fadeIn`}>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setActiveMenu('none')} className="w-full flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 text-sm font-bold transition-colors">
                      <i className="ti ti-dashboard text-lg text-forest"></i>
                      Dashboard Admin
                    </Link>
                  )}
                  {user?.role === 'client' && (
                    <Link to="/dashboard/client" onClick={() => setActiveMenu('none')} className="w-full flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 text-sm font-bold transition-colors">
                      <i className="ti ti-layout-dashboard text-lg text-forest"></i>
                      Mon Dashboard
                    </Link>
                  )}
                  {user?.role === 'pro' && (
                    <Link to="/dashboard/pro" onClick={() => setActiveMenu('none')} className="w-full flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 text-sm font-bold transition-colors">
                      <i className="ti ti-layout-dashboard text-lg text-forest"></i>
                      Espace Pro
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 border-none bg-transparent cursor-pointer text-red-500 hover:bg-red-50 text-sm font-bold transition-colors"
                  >
                    <i className="ti ti-logout text-lg"></i>
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/inscription-pro" className="text-[13px] font-bold text-forest no-underline hover:underline cursor-pointer">
                S'inscrire en tant que Pro
              </Link>
              <Link to="/connexion" className="px-5 py-2 border border-gray-300 rounded-md text-[13px] font-bold text-black no-underline hover:bg-gray-50 transition-colors">
                Se connecter
              </Link>
              <Link to="/inscription-client" className="px-5 py-2 bg-mist text-black border-none rounded-md text-[13px] font-bold no-underline hover:bg-[#A7C4BC] transition-colors shadow-sm">
                S'inscrire en tant que client
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-navy hover:bg-gray-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
        >
          <i className={`ti ${isMobileMenuOpen ? 'ti-x' : 'ti-menu-2'} text-2xl`}></i>
        </button>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex justify-between items-center px-10 lg:px-16 py-3 bg-white relative z-50 border-b border-gray-100">
        {!hideNav && (
          <div className="flex gap-6 xl:gap-[35px] items-center">
            <Link to="/" className="no-underline text-navy text-[13px] font-bold hover:text-forest transition-colors">Accueil</Link>
          
          <div className="relative">
            <button 
              onClick={togglePrestataires}
              className="border-none bg-transparent no-underline text-navy text-[13px] font-bold flex items-center gap-1.5 cursor-pointer py-2.5 hover:text-forest transition-colors"
            >
              Prestataires <i className={`ti ti-chevron-down transition-transform ${activeMenu === 'choices' || activeMenu === 'entreprise' || activeMenu === 'maalem' ? 'rotate-180' : ''}`}></i>
            </button>
            
            {/* Choice Menu */}
            {activeMenu === 'choices' && (
              <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} w-[180px] bg-white border border-gray-200 rounded-lg shadow-xl py-2.5 z-[100] animate-fadeIn`}>
                <div onClick={(e) => handleChoiceClick(e, 'entreprise')} className="flex items-center justify-between px-5 py-2.5 no-underline text-navy text-sm font-medium hover:bg-off-white hover:text-forest cursor-pointer transition-colors">
                  <span><span className="text-forest mr-2.5 text-base"><i className="ti ti-building"></i></span> Entreprise</span>
                  <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'} text-xs text-forest`}></i>
                </div>
                <div onClick={(e) => handleChoiceClick(e, 'maalem')} className="flex items-center justify-between px-5 py-2.5 no-underline text-navy text-sm font-medium hover:bg-off-white hover:text-forest cursor-pointer transition-colors">
                  <span><span className="text-forest mr-2.5 text-base"><i className="ti ti-hammer"></i></span> Maalem</span>
                  <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'} text-xs text-forest`}></i>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={toggleMatieres}
              className="border-none bg-transparent no-underline text-navy text-[13px] font-bold flex items-center gap-1.5 cursor-pointer py-2.5 hover:text-forest transition-colors"
            >
              Matières <i className={`ti ti-chevron-down transition-transform ${activeMenu === 'matieres' ? 'rotate-180' : ''}`}></i>
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={toggleBlog}
              className="border-none bg-transparent no-underline text-navy text-[13px] font-bold flex items-center gap-1.5 cursor-pointer py-2.5 hover:text-forest transition-colors"
            >
              Blog <i className={`ti ${activeMenu === 'blog' ? 'ti-chevron-up' : 'ti-chevron-down'} transition-transform`}></i>
            </button>
            {activeMenu === 'blog' && (
              <div className="absolute top-full left-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-[100] animate-fadeIn">
                <Link to="/blog" onClick={() => setActiveMenu('none')} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 text-[13px] font-medium transition-colors">
                  <span className="text-mist text-lg"><i className="ti ti-home"></i></span> Accueil
                </Link>
                <Link to="/blog?category=Guides de Prix" onClick={() => setActiveMenu('none')} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 text-[13px] font-medium transition-colors">
                  <span className="text-mist text-lg"><i className="ti ti-cash"></i></span> Guides de Prix
                </Link>
                <Link to="/blog?category=Conseils Travaux" onClick={() => setActiveMenu('none')} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 text-[13px] font-medium transition-colors">
                  <span className="text-mist text-lg"><i className="ti ti-info-circle"></i></span> Conseils Travaux
                </Link>
              </div>
            )}
          </div>

          <Link to="/simulateur" className="no-underline text-navy text-[13px] font-bold hover:text-forest transition-colors">Simulateur</Link>
        </div>
        )}

        {/* Mega Menus Container - Zoom-proof positioning OUTSIDE the centered container */}
        <div className="absolute top-full left-0 right-0 z-[1000] pointer-events-none pt-1 flex justify-center">
          <div className="w-[98vw] max-w-[1300px] px-2">
            {/* Entreprise / Maalem Menu */}
            {(activeMenu === 'entreprise' || activeMenu === 'maalem') && (
              <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeInMega p-4 md:p-5 w-full max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                {activeMenu === 'entreprise' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-0">
                      {enterpriseMenuSections.flat().map((item) => (
                        <Link
                          key={item.slug}
                          to={`/entreprises?category=${encodeURIComponent(item.label)}`}
                          onClick={() => setActiveMenu('none')}
                          className="flex items-center gap-2 no-underline text-slate-700 text-[11.5px] font-semibold px-2 py-1 rounded-lg hover:bg-off-white hover:text-gold transition-all group"
                        >
                          <span className="text-gold text-[16px] w-5 flex justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <i className={`ti ${item.icon}`}></i>
                          </span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
                      <Link 
                        to="/entreprises" 
                        onClick={() => setActiveMenu('none')}
                        className="text-gold font-bold text-[12px] no-underline flex items-center gap-1.5 hover:underline"
                      >
                        Voir tout <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'}`}></i>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="animate-fadeIn">
                    <div className="px-3 py-1 text-forest font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2 border-b border-gray-50 w-fit">
                      <i className="ti ti-hammer"></i> Catégories Maalem
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-0">
                      {maalemCategories.map((item) => (
                        <Link
                          key={item.label}
                          to={`/maalems?category=${encodeURIComponent(item.label)}`}
                          onClick={() => setActiveMenu('none')}
                          className="flex items-center gap-2 no-underline text-slate-700 text-[11.5px] font-semibold px-2 py-1 rounded-lg hover:bg-off-white hover:text-forest transition-all group"
                        >
                          <span className="text-forest text-[16px] w-5 flex justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <i className={`ti ${item.icon}`}></i>
                          </span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
                      <Link 
                        to="/maalems" 
                        onClick={() => setActiveMenu('none')}
                        className="text-forest font-bold text-[12px] no-underline flex items-center gap-1.5 hover:underline"
                      >
                        Voir tout <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'}`}></i>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Matières Menu */}
            {activeMenu === 'matieres' && (
              <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeInMega p-4 md:p-5 w-full max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-0">
                  {matiereCategories.map((item) => (
                    <Link
                      key={item.label}
                      to={`/fournisseurs?category=${encodeURIComponent(item.label)}`}
                      onClick={() => setActiveMenu('none')}
                      className="flex items-center gap-2 no-underline text-slate-700 text-[11.5px] font-semibold px-2 py-1 rounded-lg hover:bg-off-white hover:text-forest transition-all group"
                    >
                      <span className="text-forest text-[16px] w-5 flex justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <i className={`ti ${item.icon}`}></i>
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
                <div className="flex justify-end mt-3 pt-2 border-t border-gray-100">
                  <Link 
                    to="/fournisseurs" 
                    onClick={() => setActiveMenu('none')}
                    className="text-forest font-bold text-[12px] no-underline flex items-center gap-1.5 hover:underline"
                  >
                    Voir tout <i className={`ti ${isRTL ? 'ti-chevron-left' : 'ti-chevron-right'}`}></i>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-[15px]">
          <div className="relative">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border-none rounded-md text-[13px] font-bold text-navy hover:bg-green-100 transition-colors cursor-pointer"
            >
              <span>{currentLang.code.toUpperCase()}</span>
              <i className={`ti ti-chevron-down transition-transform ${activeMenu === 'language' ? 'rotate-180' : ''}`}></i>
            </button>
            
            {activeMenu === 'language' && (
              <div className={`absolute top-full right-0 mt-2 w-[140px] bg-white border border-gray-200 rounded-lg shadow-xl py-1.5 z-[100] overflow-hidden animate-fadeIn`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-navy hover:bg-off-white transition-colors border-none bg-transparent cursor-pointer ${language === lang.code ? 'bg-off-white text-forest' : ''}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar/Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Menu Content */}
          <div className={`relative w-[80%] max-w-[300px] bg-white h-full shadow-2xl flex flex-col animate-slideInRight overflow-y-auto ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold text-navy">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-navy bg-transparent border-none cursor-pointer">
                <i className="ti ti-x text-xl"></i>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 rounded-xl text-sm font-bold">
                <i className="ti ti-home text-forest"></i> Accueil
              </Link>
              
              <Link to="/entreprises" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 rounded-xl text-sm font-bold">
                <i className="ti ti-building text-forest"></i> Entreprises
              </Link>
              
              <Link to="/maalems" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 rounded-xl text-sm font-bold">
                <i className="ti ti-hammer text-forest"></i> Maalems
              </Link>
              
              <Link to="/fournisseurs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 rounded-xl text-sm font-bold">
                <i className="ti ti-building-warehouse text-forest"></i> Matières
              </Link>

              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 rounded-xl text-sm font-bold">
                <i className="ti ti-news text-forest"></i> Blog
              </Link>

              <Link to="/simulateur" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 no-underline text-navy hover:bg-gray-50 rounded-xl text-sm font-bold">
                <i className="ti ti-calculator text-forest"></i> Simulateur
              </Link>
            </div>

            <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-white font-bold">
                      {user?.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy">{user?.name}</p>
                      <p className="text-[10px] text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-navy text-white rounded-xl text-xs font-bold no-underline">
                      <i className="ti ti-dashboard"></i> Panel Admin
                    </Link>
                  )}
                  {user?.role === 'pro' && (
                    <Link to="/dashboard/pro" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-navy text-white rounded-xl text-xs font-bold no-underline">
                      <i className="ti ti-layout-dashboard"></i> Espace Pro
                    </Link>
                  )}
                  {user?.role === 'client' && (
                    <Link to="/dashboard/client" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 bg-forest text-white rounded-xl text-xs font-bold no-underline">
                      <i className="ti ti-user-circle"></i> Mon Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 text-red-500 bg-white rounded-xl text-xs font-bold cursor-pointer">
                    <i className="ti ti-logout"></i> Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/connexion" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-3 border border-navy text-navy rounded-xl text-xs font-bold no-underline">
                    Se connecter
                  </Link>
                  <Link to="/inscription-client" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-3 bg-mist text-black rounded-xl text-xs font-bold no-underline">
                    S'inscrire
                  </Link>
                </div>
              )}
              
              <div className="mt-6 flex justify-center gap-4">
                {languages.map(lang => (
                  <button 
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-2 rounded-lg border ${language === lang.code ? 'border-forest bg-green-50' : 'border-gray-200 bg-white'} cursor-pointer`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
