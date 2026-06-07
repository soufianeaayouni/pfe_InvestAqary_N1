import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="flex flex-col lg:flex-row px-4 md:px-10 lg:px-24 py-12 md:py-20 bg-white items-center gap-10 lg:gap-16 font-poppins min-h-[550px] overflow-hidden">
      <div className="flex-1 w-full max-w-[700px]">
        <h1 className="text-3xl md:text-[52px] font-extrabold text-[#1E293B] leading-[1.2] mb-10 text-center lg:text-left">
          La plateforme qui vous accompagne pour trouver vos <span className="relative inline-block">
            <span className="relative z-10">matières et prestataires</span>
            <span className="absolute -bottom-1 left-0 w-full h-2.5 bg-[#A7C4BC]/40 -z-0"></span>
          </span> dans le <span className="text-[#3D5A40]">BTP</span>
        </h1>
        
        <div className="flex flex-col gap-8 mx-auto lg:mx-0">
          <div className="flex flex-wrap justify-center lg:justify-start gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5 rounded-md border-2 border-gray-200 flex items-center justify-center transition-all bg-white group-hover:border-[#3D5A40]">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-3 h-3 bg-[#3D5A40] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[15px] font-semibold text-gray-400 peer-checked:text-[#1E293B] group-hover:text-[#1E293B] transition-colors">Prestataires de service</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5 rounded-md border-2 border-gray-200 flex items-center justify-center transition-all bg-white group-hover:border-[#3D5A40]">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-3 h-3 bg-[#3D5A40] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-[15px] font-semibold text-gray-400 group-hover:text-[#1E293B] transition-colors">Matières</span>
            </label>
          </div>

          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-[#3D5A40] focus-within:shadow-md transition-all max-w-[650px]"
          >
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Recherche..." 
              className="flex-1 px-6 py-4 text-base text-navy outline-none placeholder:text-gray-300 w-full font-medium"
            />
            <button 
              type="submit"
              className="bg-[#3D5A40] text-white border-none h-[60px] px-8 flex items-center justify-center cursor-pointer hover:bg-[#2D4330] transition-colors"
            >
              <i className="ti ti-search text-xl"></i>
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center w-full lg:w-auto relative">
        <div className="relative w-full max-w-[550px] flex items-center justify-center">
          <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-[#3D5A40]">
            {/* Main House Structure */}
            <path d="M50 300H350V150L200 50L50 150V300Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="opacity-80"/>
            
            {/* Second Roof/Part */}
            <path d="M50 150L20 180V300H50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="opacity-80"/>
            
            {/* Windows/Doors */}
            <rect x="230" y="180" width="50" height="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" className="opacity-80"/>
            <rect x="255" y="180" width="1" height="60" stroke="currentColor" stroke-width="1.5" className="opacity-40"/>
            
            {/* Hammer */}
            <g transform="translate(80, 200) rotate(-45)">
              <rect x="0" y="0" width="40" height="6" fill="currentColor" rx="2" className="opacity-90"/>
              <rect x="35" y="-10" width="10" height="26" fill="currentColor" rx="2" className="opacity-90"/>
            </g>

            {/* Paint Roller */}
            <g transform="translate(320, 240) rotate(15)">
              <rect x="0" y="0" width="4" height="40" fill="currentColor" rx="2" className="opacity-90"/>
              <path d="M-15 -10H15V10H-15V-10Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" className="opacity-90"/>
            </g>

            {/* Decorative Stars */}
            <path d="M360 120L365 130L375 132L367 138L370 148L360 142L350 148L353 138L345 132L355 130L360 120Z" fill="currentColor" className="opacity-20"/>
            <path d="M40 80L43 87L50 88L45 92L47 98L40 94L33 98L35 92L30 88L37 87L40 80Z" fill="currentColor" className="opacity-20"/>
            <circle cx="200" cy="110" r="15" stroke="currentColor" stroke-width="2.5" className="opacity-80"/>
          </svg>
          
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-forest/5 blur-[100px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
