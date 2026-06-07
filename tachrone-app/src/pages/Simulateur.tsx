import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiService } from '../data/apiService';
import { useAuth } from '../context/AuthContext';

export default function Simulateur() {
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Step 1: Terrain
  const [superficieTerrain, setSuperficieTerrain] = useState('');
  const [prixAchatTerrain, setPrixAchatTerrain] = useState('');

  // Step 2: Superficie
  const [etages, setEtages] = useState([
    { id: 1, nom: 'Sous-sol 1', superficie: '' },
    { id: 2, nom: 'RDC', superficie: '' },
    { id: 3, nom: 'Mezzanine', superficie: '' },
    { id: 4, nom: 'Étage 1', superficie: '' },
    { id: 5, nom: 'Étage 2', superficie: '' },
    { id: 6, nom: 'Étage 3', superficie: '' },
  ]);

  // Step 3: Coûts
  const [standing, setStanding] = useState('');
  const [coutConstruction, setCoutConstruction] = useState('');

  // Step 4: Prix de vente
  const [prixVenteAppart, setPrixVenteAppart] = useState('');
  const [prixVenteRDC, setPrixVenteRDC] = useState('');

  // Calculations
  const getSuperficie = (nom: string) => {
    const etage = etages.find(e => e.nom === nom);
    return etage ? parseFloat(etage.superficie) || 0 : 0;
  };

  const getEtagesSuperficie = () => {
    return etages
      .filter(e => e.nom.startsWith('Étage'))
      .reduce((sum, e) => sum + (parseFloat(e.superficie) || 0), 0);
  };

  const vendableAppart = getEtagesSuperficie() * 0.85;
  const vendableRDC = getSuperficie('RDC') * 0.85;
  const vendableSousSol = getSuperficie('Sous-sol 1') * 0.50;
  const vendableMezzanine = getSuperficie('Mezzanine') * 0.50;

  const totalSuperficieConstruite = etages.reduce((sum, e) => sum + (parseFloat(e.superficie) || 0), 0);

  const coutTerrain = (parseFloat(superficieTerrain) || 0) * (parseFloat(prixAchatTerrain) || 0);
  const coutConst = totalSuperficieConstruite * (parseFloat(coutConstruction) || 0);
  const totalCharges = coutTerrain + coutConst;

  const ventesAppart = vendableAppart * (parseFloat(prixVenteAppart) || 0);
  const pRDC = parseFloat(prixVenteRDC) || 0;
  // Assumes Mezzanine and Sous-sol are sold at RDC price if no specific field is given
  const ventesRDC = (vendableRDC + vendableSousSol + vendableMezzanine) * pRDC;
  const ventesTotales = ventesAppart + ventesRDC;

  const margeBrute = ventesTotales - totalCharges;
  const roi = totalCharges > 0 ? (margeBrute / totalCharges) * 100 : 0;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(num);
  };

  const handleStandingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStanding(val);
    if (val) {
      setCoutConstruction(val);
    } else {
      setCoutConstruction('');
    }
  };

  const updateEtage = (id: number, val: string) => {
    setEtages(etages.map(e => e.id === id ? { ...e, superficie: val } : e));
  };

  const deleteEtage = (id: number) => {
    setEtages(etages.filter(e => e.id !== id));
  };

  const addEtage = () => {
    const newId = Math.max(...etages.map(e => e.id), 0) + 1;
    const numEtages = etages.filter(e => e.nom.startsWith('Étage')).length;
    setEtages([...etages, { id: newId, nom: `Étage ${numEtages + 1}`, superficie: '' }]);
  };

  const isRentable = margeBrute > 0;

  const handleSaveSimulation = async () => {
    if (!isAuthenticated) {
      alert("Veuillez vous connecter pour enregistrer votre simulation.");
      return;
    }

    setIsSaving(true);
    try {
      await apiService.post('/simulations', {
        project_type: 'Construction',
        area: totalSuperficieConstruite,
        budget_min: totalCharges,
        budget_max: totalCharges, // or another logic for range
        raw_data: {
          terrain: { superficie: superficieTerrain, prix: prixAchatTerrain },
          etages: etages.filter(e => e.superficie !== ''),
          standing,
          vente: { appart: prixVenteAppart, rdc: prixVenteRDC },
          results: { roi, margeBrute, ventesTotales }
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save simulation:', error);
      alert("Erreur lors de l'enregistrement de la simulation.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-poppins text-navy pb-20 flex flex-col">
      <Header />
      <div className="max-w-[1400px] w-full mx-auto px-[60px] py-10 flex-1">
        <h1 className="text-[28px] font-extrabold text-navy mb-[30px]">Simulateur</h1>

        <div className="bg-white rounded-[16px] p-[30px] border border-gray-200 mb-[30px]">
          
          {/* STEPPER */}
          <div className="flex items-center justify-between mb-10 relative">
            {[
              { num: 1, icon: 'ti-map-pin', label: 'Achat terrain' },
              { num: 2, icon: 'ti-building', label: 'Superficie construite' },
              { num: 3, icon: 'ti-coin', label: 'Coûts' },
              { num: 4, icon: 'ti-tag', label: 'Prix de vente' },
              { num: 5, icon: 'ti-checkbox', label: 'Résultats' },
            ].map((step, idx, arr) => (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[10px] border-[1.5px] font-semibold text-[13px] z-10 bg-white ${
                  currentStep === step.num 
                    ? 'border-gold bg-[#F4F1EC] text-navy' 
                    : 'border-gray-200 text-slate'
                }`}>
                  <i className={`ti ${step.icon} text-lg ${currentStep === step.num ? 'text-[#1E293B]' : 'text-slate'}`}></i>
                  <span className="hidden md:inline">{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 h-[1px] border-t-2 border-dotted border-gray-200 mx-2.5"></div>
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: ACHAT TERRAIN */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-[30px]">
                <div>
                  <label className="block text-[12px] text-slate mb-2">Superficie de terrain (m²)</label>
                  <input 
                    type="number" 
                    value={superficieTerrain}
                    onChange={(e) => setSuperficieTerrain(e.target.value)}
                    placeholder="ex: 600" 
                    className="w-full py-[14px] px-[18px] border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-forest transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate mb-2">Prix achat terrain (DH/m²)</label>
                  <input 
                    type="number" 
                    value={prixAchatTerrain}
                    onChange={(e) => setPrixAchatTerrain(e.target.value)}
                    placeholder="ex: 5000" 
                    className="w-full py-[14px] px-[18px] border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-forest transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setCurrentStep(2)} className="bg-forest text-white border-none py-3 px-10 rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#2D4330] transition-colors">Suivant</button>
              </div>
            </div>
          )}

          {/* STEP 2: SUPERFICIE CONSTRUITE */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="overflow-x-auto mb-5">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left text-[12px] text-slate p-[10px_15px] font-medium w-[30%]">Niveau</th>
                      <th className="text-left text-[12px] text-slate p-[10px_15px] font-medium">Superficie construite (m²)</th>
                      <th className="w-[10%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {etages.map(etage => (
                      <tr key={etage.id}>
                        <td className="p-[8px_15px] border-b border-[#f0f0f0]">{etage.nom}</td>
                        <td className="p-[8px_15px] border-b border-[#f0f0f0]">
                          <input 
                            type="number" 
                            value={etage.superficie}
                            onChange={(e) => updateEtage(etage.id, e.target.value)}
                            className="w-full py-2.5 px-[15px] border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-forest transition-colors" 
                            placeholder="ex: 400" 
                          />
                        </td>
                        <td className="p-[8px_15px] border-b border-[#f0f0f0]">
                          <button onClick={() => deleteEtage(etage.id)} className="bg-transparent border-none text-[12px] font-semibold text-slate hover:text-[#E03131] cursor-pointer transition-colors">Supprimer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addEtage} className="inline-flex items-center gap-2 px-[15px] py-[10px] bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-lg text-[12px] font-semibold text-navy cursor-pointer mt-2.5 hover:bg-[#e9ecef] transition-colors">
                + Ajouter un étage
              </button>
              
              <div className="flex justify-between items-center mt-[30px] pt-[20px] border-t border-[#f0f0f0]">
                <button onClick={() => setCurrentStep(1)} className="bg-transparent text-forest border-[1.5px] border-forest py-2.5 px-[30px] rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#F1F5F2] transition-colors">Précédent</button>
                <button onClick={() => setCurrentStep(3)} className="bg-forest text-white border-none py-3 px-10 rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#2D4330] transition-colors">Suivant</button>
              </div>
            </div>
          )}

          {/* STEP 3: COÛTS */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-[30px]">
                <div>
                  <label className="block text-[12px] text-slate mb-2">Standing</label>
                  <select 
                    value={standing}
                    onChange={handleStandingChange}
                    className="w-full py-2.5 px-[15px] border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-forest transition-colors appearance-none cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23FF5A00%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_15px_center] pr-10"
                  >
                    <option value="">-- choisir --</option>
                    <option value="2300">Économique — 2 300 DH/m²</option>
                    <option value="3000">Moyen standing — 3 000 DH/m²</option>
                    <option value="5000">Haut standing — 5 000 DH/m²</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] text-slate mb-2">Coût de construction (DH/m²)</label>
                  <input 
                    type="number" 
                    value={coutConstruction}
                    onChange={(e) => setCoutConstruction(e.target.value)}
                    placeholder="auto depuis Standing (modifiable)" 
                    className="w-full py-2.5 px-[15px] border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-forest transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-[30px] pt-[20px] border-t border-[#f0f0f0]">
                <button onClick={() => setCurrentStep(2)} className="bg-transparent text-forest border-[1.5px] border-forest py-2.5 px-[30px] rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#F1F5F2] transition-colors">Précédent</button>
                <button onClick={() => setCurrentStep(4)} className="bg-forest text-white border-none py-3 px-10 rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#2D4330] transition-colors">Suivant</button>
              </div>
            </div>
          )}

          {/* STEP 4: PRIX DE VENTE */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-[30px]">
                <div>
                  <label className="block text-[12px] text-slate mb-2">Prix de vente appartement (DH/m²)</label>
                  <input 
                    type="number" 
                    value={prixVenteAppart}
                    onChange={(e) => setPrixVenteAppart(e.target.value)}
                    placeholder="ex: 9000" 
                    className="w-full py-2.5 px-[15px] border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-forest transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-slate mb-2">Prix de vente rez-de-chaussée (DH/m²)</label>
                  <input 
                    type="number" 
                    value={prixVenteRDC}
                    onChange={(e) => setPrixVenteRDC(e.target.value)}
                    placeholder="ex: 15000" 
                    className="w-full py-2.5 px-[15px] border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-forest transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-[30px] pt-[20px] border-t border-[#f0f0f0]">
                <button onClick={() => setCurrentStep(3)} className="bg-transparent text-forest border-[1.5px] border-forest py-2.5 px-[30px] rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#F1F5F2] transition-colors">Précédent</button>
                <button onClick={() => setCurrentStep(5)} className="bg-forest text-white border-none py-3 px-[25px] rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#2D4330] transition-colors w-auto">Calculer & Voir les résultats</button>
              </div>
            </div>
          )}

          {/* STEP 5: RÉSULTATS */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] mb-[25px]">
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center">
                  <span className="text-[10px] text-slate mb-1 block">Vendable Appart (85%)</span>
                  <span className="text-[16px] font-bold text-navy">{formatNumber(vendableAppart)} m²</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center">
                  <span className="text-[10px] text-slate mb-1 block">Vendable RDC (85%)</span>
                  <span className="text-[16px] font-bold text-navy">{formatNumber(vendableRDC)} m²</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center">
                  <span className="text-[10px] text-slate mb-1 block">Vendable Sous-sol (50%)</span>
                  <span className="text-[16px] font-bold text-navy">{formatNumber(vendableSousSol)} m²</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center">
                  <span className="text-[10px] text-slate mb-1 block">Vendable Mezzanine (50%)</span>
                  <span className="text-[16px] font-bold text-navy">{formatNumber(vendableMezzanine)} m²</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center">
                  <span className="text-[10px] text-slate mb-1 block">ROI</span>
                  <span className={`text-[16px] font-bold ${isRentable ? 'text-[#2B8A3E]' : 'text-[#E03131]'}`}>
                    {formatNumber(roi)} %
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center">
                  <span className="text-[10px] text-slate mb-1 block">Marge brute</span>
                  <span className={`text-[16px] font-bold ${isRentable ? 'text-[#2B8A3E]' : 'text-[#E03131]'}`}>
                    {formatNumber(margeBrute)} DH
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center col-span-2 md:col-span-1">
                  <span className="text-[10px] text-slate mb-1 block">Total charges</span>
                  <span className="text-[16px] font-bold text-navy">{formatNumber(totalCharges)} DH</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-[10px] p-[15px] text-center col-span-2 md:col-span-1">
                  <span className="text-[10px] text-slate mb-1 block">Ventes totales</span>
                  <span className="text-[16px] font-bold text-navy">{formatNumber(ventesTotales)} DH</span>
                </div>
              </div>

              <div className={`p-[15px] mb-5 rounded bg-[#FFF5F5] border-l-4 ${isRentable ? 'border-[#2B8A3E] bg-[#EBFBEE]' : 'border-[#E03131] bg-[#FFF5F5]'}`}>
                <h5 className={`text-[13px] font-bold mb-1 flex items-center gap-2 ${isRentable ? 'text-[#2B8A3E]' : 'text-[#E03131]'}`}>
                  {isRentable ? <i className="ti ti-circle-check"></i> : <i className="ti ti-circle-x"></i>}
                  {isRentable ? 'Projet rentable' : 'Projet non rentable'}
                </h5>
                <p className="text-[12px] text-navy">
                  {isRentable ? 'La marge brute est positive. Ce projet semble viable financièrement.' : 'Marge brute négative : revoir surfaces, standing, ou négocier le foncier.'}
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-5 mb-5">
                <p className="text-[13px] font-semibold text-navy mb-4">Voulez-vous enregistrer cette simulation dans votre espace client ?</p>
                <div className="flex flex-col md:flex-row gap-2.5">
                  <button 
                    onClick={handleSaveSimulation}
                    disabled={isSaving || saveSuccess}
                    className={`flex-1 py-3 px-5 rounded-lg text-[12px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all ${
                      saveSuccess 
                        ? 'bg-green-500 text-white border-none' 
                        : 'bg-navy text-white border-none hover:bg-black'
                    } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <><i className="ti ti-loader animate-spin"></i> Enregistrement...</>
                    ) : saveSuccess ? (
                      <><i className="ti ti-check"></i> Simulation Enregistrée !</>
                    ) : (
                      <><i className="ti ti-device-floppy"></i> Enregistrer dans mon Dashboard</>
                    )}
                  </button>
                  {!isAuthenticated && (
                    <p className="text-[10px] text-gray-500 mt-2 italic text-center md:text-left">
                      * Vous devez être connecté pour enregistrer.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2.5 justify-end mb-5">
                <button onClick={() => {
                  setCurrentStep(1);
                  setSuperficieTerrain(''); setPrixAchatTerrain('');
                  setCoutConstruction(''); setStanding('');
                  setPrixVenteAppart(''); setPrixVenteRDC('');
                }} className="bg-forest text-white border-none py-2.5 px-[25px] rounded-lg text-[12px] font-bold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-[#2D4330] transition-colors">
                  Nouvelle simulation
                </button>
                <Link to="/" className="bg-forest text-white border-none py-2.5 px-[25px] rounded-lg text-[12px] font-bold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-[#2D4330] transition-colors no-underline">
                  <i className="ti ti-rocket"></i> Aller sur l'accueil
                </Link>
              </div>

              <div className="flex justify-between items-center mt-[30px] pt-[20px] border-t border-[#f0f0f0]">
                <button onClick={() => setCurrentStep(4)} className="bg-transparent text-forest border-[1.5px] border-forest py-2.5 px-[30px] rounded-[10px] font-bold text-sm cursor-pointer hover:bg-[#F1F5F2] transition-colors">Précédent</button>
              </div>
            </div>
          )}
        </div>

        {/* ALERTS AND INFO CARDS */}
        <div className="bg-[#FFF9E6] border-[1.5px] border-gold rounded-xl p-[20px_25px] flex gap-[15px] items-start mb-[40px]">
          <i className="ti ti-alert-triangle text-gold text-xl mt-0.5"></i>
          <div>
            <h4 className="text-[14px] font-bold text-navy mb-1">Important</h4>
            <p className="text-[13px] text-navy leading-relaxed">Veuillez noter que ce simulateur fournit une estimation basée sur les données que vous avez saisies. Les résultats peuvent varier en fonction de facteurs externes non pris en compte.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[25px]">
          <div className="bg-white rounded-xl p-[30px] border border-gray-200">
            <h3 className="text-[16px] font-bold text-navy mb-5">Pourquoi utiliser ce simulateur ?</h3>
            <ul className="list-none space-y-[15px]">
              <li className="flex items-start gap-2.5 text-[13px] text-slate leading-relaxed">
                <i className="ti ti-check text-gold text-lg shrink-0"></i> Avoir une première idée de la faisabilité d'un projet.
              </li>
              <li className="flex items-start gap-2.5 text-[13px] text-slate leading-relaxed">
                <i className="ti ti-check text-gold text-lg shrink-0"></i> Identifier les marges potentielles selon le type de projet.
              </li>
              <li className="flex items-start gap-2.5 text-[13px] text-slate leading-relaxed">
                <i className="ti ti-check text-gold text-lg shrink-0"></i> Comparer plusieurs scénarios avant d'investir.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-[30px] border border-gray-200">
            <h3 className="text-[16px] font-bold text-navy mb-5">Conseils</h3>
            <ul className="list-none space-y-[15px]">
              <li className="flex items-start gap-2.5 text-[13px] text-slate leading-relaxed">
                <i className="ti ti-bulb text-gold text-lg shrink-0"></i> Renseignez des hypothèses réalistes et comparez plusieurs variantes (prix de vente, coûts au m², nombre d'étages) pour valider la viabilité.
              </li>
              <li className="flex items-start gap-2.5 text-[13px] text-slate leading-relaxed">
                <i className="ti ti-bulb text-gold text-lg shrink-0"></i> Téléchargez le résultat et partagez-le avec votre professionnel.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-[30px] border border-gray-200">
            <h3 className="text-[16px] font-bold text-navy mb-5">Besoin d'un expert ?</h3>
            <ul className="list-none mb-5">
              <li className="flex items-start gap-2.5 text-[13px] text-slate leading-relaxed">
                <i className="ti ti-user-check text-gold text-lg shrink-0"></i> Contactez un professionnel vérifié sur InvestAqary pour une étude détaillée et personnalisée.
              </li>
            </ul>
            <Link to="/maalems" className="block w-full text-center bg-forest text-white border-none py-3.5 rounded-[10px] font-bold text-sm mt-2.5 hover:bg-[#2D4330] transition-colors no-underline">
              Contacter un pro
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
