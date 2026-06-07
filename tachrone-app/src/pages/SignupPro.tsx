import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../data/apiService';

export default function SignupPro() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [proType, setProType] = useState<'entreprise' | 'maalem' | null>(null);
  const [isAutoEntrepreneur, setIsAutoEntrepreneur] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // File Upload Refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const [showActivities, setShowActivities] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const activityOptions = ['Prestataire de service', 'Fournisseur de matière', 'Location de matériel'];
  const categoryOptions = [
    'Aménagement terrasse / Véranda',
    'Ameublement',
    'Architecte',
    'Architecte d\'intérieur',
    'Bureau d\'étude',
    'Bureau de contrôle',
    'Climatisation',
    'Cuisine',
    'Domotique',
    'Électricité',
    'Étanchéité',
    'Menuiserie Aluminium',
    'Peinture',
    'Plomberie',
    'Piscine',
    'Sols et Carrelage'
  ];

  const toggleActivity = (activity: string) => {
    setProfile(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const toggleCategory = (category: string) => {
    setProfile(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  // Profile state
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    city: '',
    specialty: '',
    experience: '',
    description: '',
    ice: '',
    address: '',
    activities: ['Prestataire de service'] as string[],
    categories: [] as string[]
  });

  // Social state
  const [socials, setSocials] = useState({
    whatsapp: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    website: ''
  });

  // Images state (for preview)
  const [images, setImages] = useState({
    profile: null as string | null,
    banner: null as string | null,
    portfolio: [] as string[]
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner' | 'portfolio') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'portfolio') {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => ({ ...prev, portfolio: [...prev.portfolio, ...newImages] }));
    } else {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImages(prev => ({ ...prev, [type]: imageUrl }));
      if (type === 'profile') {
        setProfileFile(file);
      } else if (type === 'banner') {
        setBannerFile(file);
      }
    }
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('password_confirmation', formData.password_confirmation);
      data.append('company_name', profile.fullName);
      data.append('category', profile.categories[0] || 'other');
      if (proType) data.append('type', proType);
      if (profile.phone) data.append('phone', profile.phone);
      if (profile.city) data.append('city', profile.city);
      if (profile.description) data.append('description', profile.description);
      if (profile.experience) data.append('experience', profile.experience);
      if (profile.ice) data.append('ice', profile.ice);
      
      if (profileFile) {
        data.append('profile_photo', profileFile);
      }
      if (bannerFile) {
        data.append('banner_photo', bannerFile);
      }

      const res = await apiService.post('/register/pro', data);
      if (res.success) {
        alert("Inscription réussie ! Votre compte a été créé et est en attente d'approbation par l'administrateur. Vous allez être redirigé vers l'accueil.");
        navigate('/');
      }
    } catch (error: any) {
      let msg = error.message || "Erreur lors de l'inscription";
      if (msg === 'validation.confirmed') {
        msg = "La confirmation du mot de passe ne correspond pas. Veuillez saisir le même mot de passe dans les deux champs.";
      } else if (msg.includes('validation.unique') || msg.includes('has already been taken')) {
        msg = "Cet e-mail est déjà utilisé. Veuillez utiliser une autre adresse e-mail.";
      } else if (msg.includes('validation.min') || msg.includes('must be at least 8')) {
        msg = "Le mot de passe doit contenir au moins 8 caractères.";
      }
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      if (proType === 'maalem' && isAutoEntrepreneur !== null) {
        setIsAutoEntrepreneur(null);
      } else if (proType !== null) {
        setProType(null);
        setIsAutoEntrepreneur(null);
      } else {
        setCurrentStep(prev => prev - 1);
      }
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-poppins">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-2xl font-extrabold text-[#1E293B] no-underline flex items-baseline gap-1">
          InvestAqary <span className="text-sm text-gray-400 font-medium">Pro</span>
        </Link>

        {/* Step Indicator */}
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
          
          {/* Step 2 */}
          <div className={`flex items-center gap-2 ${currentStep < 2 ? 'opacity-30' : ''}`}>
            {currentStep > 2 ? (
              <div className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-[10px]">
                <i className="ti ti-check"></i>
              </div>
            ) : (
              <div className={`w-6 h-6 rounded-full ${currentStep === 2 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-600'} text-[10px] font-bold flex items-center justify-center`}>2</div>
            )}
            <span className={`text-xs font-bold ${currentStep >= 2 ? 'text-forest' : 'text-gray-600'}`}>Profil</span>
          </div>

          {/* Step 3 */}
          <div className={`flex items-center gap-2 ${currentStep < 3 ? 'opacity-30' : ''}`}>
            <div className={`w-6 h-6 rounded-full ${currentStep === 3 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-600'} text-[10px] font-bold flex items-center justify-center`}>3</div>
            <span className={`text-xs font-bold ${currentStep >= 3 ? 'text-forest' : 'text-gray-600'}`}>Réseaux sociaux</span>
          </div>

          {/* Step 4 */}
          <div className={`flex items-center gap-2 ${currentStep < 4 ? 'opacity-30' : ''}`}>
            <div className={`w-6 h-6 rounded-full ${currentStep === 4 ? 'bg-forest text-white' : 'bg-gray-200 text-gray-600'} text-[10px] font-bold flex items-center justify-center`}>4</div>
            <span className={`text-xs font-bold ${currentStep >= 4 ? 'text-forest' : 'text-gray-600'}`}>Photos</span>
          </div>
        </div>

        <Link to="/" className="text-sm font-bold text-[#1E293B] no-underline hover:text-forest transition-colors">Quitter</Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Previous Button for Step 2+ */}
        {currentStep > 1 && (
          <button 
            onClick={handlePrevStep}
            className="absolute left-10 top-[40%] -translate-y-1/2 flex items-center gap-2 bg-[#FFD400] hover:bg-[#FFC000] text-[#1E293B] px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm z-50"
          >
            <i className="ti ti-chevron-left"></i> Précédent
          </button>
        )}

        {currentStep === 1 && (
          <div className="bg-white w-full max-w-[1200px] rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100 flex overflow-hidden min-h-[650px] animate-fadeIn">
            {/* Step 1 Content */}
            <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
              <h2 className="text-lg font-bold text-[#1E293B] leading-relaxed mb-10 max-w-[500px]">
                Vous vendez des services ou des matières dans le BTP, InvestAqary Pro est l'outil qui vous accompagnera dans le développement de votre activité
              </h2>

              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="relative">
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-2">E-mail*</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full py-3.5 px-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-forest transition-all"
                    />
                    <i className="ti ti-mail absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg"></i>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Mot de passe*</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full py-3.5 pr-12 pl-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-forest transition-all"
                    />
                    <i 
                      className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'} absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg cursor-pointer hover:text-navy transition-colors`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Confirmer votre mot de passe*</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                      className="w-full py-3.5 pr-12 pl-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-forest transition-all"
                    />
                    <i 
                      className={`ti ${showConfirmPassword ? 'ti-eye-off' : 'ti-eye'} absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg cursor-pointer hover:text-navy transition-colors`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Conformément à la loi n° 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Ce traitement a été autorisé par la CNDP sous le numéro D-W-532/2014.
                </p>

                <div className="flex gap-3 items-start">
                  <input type="checkbox" required className="mt-1 accent-forest" />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    J'ai lu et j'accepte les <Link to="/cgu" className="text-forest font-bold hover:underline" target="_blank">Conditions Générales d'Utilisation</Link>, notamment la mention relative à la protection des données personnelles.
                  </p>
                </div>

                <button type="submit" className="w-full bg-forest text-white border-none py-4 rounded-xl font-bold text-[15px] cursor-pointer hover:bg-forest/90 transition-all shadow-lg shadow-green-100">
                  Inscrivez-vous
                </button>
              </form>
            </div>

            <div className="w-[1px] bg-gray-100 my-16"></div>

            <div className="flex-1 bg-[#F8FAFC]/50 p-12 md:p-16 flex flex-col items-center justify-center">
              <div className="w-full max-w-[380px] mb-12 relative">
                <div className="relative z-10">
                  <img 
                    src="https://img.freepik.com/free-vector/professional-engineers-work-construction-site-illustration_33099-2426.jpg?t=st=1716474000~exp=1716477600~hmac=5c8e3c8c..." 
                    alt="Construction Illustration" 
                    className="w-full h-auto rounded-3xl opacity-90"
                  />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full max-w-[1200px] flex gap-12 items-start animate-fadeIn">
            {/* Step 2 Content */}
            <div className="flex-1">
              {!proType ? (
                <div className="text-center py-12">
                  <h1 className="text-[28px] font-bold text-[#1E293B] mb-3">Est ce que vous êtes?</h1>
                  <p className="text-gray-400 text-sm mb-12 font-medium">Cela nous aide à personnaliser votre expérience</p>

                  <div className="flex gap-6 justify-center">
                    {/* Choice Entreprise */}
                    <div 
                      onClick={() => setProType('entreprise')}
                      className="w-52 h-44 bg-white border-2 border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-forest hover:shadow-xl hover:shadow-green-100 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-all">
                        <i className="ti ti-building-community text-3xl"></i>
                      </div>
                      <span className="font-bold text-[#1E293B]">Entreprise</span>
                    </div>

                    {/* Choice Maalem */}
                    <div 
                      onClick={() => setProType('maalem')}
                      className="w-52 h-44 bg-white border-2 border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-forest hover:shadow-xl hover:shadow-green-100 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-all">
                        <i className="ti ti-tools text-3xl"></i>
                      </div>
                      <span className="font-bold text-[#1E293B]">Maalem</span>
                    </div>
                  </div>
                </div>
              ) : proType === 'entreprise' ? (
                <div className="bg-transparent">
                  <h2 className="text-lg font-bold text-[#1E293B] mb-8">Commencez par créer votre profil</h2>

                  <form onSubmit={handleNextStep} className="space-y-5 max-w-[650px]">
                    {/* Nom de l'entreprise */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase">Nom de l'entreprise*</label>
                        <span className="text-[10px] text-gray-400">{profile.fullName.length}/50</span>
                      </div>
                      <input 
                        type="text" 
                        required
                        maxLength={50}
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        placeholder="Entrez le nom de votre entreprise"
                        className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {/* ICE */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase">ICE*</label>
                        <span className="text-[10px] text-gray-400">{profile.ice.length}/15</span>
                      </div>
                      <input 
                        type="text" 
                        required
                        maxLength={15}
                        value={profile.ice}
                        onChange={(e) => setProfile({...profile, ice: e.target.value})}
                        placeholder="Entrez votre ICE"
                        className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {/* Adresse */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase">Adresse*</label>
                        <span className="text-[10px] text-gray-400">{profile.address.length}/100</span>
                      </div>
                      <input 
                        type="text" 
                        required
                        maxLength={100}
                        value={profile.address}
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                        placeholder="Entrez votre adresse"
                        className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {/* Ville */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Ville*</label>
                      <div className="relative">
                        <select 
                          required
                          value={profile.city}
                          onChange={(e) => setProfile({...profile, city: e.target.value})}
                          className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all appearance-none"
                        >
                          <option value="">Sélectionnez votre ville</option>
                          <option value="Casablanca">Casablanca</option>
                          <option value="Rabat">Rabat</option>
                          <option value="Marrakech">Marrakech</option>
                        </select>
                        <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Numéro de téléphone*</label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 border border-gray-200 rounded-lg bg-white">
                          <img src="https://flagcdn.com/w20/ma.png" alt="MA" className="w-5" />
                          <span className="text-sm text-gray-500">+212</span>
                        </div>
                        <div className="relative flex-1">
                          <input 
                            type="tel" 
                            required
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all"
                          />
                          <i className="ti ti-phone absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                        </div>
                      </div>
                    </div>

                    {/* Activités */}
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Sélectionnez une ou plusieurs activités*</label>
                      <div 
                        onClick={() => setShowActivities(!showActivities)}
                        className="min-h-[42px] w-full p-2 bg-white border border-gray-200 rounded-lg flex flex-wrap gap-2 items-center relative cursor-pointer hover:border-forest transition-all"
                      >
                        {profile.activities.length > 0 ? (
                          profile.activities.map(act => (
                            <span key={act} className="bg-green-50 text-forest text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-green-100 animate-fadeIn">
                              {act} 
                              <i 
                                className="ti ti-x cursor-pointer hover:text-red-500" 
                                onClick={(e) => { e.stopPropagation(); toggleActivity(act); }}
                              ></i>
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-300 text-sm pl-2">Choisir vos activités</span>
                        )}
                        <i className={`ti ti-chevron-${showActivities ? 'up' : 'down'} absolute right-4 text-gray-400`}></i>
                      </div>

                      {/* Activities Dropdown */}
                      {showActivities && (
                        <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden animate-fadeIn">
                          {activityOptions.map(option => (
                            <div 
                              key={option}
                              onClick={() => toggleActivity(option)}
                              className="px-4 py-2.5 text-sm hover:bg-green-50 cursor-pointer flex items-center justify-between group transition-colors"
                            >
                              <span className={profile.activities.includes(option) ? 'text-forest font-bold' : 'text-[#1E293B]'}>{option}</span>
                              {profile.activities.includes(option) && <i className="ti ti-check text-forest"></i>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Catégories */}
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Catégorie(s) d'activité services*</label>
                      <div 
                        onClick={() => setShowCategories(!showCategories)}
                        className={`min-h-[42px] w-full p-2 bg-white border ${showCategories ? 'border-forest' : 'border-gray-200'} rounded-lg flex flex-wrap gap-2 items-center relative cursor-pointer transition-all shadow-sm hover:border-forest`}
                      >
                        {profile.categories.length > 0 ? (
                          profile.categories.map(cat => (
                            <span key={cat} className="bg-green-50 text-forest text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-green-100 animate-fadeIn">
                              {cat} 
                              <i 
                                className="ti ti-x cursor-pointer hover:text-red-500" 
                                onClick={(e) => { e.stopPropagation(); toggleCategory(cat); }}
                              ></i>
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm pl-2 font-medium">Sélectionnez vos catégories de services</span>
                        )}
                        <i className={`ti ti-chevron-${showCategories ? 'up' : 'down'} absolute right-4 text-gray-400`}></i>
                      </div>

                      {/* Categories Dropdown */}
                      {showCategories && (
                        <div className="absolute z-[60] w-full mt-1 bg-white border border-forest shadow-2xl rounded-lg max-h-[250px] overflow-y-auto animate-fadeIn custom-scrollbar">
                          {categoryOptions.map(option => (
                            <div 
                              key={option}
                              onClick={() => toggleCategory(option)}
                              className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                                profile.categories.includes(option) 
                                ? 'bg-forest text-white font-bold' 
                                : 'text-[#1E293B] hover:bg-green-50'
                              }`}
                            >
                              <span>{option}</span>
                              {profile.categories.includes(option) && <i className="ti ti-check"></i>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expérience */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Années d'expérience*</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          required
                          value={profile.experience}
                          onChange={(e) => setProfile({...profile, experience: e.target.value})}
                          placeholder="Entrez vos années d'expérience"
                          className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all placeholder:text-gray-300"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                          <button type="button" className="p-0.5 bg-forest text-white rounded-sm text-[8px] leading-none"><i className="ti ti-chevron-up"></i></button>
                          <button type="button" className="p-0.5 bg-forest text-white rounded-sm text-[8px] leading-none"><i className="ti ti-chevron-down"></i></button>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase">Description de votre entreprise* <span className="text-[9px] lowercase font-normal">(85 caractères minimum)</span></label>
                        <span className="text-[10px] text-gray-400">{profile.description.length}/1500</span>
                      </div>
                      <textarea 
                        required
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        placeholder="Décrivez votre entreprise..."
                        className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-forest transition-all h-28 resize-none placeholder:text-gray-300"
                      ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setProType(null)}
                        className="flex-1 bg-gray-400 text-white py-3.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-gray-500 transition-all shadow-md"
                      >
                        Précédent
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 bg-forest text-white py-3.5 rounded-lg font-bold text-sm cursor-pointer hover:bg-forest/90 transition-all shadow-md"
                      >
                        Suivant
                      </button>
                    </div>
                  </form>
                </div>
              ) : proType === 'maalem' && isAutoEntrepreneur === null ? (
                <div className="text-center py-12 flex flex-col items-center animate-fadeIn">
                  <h1 className="text-2xl font-bold text-[#1E293B] mb-12">Avez-vous un statut auto-entrepreneur?</h1>
                  
                  <div className="w-full max-w-[400px] mb-12">
                    <img 
                      src="https://img.freepik.com/free-vector/professional-engineers-work-construction-site-illustration_33099-2426.jpg" 
                      alt="Statut Illustration" 
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="flex gap-4 w-full max-w-[400px]">
                    <button 
                      onClick={() => setIsAutoEntrepreneur(false)}
                      className="flex-1 bg-slate-400 text-white py-4 rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-500 transition-all shadow-lg shadow-slate-100"
                    >
                      Non
                    </button>
                    <button 
                      onClick={() => setIsAutoEntrepreneur(true)}
                      className="flex-1 bg-forest text-white py-4 rounded-xl font-bold text-sm cursor-pointer hover:bg-forest/90 transition-all shadow-lg shadow-green-100"
                    >
                      Oui
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-10 rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-[#1E293B]">
                      {proType === 'maalem' ? 'Profil Maalem' : 'Profil Entreprise'}
                    </h2>
                    <button 
                      onClick={() => {
                        if (proType === 'maalem') setIsAutoEntrepreneur(null);
                        else setProType(null);
                      }}
                      className="text-xs font-bold text-gray-400 hover:text-forest flex items-center gap-1 transition-colors"
                    >
                      <i className="ti ti-arrow-back-up"></i> Retour
                    </button>
                  </div>

                  <form onSubmit={handleNextStep} className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Nom complet ou Nom de l'entreprise*</label>
                      <input 
                        type="text" 
                        required
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        placeholder="Ex: Azizi Yassine ou SARL Batiment"
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Téléphone*</label>
                      <input 
                        type="tel" 
                        required
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        placeholder="+212 6..."
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Ville*</label>
                      <select 
                        required
                        value={profile.city}
                        onChange={(e) => setProfile({...profile, city: e.target.value})}
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Sélectionner une ville</option>
                        <option value="Casablanca">Casablanca</option>
                        <option value="Rabat">Rabat</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Tanger">Tanger</option>
                        <option value="Mohammadia">Mohammadia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Spécialité principale*</label>
                      <select 
                        required
                        value={profile.specialty}
                        onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Sélectionner une spécialité</option>
                        <option value="Menuiserie Aluminium">Menuiserie Aluminium</option>
                        <option value="Plomberie">Plomberie</option>
                        <option value="Électricité">Électricité</option>
                        <option value="Peinture">Peinture</option>
                        <option value="Maçonnerie">Maçonnerie</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Expérience*</label>
                      <select 
                        required
                        value={profile.experience}
                        onChange={(e) => setProfile({...profile, experience: e.target.value})}
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Années d'expérience</option>
                        <option value="Moins de 2 ans">Moins de 2 ans</option>
                        <option value="2 - 5 ans">2 - 5 ans</option>
                        <option value="5 - 10 ans">5 - 10 ans</option>
                        <option value="Plus de 10 ans">Plus de 10 ans</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Description (Bio)</label>
                      <textarea 
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        placeholder="Parlez-nous de votre savoir-faire..."
                        className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all h-24 resize-none"
                      ></textarea>
                    </div>

                    <div className="col-span-2 pt-4">
                      <button type="submit" className="w-full bg-forest text-white py-4 rounded-xl font-bold text-sm cursor-pointer hover:bg-forest/90 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                        Continuer vers l'étape 3 <i className="ti ti-arrow-right"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Preview Mockup */}
            <div className="flex-1 hidden lg:block sticky top-32">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 transform scale-90 origin-right">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="w-16 h-4 bg-slate-50 rounded-full"></div>
                  <div className="w-6 h-6 rounded bg-forest flex items-center justify-center text-white text-[10px] font-bold">T</div>
                </div>

                <div className="space-y-6">
                  {/* Banner Preview */}
                  <div className="h-32 bg-slate-50 rounded-xl relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="" />
                    <div className="absolute left-6 -bottom-6 w-20 h-20 bg-forest rounded-xl shadow-lg flex items-center justify-center text-white text-3xl">
                      <i className={`ti ${proType === 'entreprise' ? 'ti-building-community' : 'ti-user'}`}></i>
                    </div>
                  </div>

                  {/* Info Preview */}
                  <div className="pl-32 space-y-2">
                    <div className="h-4 min-w-[160px] max-w-full">
                      {profile.fullName ? (
                        <span className="text-sm font-bold text-[#1E293B]">{profile.fullName}</span>
                      ) : (
                        <div className="h-4 w-40 bg-slate-100 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ti ti-map-pin text-forest text-xs"></i>
                      {profile.city ? (
                        <span className="text-[10px] text-gray-500">{profile.city}</span>
                      ) : (
                        <div className="h-3 w-24 bg-slate-50 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Tags Preview */}
                  <div className="flex gap-2">
                    {profile.specialty ? (
                      <span className="px-3 py-1 bg-green-50 border border-green-200 text-forest text-[10px] font-bold rounded-full">
                        {profile.specialty}
                      </span>
                    ) : (
                      <div className="h-6 w-20 bg-slate-50 rounded-full"></div>
                    )}
                    {profile.experience && (
                      <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold rounded-full">
                        {profile.experience}
                      </span>
                    )}
                  </div>

                  {/* Tabs Skeleton */}
                  <div className="flex gap-2 border-b border-gray-50 pb-1 overflow-hidden">
                    {['Projets', 'A propos', 'villes d\'activité', 'Avis', 'Vidéo', 'Notre équipe', 'Nos services'].map((tab, idx) => (
                      <div key={tab} className="flex flex-col items-center gap-1">
                        <span className="text-[6px] font-bold text-gray-300 whitespace-nowrap">{tab}</span>
                        {idx === 0 && <div className="h-0.5 w-full bg-forest"></div>}
                      </div>
                    ))}
                  </div>

                  {/* Grid Skeleton */}
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-square bg-slate-50 rounded-lg"></div>
                    ))}
                  </div>

                  {/* Description Preview */}
                  <div className="space-y-2 pt-4 border-t border-gray-50">
                    {profile.description ? (
                      <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-3">
                        {profile.description}
                      </p>
                    ) : (
                      <>
                        <div className="h-2.5 w-full bg-slate-50 rounded-full"></div>
                        <div className="h-2.5 w-3/4 bg-slate-50 rounded-full"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full max-w-[1200px] flex gap-12 items-start animate-fadeIn">
            <div className="flex-1">
              <div className="bg-white p-10 rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100">
                <h2 className="text-xl font-bold text-[#1E293B] mb-2">Réseaux sociaux</h2>
                <p className="text-gray-400 text-sm mb-8">Ajoutez vos liens pour que les clients puissent vous trouver facilement</p>

                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Numéro WhatsApp*</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        required
                        value={socials.whatsapp}
                        onChange={(e) => setSocials({...socials, whatsapp: e.target.value})}
                        placeholder="+212 6..."
                        className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                      <i className="ti ti-brand-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-green-500 text-xl"></i>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Lien Facebook</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        value={socials.facebook}
                        onChange={(e) => setSocials({...socials, facebook: e.target.value})}
                        placeholder="facebook.com/votre-page"
                        className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                      <i className="ti ti-brand-facebook absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl"></i>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Lien Instagram</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        value={socials.instagram}
                        onChange={(e) => setSocials({...socials, instagram: e.target.value})}
                        placeholder="instagram.com/votre-compte"
                        className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                      <i className="ti ti-brand-instagram absolute left-4 top-1/2 -translate-y-1/2 text-pink-600 text-xl"></i>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Lien LinkedIn</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        value={socials.linkedin}
                        onChange={(e) => setSocials({...socials, linkedin: e.target.value})}
                        placeholder="linkedin.com/in/votre-profil"
                        className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                      <i className="ti ti-brand-linkedin absolute left-4 top-1/2 -translate-y-1/2 text-[#0077B5] text-xl"></i>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Site Web / Portfolio</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        value={socials.website}
                        onChange={(e) => setSocials({...socials, website: e.target.value})}
                        placeholder="www.votre-site.ma"
                        className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-forest focus:bg-white transition-all"
                      />
                      <i className="ti ti-world absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="w-full bg-forest text-white py-4 rounded-xl font-bold text-sm cursor-pointer hover:bg-forest/90 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                      Continuer vers l'étape 4 <i className="ti ti-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Preview Mockup */}
            <div className="flex-1 hidden lg:block sticky top-32">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 transform scale-90 origin-right">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="w-16 h-4 bg-slate-50 rounded-full"></div>
                  <div className="w-6 h-6 rounded bg-forest flex items-center justify-center text-white text-[10px] font-bold">T</div>
                </div>

                <div className="space-y-6">
                  {/* Banner Preview */}
                  <div className="h-32 bg-slate-50 rounded-xl relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="" />
                    <div className="absolute left-6 -bottom-6 w-20 h-20 bg-forest rounded-xl shadow-lg flex items-center justify-center text-white text-3xl">
                      <i className={`ti ${proType === 'entreprise' ? 'ti-building-community' : 'ti-user'}`}></i>
                    </div>
                  </div>

                  {/* Info Preview */}
                  <div className="pl-32 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1E293B]">{profile.fullName || 'Votre Nom'}</span>
                      <div className="flex gap-2">
                        {socials.facebook && <i className="ti ti-brand-facebook text-blue-600"></i>}
                        {socials.instagram && <i className="ti ti-brand-instagram text-pink-600"></i>}
                        {socials.whatsapp && <i className="ti ti-brand-whatsapp text-green-500"></i>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ti ti-map-pin text-forest text-xs"></i>
                      <span className="text-[10px] text-gray-500">{profile.city || 'Votre Ville'}</span>
                    </div>
                  </div>

                  {/* Action Buttons Preview */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="h-8 bg-forest rounded-lg flex items-center justify-center text-white text-[10px] font-bold gap-2">
                      <i className="ti ti-phone"></i> Appeler
                    </div>
                    <div className="h-8 border border-gray-200 rounded-lg flex items-center justify-center text-[#1E293B] text-[10px] font-bold gap-2">
                      <i className="ti ti-message"></i> Message
                    </div>
                  </div>

                  {/* Tabs Skeleton */}
                  <div className="flex gap-4 border-b border-gray-50 pb-2">
                    <div className="h-1 w-12 bg-slate-100 rounded-full"></div>
                    <div className="h-1 w-12 bg-forest"></div>
                    <div className="h-1 w-12 bg-slate-100 rounded-full"></div>
                  </div>

                  {/* Grid Skeleton */}
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-square bg-slate-50 rounded-lg"></div>
                    ))}
                  </div>

                  {/* Social Detail Preview */}
                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1E293B]">WhatsApp</span>
                      <span className="text-[10px] text-gray-400">{socials.whatsapp || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1E293B]">LinkedIn</span>
                      <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{socials.linkedin || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1E293B]">Site Web</span>
                      <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{socials.website || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="w-full max-w-[1200px] flex gap-12 items-start animate-fadeIn">
            <div className="flex-1">
              <div className="bg-white p-10 rounded-[30px] border border-gray-100 shadow-xl shadow-slate-100">
                <h2 className="text-xl font-bold text-[#1E293B] mb-2">Photos & Portfolio</h2>
                <p className="text-gray-400 text-sm mb-8">Les profils avec des photos reçoivent 5x plus de demandes</p>

                <div className="space-y-8">
                  {/* Profile & Banner */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Photo de profil</label>
                      <input 
                        type="file" 
                        ref={profileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profile')}
                      />
                      <div 
                        onClick={() => profileInputRef.current?.click()}
                        className="h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-forest hover:bg-green-50/30 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        {images.profile ? (
                          <>
                            <img src={images.profile} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                              Changer la photo
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-forest group-hover:text-white transition-all">
                              <i className="ti ti-camera text-2xl"></i>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">Ajouter une photo</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Photo de couverture</label>
                      <input 
                        type="file" 
                        ref={bannerInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'banner')}
                      />
                      <div 
                        onClick={() => bannerInputRef.current?.click()}
                        className="h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-forest hover:bg-green-50/30 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        {images.banner ? (
                          <>
                            <img src={images.banner} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                              Changer la bannière
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-forest group-hover:text-white transition-all">
                              <i className="ti ti-photo text-2xl"></i>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">Ajouter une bannière</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Portfolio (Vos réalisations)</label>
                    <input 
                      type="file" 
                      ref={portfolioInputRef} 
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, 'portfolio')}
                    />
                    <div className="grid grid-cols-4 gap-4">
                      <div 
                        onClick={() => portfolioInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-forest hover:text-forest cursor-pointer transition-all"
                      >
                        <i className="ti ti-plus text-2xl"></i>
                      </div>
                      {images.portfolio.map((img, i) => (
                        <div key={i} className="aspect-square bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setImages(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, idx) => idx !== i) }));
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <i className="ti ti-x text-[10px]"></i>
                          </button>
                        </div>
                      ))}
                      {/* Placeholders if less than 3 */}
                      {images.portfolio.length < 3 && Array.from({ length: 3 - images.portfolio.length }).map((_, i) => (
                        <div key={`placeholder-${i}`} className="aspect-square bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-100">
                          <i className="ti ti-photo text-xl"></i>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handleRegister}
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-sm cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2 ${
                        isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-forest text-white hover:bg-forest/90 shadow-green-100'
                      }`}
                    >
                      {isSubmitting ? 'Création en cours...' : 'Terminer mon inscription'} <i className="ti ti-check"></i>
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4">
                      Votre profil sera vérifié par notre équipe avant d'être publié.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Preview Mockup */}
            <div className="flex-1 hidden lg:block sticky top-32">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 transform scale-90 origin-right">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="w-16 h-4 bg-slate-50 rounded-full"></div>
                  <div className="w-6 h-6 rounded bg-forest flex items-center justify-center text-white text-[10px] font-bold">T</div>
                </div>

                <div className="space-y-6">
                  {/* Banner Preview */}
                  <div className="h-32 bg-slate-50 rounded-xl relative overflow-hidden border border-gray-100">
                    {images.banner ? (
                      <img src={images.banner} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                        <i className="ti ti-photo text-4xl"></i>
                      </div>
                    )}
                    <div className="absolute left-6 -bottom-6 w-20 h-20 bg-white border-4 border-white rounded-xl shadow-lg flex items-center justify-center text-slate-200 text-3xl overflow-hidden bg-slate-50">
                       {images.profile ? (
                         <img src={images.profile} alt="Profile Preview" className="w-full h-full object-cover" />
                       ) : (
                         <i className="ti ti-camera"></i>
                       )}
                    </div>
                  </div>

                  {/* Info Preview */}
                  <div className="pl-32 space-y-2">
                    <span className="text-sm font-bold text-[#1E293B]">{profile.fullName || 'Votre Nom'}</span>
                    <div className="flex items-center gap-2">
                      <i className="ti ti-map-pin text-forest text-xs"></i>
                      <span className="text-[10px] text-gray-500">{profile.city || 'Casablanca'}</span>
                    </div>
                  </div>

                  {/* Tabs Skeleton */}
                  <div className="flex gap-4 border-b border-gray-50 pb-2">
                    <div className="h-1 w-12 bg-forest"></div>
                    <div className="h-1 w-12 bg-slate-100 rounded-full"></div>
                    <div className="h-1 w-12 bg-slate-100 rounded-full"></div>
                  </div>

                  {/* Grid Preview */}
                  <div className="grid grid-cols-4 gap-3">
                    {images.portfolio.length > 0 ? (
                      images.portfolio.slice(0, 8).map((img, i) => (
                        <div key={i} className="aspect-square bg-slate-50 rounded-lg overflow-hidden border border-gray-50">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center text-slate-100">
                          <i className="ti ti-photo text-lg"></i>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="py-6 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-400 text-center px-8 leading-relaxed">
          En m'inscrivant, en me connectant ou en continuant, j'accepte les <Link to="/cgu" className="text-forest font-bold hover:underline" target="_blank">Conditions Générales d'Utilisation</Link>, ainsi que les <Link to="/cgu" className="text-forest font-bold hover:underline" target="_blank">Conditions Générales de Vente</Link>.
        </p>
      </footer>
    </div>
  );
}

const style = document.createElement('style');
style.innerHTML = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3D5A40;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2D4A30;
  }
`;
document.head.appendChild(style);
