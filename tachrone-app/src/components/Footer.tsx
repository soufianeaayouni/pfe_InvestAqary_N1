import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr] gap-10 px-6 md:px-10 lg:px-16 py-10 md:py-[60px] bg-white border-t border-gray-200 font-poppins">
        <div className="flex flex-col gap-5">
          <h4 className="text-[28px] font-black text-navy m-0">
            InvestAqary
          </h4>
          <p className="text-[15px] text-slate font-medium leading-[1.6] max-w-[280px]">
            Votre partenaire de confiance pour vos projets immobiliers et BTP au Maroc.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h5 className="text-[15px] font-black text-navy uppercase tracking-widest">Liens</h5>
          <div className="flex flex-col gap-3">
            <Link to="/inscription-pro" className="text-[14px] text-slate hover:text-forest no-underline transition-all">Inscription Pro</Link>
            <Link to="/blog" className="text-[14px] text-slate hover:text-forest no-underline transition-all">Blog & Guides</Link>
            <Link to="/fournisseurs" className="text-[14px] text-slate hover:text-forest no-underline transition-all">Rechercher Matière</Link>
            <Link to="/maalems" className="text-[14px] text-slate hover:text-forest no-underline transition-all">Rechercher Prestataire</Link>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h5 className="text-[15px] font-black text-navy uppercase tracking-widest">Contact info</h5>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <i className="ti ti-map-pin text-[18px] text-forest"></i>
              <span className="text-[13px] text-slate leading-[1.5]">Kamal Park Center, Mohammedia, Maroc</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="ti ti-mail text-[18px] text-forest"></i>
              <span className="text-[13px] text-slate leading-[1.5]">contact@investaqary.ma</span>
            </div>
          </div>
        </div>
      </footer>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-10 lg:px-16 py-6 md:py-5 bg-white border-t border-gray-200 font-poppins text-center md:text-left">
        <p className="text-xs text-slate m-0 order-2 md:order-1">© 2026 InvestAqary. Tous droits réservés.</p>
        <div className="flex flex-wrap justify-center gap-6 items-center order-1 md:order-2">
          <Link to="/cgu" className="text-xs text-slate no-underline hover:text-navy transition-colors">Conditions d'utilisation</Link>
          <Link to="/cgu" className="text-xs text-slate no-underline hover:text-navy transition-colors">Conditions de vente</Link>
          <Link to="/cgu" className="text-xs text-slate no-underline hover:text-navy transition-colors">Politique de confidentialité</Link>
        </div>
      </div>
    </>
  );
}
