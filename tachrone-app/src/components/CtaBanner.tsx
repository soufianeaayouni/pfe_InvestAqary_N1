import { Link } from 'react-router-dom';

export default function CtaBanner() {
  return (
    <>
      <div className="bg-navy rounded-2xl px-6 md:px-10 py-9 flex flex-col md:flex-row items-center gap-6 md:gap-8 mx-4 md:mx-10 lg:mx-16 my-9 font-poppins">
        <div className="text-5xl md:text-[72px] shrink-0 opacity-90">🏗️</div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-[22px] font-extrabold text-white leading-[1.3] mb-2.5">
            Estimez la <span className="text-mist">rentabilité</span> de votre projet immobilier en quelques clics !
          </h2>
          <p className="text-[12.5px] text-white/75 leading-[1.7] mb-5">
            Estimez le coût total de votre projet (achat du terrain, construction, études, frais administratifs...) et découvrez votre rentabilité potentielle.
          </p>
          <Link to="/simulateur" className="inline-flex items-center gap-2 px-[22px] py-[11px] bg-mist text-navy rounded-lg font-bold text-[13px] no-underline hover:bg-[#8FB3AB] transition-colors">
            <i className="ti ti-calculator text-lg"></i> Lancer la simulation
          </Link>
        </div>
      </div>

      <div className="bg-forest rounded-2xl px-6 md:px-10 py-8 mx-4 md:mx-10 lg:mx-16 mb-9 flex flex-col md:flex-row items-center gap-6 md:gap-10 font-poppins">
        <div className="text-4xl shrink-0">🏗️</div>
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-[17px] font-bold text-white mb-1.5">Abonnez-vous à notre newsletter</h3>
          <p className="text-xs text-white/70 mb-3.5">Restez informé(e) des dernières nouveautés et offres spéciales !</p>
          <div className="flex w-full">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-1 px-3.5 py-2.5 bg-white border-none rounded-l-lg text-xs outline-none font-poppins"
            />
            <button className="px-4 py-2.5 bg-mist text-navy border-none rounded-r-lg cursor-pointer text-base hover:bg-[#8FB3AB] transition-colors flex items-center justify-center">
              <i className="ti ti-send"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
