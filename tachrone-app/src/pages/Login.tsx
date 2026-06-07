import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        // Redirection logique selon l'utilisateur
        if (loggedInUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (loggedInUser.role === 'pro') {
          navigate('/dashboard/pro', { replace: true });
        } else {
          // If there's a redirect path from location state, use it, otherwise go to client dashboard
          const redirectPath = location.state?.from?.pathname || "/dashboard/client";
          navigate(redirectPath, { replace: true });
        }
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F1F5F9] min-h-screen flex flex-col font-poppins relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-navy transition-colors no-underline font-bold text-sm"
      >
        <i className="ti ti-arrow-left text-lg"></i>
        Quitter
      </Link>
      
      <div className="bg-white w-[90%] max-w-[1000px] mx-auto my-10 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex overflow-hidden flex-1 md:flex-row flex-col">
        
        {/* Form Side */}
        <div className="flex-1 p-10 md:p-[60px] flex flex-col justify-center">
          <Link to="/" className="text-2xl font-extrabold text-navy no-underline mb-8 block md:hidden">
            InvestAqary
          </Link>
          <h2 className="text-2xl font-bold text-navy mb-[30px] text-center">
            Connexion <span className="text-forest">InvestAqary</span>
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded">
              {error}
            </div>
          )}

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <label className="block text-[13px] font-semibold text-navy mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com" 
                required
                className="w-full py-3 pr-10 pl-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
              />
              <i className="ti ti-mail absolute right-4 bottom-3.5 text-slate text-lg"></i>
            </div>
            
            <div className="mb-5 relative">
              <label className="block text-[13px] font-semibold text-navy mb-2">Mot de passe</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-3 pr-10 pl-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
              />
              <i 
                className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'} absolute right-4 bottom-3.5 text-slate text-lg cursor-pointer hover:text-navy transition-colors`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <a href="#" className="block text-xs text-forest no-underline mb-[25px] font-medium hover:underline">Mot de passe oublié?</a>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-forest text-white border-none p-3.5 rounded-lg font-bold text-[15px] cursor-pointer hover:bg-[#2D4330] transition-colors mb-5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <p className="text-center text-xs text-slate">
              Vous n'avez pas de compte? <Link to="/inscription-client" className="text-forest no-underline font-bold hover:underline">S'inscrire</Link>
            </p>
          </form>
        </div>

        {/* Illustration Side */}
        <div className="flex-1 bg-off-white p-10 md:p-[60px] flex flex-col items-center justify-center md:border-l border-t md:border-t-0 border-gray-200">
          <Link to="/" className="text-[32px] font-extrabold text-navy no-underline mb-10 hidden md:block self-start">
            Invest<span className="text-forest">a</span><span className="text-mist">Qary</span>
          </Link>
          
          <div className="w-full max-w-[250px] mb-10">
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 250H350V150L200 50L50 150V250Z" stroke="#E2E8F0" strokeWidth="2"/>
              <path d="M100 250V180H150V250" stroke="#E2E8F0" strokeWidth="2"/>
              <circle cx="200" cy="180" r="40" stroke="#3D5A40" strokeWidth="2"/>
              <path d="M180 170L200 190L220 170" stroke="#D4A017" strokeWidth="3"/>
              <rect x="300" y="200" width="20" height="50" fill="#3D5A40" fillOpacity="0.2"/>
            </svg>
          </div>
          

        </div>
      </div>

      <p className="text-[10px] text-slate text-center my-5 px-[60px] leading-[1.5]">
        En m'inscrivant, en me connectant ou en continuant, j'accepte les <Link to="/cgu" className="text-forest hover:underline" target="_blank">Conditions d'Utilisation</Link> et <Link to="/cgu" className="text-forest hover:underline" target="_blank">Politique de Confidentialité</Link> de InvestaQary, ainsi que les <Link to="/cgu" className="text-forest hover:underline" target="_blank">Conditions Générales de Vente</Link>.
      </p>
    </div>
  );
}
