import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../data/apiService';

export default function DevisModal() {
  const { isDevisModalOpen, closeDevisModal, devisModalData } = useModal();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    phone: user?.phone || ''
  });

  if (!isDevisModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiService.post('/leads', {
        ...formData,
        pro_id: devisModalData?.proId // Ensure proId is passed from ModalContext
      });

      if (response.success) {
        setStep('success');
        setTimeout(() => {
          closeDevisModal();
          setStep('form');
          setFormData({ subject: '', description: '', phone: user?.phone || '' });
        }, 3000);
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={closeDevisModal}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] rounded-[32px] overflow-hidden shadow-2xl animate-scaleIn font-poppins">
        {/* Close Button */}
        <button 
          onClick={closeDevisModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors border-none cursor-pointer z-10"
        >
          <i className="ti ti-x text-lg"></i>
        </button>

        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center text-center">
            {/* Illustration Area */}
            <div className="w-full aspect-[4/3] relative mb-6 flex items-center justify-center">
              <div className="w-full h-full bg-[#F8FAFC] rounded-2xl flex flex-col items-center justify-center p-6">
                <div className="text-[80px] mb-2">👷‍♂️</div>
                <div className="w-24 h-1 bg-forest rounded-full mb-4"></div>
                <div className="text-navy/20 text-4xl font-black uppercase tracking-widest">INVESTAQARY</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Généré par InvestAqary</p>
              </div>
            </div>

            <h2 className="text-[26px] font-extrabold text-[#111827] leading-[1.3] mb-8 max-w-[300px]">
              Inscrivez-vous gratuitement sur InvestAqary !
            </h2>

            <Link 
              to="/inscription-client" 
              onClick={closeDevisModal}
              className="w-full py-4 bg-forest text-white text-[16px] font-bold rounded-2xl no-underline hover:bg-black transition-colors shadow-lg shadow-green-200 mb-8 flex items-center justify-center"
            >
              Inscrivez-vous
            </Link>

            <div className="text-[14px] text-gray-500 font-medium">
              Vous avez déjà un compte ?{' '}
              <Link 
                to="/connexion" 
                onClick={closeDevisModal}
                className="text-forest font-bold no-underline hover:underline"
              >
                Connectez-vous
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8">
            {step === 'form' ? (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-forest/10 text-forest rounded-xl flex items-center justify-center text-2xl">
                    <i className="ti ti-file-text"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-navy">Demander un Devis</h2>
                    <p className="text-xs text-gray-500">
                      {devisModalData?.proName ? `À destination de : ${devisModalData.proName}` : `Bonjour ${user?.name}, décrivez votre projet.`}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sujet des travaux</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Peinture salon et chambres"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-forest outline-none transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description détaillée</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Précisez la superficie, les matériaux souhaités, etc."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-forest outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone de contact</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="06 XX XX XX XX"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-forest outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-forest text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-green-100 border-none cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center animate-scaleIn">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6">
                  <i className="ti ti-check"></i>
                </div>
                <h3 className="text-2xl font-black text-navy mb-2">Demande Envoyée !</h3>
                <p className="text-sm text-gray-500 max-w-[280px]">
                  Votre demande de devis a été transmise avec succès. Le prestataire vous contactera bientôt.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
