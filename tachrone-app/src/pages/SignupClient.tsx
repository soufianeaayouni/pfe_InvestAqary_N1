import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../data/apiService';
import Footer from '../components/Footer';

export default function SignupClient() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState<'initial' | 'company' | 'prestation' | 'serviceCategories' | 'matiereCategories'>('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Registration data
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [prestationType, setPrestationType] = useState<'services' | 'matiere' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMatiereCategories, setSelectedMatiereCategories] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(57);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    city: ''
  });

  useEffect(() => {
    if (currentStep === 3 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, countdown]);

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, we would verify the code first.
      // For now, we'll proceed to create the account.
      const res = await apiService.post('/register/client', formData);
      if (res.success) {
        alert('Compte créé avec succès ! Votre compte est en attente d\'activation par l\'administrateur.');
        navigate('/connexion');
      }
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const serviceCategories = [
    { name: 'Aménagement Terrasse / Véranda', icon: 'ti-home-plus' },
    { name: 'Ameublement', icon: 'ti-armchair' },
    { name: 'Architecte', icon: 'ti-pencils' },
    { name: 'Architecte d\'intérieur', icon: 'ti-palette' },
    { name: 'Bureau d\'étude', icon: 'ti-report-analytics' },
    { name: 'Bureau de contrôle', icon: 'ti-clipboard-check' },
    { name: 'Gros œuvres', icon: 'ti-building-skyscraper' },
    { name: 'Infographie 3D / maquette', icon: 'ti-3d-cube-sphere' },
    { name: 'Installation ascenseurs', icon: 'ti-elevator' },
    { name: 'Installation Charpente métallique', icon: 'ti-frame' },
    { name: 'Installation Climatisation', icon: 'ti-air-conditioning' },
    { name: 'Installation de Piscine', icon: 'ti-swimming' },
    { name: 'Installation de plomberie', icon: 'ti-droplet' },
    { name: 'Installation de Revêtement de sol', icon: 'ti-layers-intersect' },
    { name: 'Installation de Revêtement mural', icon: 'ti-wallpaper' },
    { name: 'Installation Domotique', icon: 'ti-smart-home' },
    { name: 'Installation Électrique', icon: 'ti-bolt' },
    { name: 'Installation Système audio', icon: 'ti-speakerphone' },
    { name: 'Laboratoire', icon: 'ti-microscope' },
    { name: 'Location engin de chantier', icon: 'ti-crane' },
    { name: 'Nettoyage de chantier', icon: 'ti-trash' },
    { name: 'Paysagiste', icon: 'ti-leaf' },
    { name: 'Pose d\'Aluminium', icon: 'ti-square' },
    { name: 'Pose de Carrelage', icon: 'ti-grid-dots' },
    { name: 'Pose de Cuisine', icon: 'ti-chef-hat' },
    { name: 'Pose de Faux plafond', icon: 'ti-arrow-up-bar' },
    { name: 'Pose de Fenêtre / portes / volets', icon: 'ti-window' },
    { name: 'Pose de Menuiserie', icon: 'ti-hammer' },
    { name: 'Pose de Peinture', icon: 'ti-paint' },
    { name: 'Pose de vitres', icon: 'ti-glass' },
    { name: 'Pose Isolation / étanchéité', icon: 'ti-shield-check' },
    { name: 'Terrassement', icon: 'ti-shovel' },
    { name: 'Topographe', icon: 'ti-map-2' },
    { name: 'Transport', icon: 'ti-truck' },
    { name: 'Travaux d\'aménagement', icon: 'ti-tools' },
    { name: 'Vidéo et photo immobilière', icon: 'ti-camera' },
  ];

  const matiereCategories = [
    { name: 'Aluminium', icon: 'ti-square' },
    { name: 'Aménagement extérieur', icon: 'ti-leaf' },
    { name: 'Ascenseurs', icon: 'ti-elevator' },
    { name: 'Automatisme', icon: 'ti-settings' },
    { name: 'Bâtiment modulaire', icon: 'ti-building' },
    { name: 'Cache rideau', icon: 'ti-window' },
    { name: 'Carrelage', icon: 'ti-grid-dots' },
    { name: 'Climatisation/chauffage', icon: 'ti-air-conditioning' },
    { name: 'Cuisine', icon: 'ti-chef-hat' },
    { name: 'EPI', icon: 'ti-mask' },
    { name: 'Etanchéité', icon: 'ti-shield-check' },
    { name: 'Ferronnerie / métallurgie', icon: 'ti-hammer' },
    { name: 'Incendie', icon: 'ti-flame' },
    { name: 'Isolation', icon: 'ti-border-all' },
    { name: 'Luminaire', icon: 'ti-bulb' },
    { name: 'Matériaux de construction', icon: 'ti-building-estate' },
    { name: 'Matériel de chantier', icon: 'ti-crane' },
    { name: 'Matériel électrique', icon: 'ti-bolt' },
    { name: 'Menuiserie', icon: 'ti-tools' },
    { name: 'Peinture', icon: 'ti-paint' },
    { name: 'Pierre naturelle', icon: 'ti-mountain' },
    { name: 'Piscine', icon: 'ti-swimming' },
    { name: 'Plâtre', icon: 'ti-wall' },
    { name: 'Plomberie', icon: 'ti-droplet' },
    { name: 'Quincaillerie', icon: 'ti-settings-2' },
    { name: 'Revêtement mur', icon: 'ti-wallpaper' },
    { name: 'Revêtement sol', icon: 'ti-layers-intersect' },
    { name: 'Rideaux magasins', icon: 'ti-window-maximize' },
    { name: 'Salle de bain/sanitaire', icon: 'ti-bath' },
    { name: 'Système audio', icon: 'ti-speakerphone' },
    { name: 'Système de surveillance', icon: 'ti-video' },
    { name: 'Vitrerie', icon: 'ti-glass' },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleMatiereCategory = (category: string) => {
    setSelectedMatiereCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const [isSuccess, setIsSubmittingSuccess] = useState(false);

  const handleNextStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (currentStep === 2) {
      if (subStep === 'initial') {
        if (hasCompany === false) {
          // Non-enterprise client: create account directly (active, no admin needed)
          await handleFinalRegister();
        } else if (hasCompany === true) {
          // Enterprise: redirect to pro registration
          navigate('/inscription-pro');
        }
      } else if (subStep === 'company') {
        setSubStep('prestation');
      } else if (subStep === 'prestation') {
        if (prestationType === 'services') {
          setSubStep('serviceCategories');
        } else if (prestationType === 'matiere') {
          setSubStep('matiereCategories');
        } else {
          await handleFinalRegister();
        }
      } else if (subStep === 'serviceCategories' || subStep === 'matiereCategories') {
        await handleFinalRegister();
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinalRegister = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiService.post('/register/client', {
        ...formData,
        company_info: hasCompany ? companyInfo : null,
        categories: prestationType === 'services' ? selectedCategories : selectedMatiereCategories,
        prestation_type: prestationType
      });
      if (res.success) {
        setIsSubmittingSuccess(true);
      }
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      if (subStep === 'company') {
        setSubStep('initial');
      } else if (subStep === 'prestation') {
        setSubStep(hasCompany ? 'company' : 'initial');
      } else if (subStep === 'serviceCategories' || subStep === 'matiereCategories') {
        setSubStep('prestation');
      } else {
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-poppins">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-2xl font-extrabold text-[#1E293B] no-underline flex items-baseline gap-1">
          InvestAqary
        </Link>

        {/* Step Indicator */}
        {!isSuccess && (
          <div className="flex items-center gap-8">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              {currentStep > 1 ? (
                <div className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-[10px]">
                  <i className="ti ti-check"></i>
                </div>
              ) : (
                <div className={`w-6 h-6 rounded-full ${currentStep === 1 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-600'} text-[10px] font-bold flex items-center justify-center`}>1</div>
              )}
              <span className={`text-xs font-bold ${currentStep >= 1 ? 'text-forest' : 'text-gray-400'}`}>Inscription</span>
            </div>
            
            <div className="w-8 h-[1px] bg-gray-200 dashed"></div>

            {/* Step 2 */}
            <div className={`flex items-center gap-2 ${currentStep < 2 ? 'opacity-30' : ''}`}>
              <div className={`w-6 h-6 rounded-full ${currentStep === 2 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-600'} text-[10px] font-bold flex items-center justify-center`}>2</div>
              <span className={`text-xs font-bold ${currentStep >= 2 ? 'text-forest' : 'text-gray-600'}`}>Préférences</span>
            </div>
          </div>
        )}

        <Link to="/" className="text-sm font-bold text-[#1E293B] no-underline hover:text-forest transition-colors">Quitter</Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        {isSuccess ? (
          <div className="bg-white w-full max-w-[600px] rounded-[30px] border border-gray-100 shadow-xl p-12 text-center animate-scaleIn">
            <div className="w-20 h-20 bg-green-100 text-forest rounded-full flex items-center justify-center text-4xl mx-auto mb-8">
              <i className="ti ti-check"></i>
            </div>
            <h1 className="text-3xl font-black text-[#1E293B] mb-4">Compte créé !</h1>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Félicitations {formData.first_name}, votre compte InvestAqary a été créé avec succès. Vous pouvez maintenant vous connecter.
            </p>
            <Link 
              to="/connexion" 
              className="inline-block bg-forest text-white px-10 py-4 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-green-100 no-underline"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <>
            {/* Previous Button */}
        {currentStep > 1 && (
          <button 
            onClick={handlePrevStep}
            className="absolute left-10 top-[40%] -translate-y-1/2 flex items-center gap-2 bg-[#FFD400] hover:bg-[#FFC000] text-[#1E293B] px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm z-50"
          >
            <i className="ti ti-chevron-left"></i> Précédent
          </button>
        )}

        {currentStep === 1 && (
          <div className="bg-white w-[90%] max-w-[1200px] mx-auto rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex overflow-hidden flex-1 md:flex-row flex-col animate-fadeIn">
            {/* Form Side */}
            <div className="flex-[1.2] p-10 md:p-[60px]">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-8">Créez votre compte client</h2>
              
              <form onSubmit={handleNextStep}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="mb-5 md:mb-0">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Nom*</label>
                    <input 
                      type="text" 
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
                    />
                  </div>
                  <div className="mb-5 md:mb-0">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Prénom*</label>
                    <input 
                      type="text" 
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 mb-5 md:mb-0">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Numéro de téléphone*</label>
                    <div className="flex gap-2.5">
                      <div className="w-[80px] flex items-center gap-1.5 p-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px]">
                        <img src="https://flagcdn.com/w20/ma.png" alt="Morocco" className="w-5" /> +212
                      </div>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="flex-1 py-3 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 mb-5 md:mb-0">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Email*</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 mb-5 md:mb-0">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Mot de passe*</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2 mb-5 md:mb-0">
                    <label className="block text-[13px] font-semibold text-[#1E293B] mb-2">Confirmer votre mot de passe*</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                      className="w-full py-3 px-4 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-colors"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 mb-5">
                  Conformément à la loi n° 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Ce traitement a été autorisé par la CNDP sous le numéro D-W-532/2014.
                </p>

                <div className="flex gap-2.5 items-start mb-[30px]">
                  <input type="checkbox" required className="mt-1 accent-forest" />
                  <p className="text-[11px] text-gray-500 leading-[1.5]">
                    J'ai lu et j'accepte les <Link to="/cgu" className="text-forest font-semibold hover:underline" target="_blank">conditions générales d'utilisation</Link>, notamment la mention relative à la protection des données personnelles.
                  </p>
                </div>

                <button type="submit" className="w-full bg-forest text-white border-none p-3.5 rounded-lg font-bold text-[15px] cursor-pointer hover:bg-black transition-colors shadow-lg shadow-green-100">
                  S'inscrire
                </button>
              </form>
            </div>

            {/* Illustration Side */}
            <div className="flex-[0.8] bg-[#F8FAFC] p-10 md:p-[60px] flex flex-col items-center justify-center md:border-l border-t md:border-t-0 border-gray-200">
              <div className="w-full max-w-[300px] mb-10">
                <img src="https://img.freepik.com/free-vector/modern-city-concept-illustration_114360-3162.jpg" alt="Client Signup" className="w-full h-auto opacity-80" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full max-w-[1200px] animate-fadeIn">
            {subStep === 'initial' && (
              <div className="bg-white w-full max-w-[1000px] rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100 flex overflow-hidden min-h-[550px] animate-fadeIn mx-auto">
                {/* Step 2 Content */}
                <div className="flex-1 p-12 flex flex-col justify-center text-center">
                  <h1 className="text-[32px] font-black text-navy mb-4">Parlez-nous de vous</h1>
                  <p className="text-gray-500 mb-12">Ces informations nous aideront à personnaliser votre expérience.</p>
                  
                  <div className="space-y-6 max-w-[400px] mx-auto w-full">
                    <div className="text-left">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Êtes-vous une entreprise ?</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setHasCompany(true)}
                          className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border-2 ${hasCompany === true ? 'bg-forest text-white border-forest shadow-lg shadow-green-100' : 'bg-white text-gray-500 border-gray-100 hover:border-green-200'}`}
                        >
                          Oui
                        </button>
                        <button 
                          onClick={() => setHasCompany(false)}
                          className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border-2 ${hasCompany === false ? 'bg-forest text-white border-forest shadow-lg shadow-green-100' : 'bg-white text-gray-500 border-gray-100 hover:border-green-200'}`}
                        >
                          Non
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleNextStep}
                      disabled={hasCompany === null}
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg mt-8 ${hasCompany !== null ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-[300px] bg-gray-200 my-auto"></div>

                {/* Illustration Side */}
                <div className="flex-1 flex justify-center items-center bg-gray-50/50">
                  <div className="w-full max-w-[300px]">
                    <img 
                      src="https://img.freepik.com/free-vector/personal-settings-concept-illustration_114360-2947.jpg" 
                      alt="Preferences Illustration" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            )}

            {subStep === 'company' && (
              <div className="bg-white w-full max-w-[1000px] rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100 flex overflow-hidden min-h-[550px] animate-fadeIn mx-auto">
                {/* Company Info Content */}
                <div className="flex-1 p-12 flex flex-col justify-center">
                  <h1 className="text-[28px] font-black text-navy mb-8">Informations entreprise</h1>
                  
                  <form onSubmit={handleNextStep} className="space-y-6 max-w-[400px]">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nom de l'entreprise</label>
                      <input 
                        type="text" 
                        required
                        value={companyInfo.name}
                        onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                        placeholder="Ex: InvestAqary Immo"
                        className="w-full py-3.5 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ville</label>
                      <input 
                        type="text" 
                        required
                        value={companyInfo.city}
                        onChange={(e) => setCompanyInfo({...companyInfo, city: e.target.value})}
                        placeholder="Ex: Casablanca"
                        className="w-full py-3.5 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setSubStep('initial')}
                        className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-300 transition-all"
                      >
                        Précédent
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-800 transition-all shadow-lg"
                      >
                        Suivant
                      </button>
                    </div>
                  </form>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-[300px] bg-gray-200 my-auto"></div>

                {/* Illustration Side */}
                <div className="flex-1 flex justify-center items-center bg-gray-50/50">
                  <div className="w-full max-w-[300px]">
                    <img 
                      src="https://img.freepik.com/free-vector/city-buildings-concept-illustration_114360-4560.jpg" 
                      alt="Entreprise Illustration" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            )}

            {subStep === 'prestation' && (
              <div className="text-center py-12 flex flex-col items-center animate-fadeIn">
                <h1 className="text-[28px] font-bold text-[#1E293B] mb-12">Quel type de prestation cherchez-vous ?</h1>
                
                <div className="flex gap-8 justify-center mb-12">
                  {/* Choice Services */}
                  <div 
                    onClick={() => setPrestationType('services')}
                    className={`w-64 h-48 bg-white border-2 rounded-[20px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group ${
                      prestationType === 'services' ? 'border-forest shadow-xl shadow-green-50' : 'border-gray-100 hover:border-green-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                      prestationType === 'services' ? 'bg-forest text-white' : 'bg-green-50 text-forest group-hover:bg-forest group-hover:text-white'
                    }`}>
                      <i className="ti ti-tools"></i>
                    </div>
                    <span className={`font-bold ${prestationType === 'services' ? 'text-[#1E293B]' : 'text-gray-500'}`}>Services</span>
                  </div>

                  {/* Choice Matière */}
                  <div 
                    onClick={() => setPrestationType('matiere')}
                    className={`w-64 h-48 bg-white border-2 rounded-[20px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group ${
                      prestationType === 'matiere' ? 'border-forest shadow-xl shadow-green-50' : 'border-gray-100 hover:border-green-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                      prestationType === 'matiere' ? 'bg-forest text-white' : 'bg-green-50 text-forest group-hover:bg-forest group-hover:text-white'
                    }`}>
                      <i className="ti ti-building-warehouse"></i>
                    </div>
                    <span className={`font-bold ${prestationType === 'matiere' ? 'text-[#1E293B]' : 'text-gray-500'}`}>Matière première</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full max-w-[300px]">
                  <button 
                    onClick={() => setSubStep(hasCompany ? 'company' : 'initial')}
                    className="flex-1 bg-[#94A3B8] text-white py-3.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-slate-500 transition-all shadow-md"
                  >
                    Précédent
                  </button>
                  <button 
                    onClick={handleNextStep}
                    disabled={!prestationType}
                    className={`flex-1 py-3.5 rounded-lg font-bold text-sm cursor-pointer transition-all shadow-md ${
                      prestationType ? 'bg-forest text-white hover:bg-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {subStep === 'serviceCategories' && (
              <div className="bg-white w-full max-w-[1000px] rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100 flex overflow-hidden min-h-[550px] animate-fadeIn mx-auto">
                <div className="flex-1 p-12 flex flex-col">
                  <h1 className="text-[28px] font-black text-navy mb-2">Quels services ?</h1>
                  <p className="text-gray-400 text-sm mb-8">Sélectionnez les domaines qui vous intéressent.</p>
                  
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-[350px] mb-8">
                    {serviceCategories.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => toggleCategory(cat.name)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${selectedCategories.includes(cat.name) ? 'border-forest bg-green-50 text-forest' : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedCategories.includes(cat.name) ? 'bg-forest border-forest text-white' : 'bg-white border-gray-300'}`}>
                          {selectedCategories.includes(cat.name) && <i className="ti ti-check text-[10px]"></i>}
                        </div>
                        <span className="text-xs font-bold">{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleNextStep}
                    disabled={selectedCategories.length === 0 || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg mt-auto ${selectedCategories.length > 0 ? 'bg-forest text-white hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? 'Création...' : `Suivant (${selectedCategories.length} sélectionnés)`}
                  </button>
                </div>

                <div className="flex-1 bg-gray-50/50 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl text-forest mb-6">
                    <i className="ti ti-list-check"></i>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">Personnalisation</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[250px]">Nous vous proposerons les meilleurs prestataires selon vos choix.</p>
                </div>
              </div>
            )}

            {subStep === 'matiereCategories' && (
              <div className="bg-white w-full max-w-[1000px] rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100 flex overflow-hidden min-h-[550px] animate-fadeIn mx-auto">
                <div className="flex-1 p-12 flex flex-col">
                  <h1 className="text-[28px] font-black text-navy mb-2">Quelles matières ?</h1>
                  <p className="text-gray-400 text-sm mb-8">Sélectionnez les types de produits recherchés.</p>
                  
                  <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar max-h-[350px] mb-8">
                    {matiereCategories.map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => toggleMatiereCategory(cat.name)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${selectedMatiereCategories.includes(cat.name) ? 'border-forest bg-green-50 text-forest' : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedMatiereCategories.includes(cat.name) ? 'bg-forest border-forest text-white' : 'bg-white border-gray-300'}`}>
                          {selectedMatiereCategories.includes(cat.name) && <i className="ti ti-check text-[10px]"></i>}
                        </div>
                        <span className="text-xs font-bold">{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleNextStep}
                    disabled={selectedMatiereCategories.length === 0 || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg mt-auto ${selectedMatiereCategories.length > 0 ? 'bg-forest text-white hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? 'Création...' : `Suivant (${selectedMatiereCategories.length} sélectionnés)`}
                  </button>
                </div>

                <div className="flex-1 bg-gray-50/50 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl text-forest mb-6">
                    <i className="ti ti-package"></i>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">Catalogue sur mesure</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-[250px]">Accédez directement aux fournisseurs qui comptent pour vous.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    )}
      </div>

      <Footer />
    </div>
  );
}

