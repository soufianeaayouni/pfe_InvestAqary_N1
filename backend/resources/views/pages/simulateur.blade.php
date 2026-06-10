@extends('layouts.app')

@section('content')
<div class="bg-gray-50 min-h-screen font-sans pb-20 pt-10">
    <div class="max-w-[1400px] w-full mx-auto px-4 md:px-[60px]" x-data="simulateur()">
        <h1 class="text-[28px] font-extrabold text-gray-900 mb-[30px]">Simulateur</h1>

        <div class="bg-white rounded-2xl p-6 md:p-[30px] border border-gray-200 mb-[30px] shadow-sm">
            
            <!-- STEPPER -->
            <div class="flex items-center justify-between mb-10 relative overflow-x-auto pb-4 md:pb-0">
                <template x-for="(step, idx) in steps" :key="step.num">
                    <div class="flex items-center flex-1 last:flex-none min-w-[120px] md:min-w-0">
                        <div :class="{
                                'border-[#3D5A40] bg-[#f0f4f1] text-gray-900': currentStep === step.num,
                                'border-gray-200 text-gray-500': currentStep !== step.num
                             }" 
                             class="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-[1.5px] font-semibold text-[13px] z-10 bg-white transition-colors">
                            <i :class="['ti text-lg', step.icon, currentStep === step.num ? 'text-[#3D5A40]' : 'text-gray-400']"></i>
                            <span class="hidden md:inline" x-text="step.label"></span>
                        </div>
                        <template x-if="idx < steps.length - 1">
                            <div class="flex-1 h-[1px] border-t-2 border-dotted border-gray-200 mx-2.5 min-w-[20px]"></div>
                        </template>
                    </div>
                </template>
            </div>

            <!-- STEP 1 -->
            <div x-show="currentStep === 1" x-transition.opacity>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-[30px] mb-[30px]">
                    <div>
                        <label class="block text-[12px] text-gray-500 mb-2">Superficie de terrain (m²)</label>
                        <input type="number" x-model.number="superficieTerrain" placeholder="ex: 600" class="w-full py-[14px] px-[18px] border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-[#3D5A40] transition-colors" />
                    </div>
                    <div>
                        <label class="block text-[12px] text-gray-500 mb-2">Prix achat terrain (DH/m²)</label>
                        <input type="number" x-model.number="prixAchatTerrain" placeholder="ex: 5000" class="w-full py-[14px] px-[18px] border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-[#3D5A40] transition-colors" />
                    </div>
                </div>
                <div class="flex justify-end">
                    <button @click="currentStep = 2" class="bg-[#3D5A40] text-white border-none py-3 px-10 rounded-[10px] font-bold text-sm hover:bg-[#2c412f] transition-colors shadow-sm">Suivant</button>
                </div>
            </div>

            <!-- STEP 2 -->
            <div x-show="currentStep === 2" x-transition.opacity style="display: none;">
                <div class="overflow-x-auto mb-5 border border-gray-200 rounded-xl">
                    <table class="w-full border-collapse min-w-[600px] text-left text-sm">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="p-4 font-medium text-gray-600 w-1/3">Niveau</th>
                                <th class="p-4 font-medium text-gray-600">Superficie construite (m²)</th>
                                <th class="p-4 font-medium text-gray-600 w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <template x-for="(etage, index) in etages" :key="etage.id">
                                <tr>
                                    <td class="p-4 text-gray-900 font-medium" x-text="etage.nom"></td>
                                    <td class="p-4">
                                        <input type="number" x-model.number="etage.superficie" class="w-full py-2.5 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#3D5A40] transition-colors" placeholder="ex: 400" />
                                    </td>
                                    <td class="p-4">
                                        <button @click="deleteEtage(etage.id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Supprimer</button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                <button @click="addEtage" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    + Ajouter un étage
                </button>
                
                <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button @click="currentStep = 1" class="text-[#3D5A40] border border-[#3D5A40] py-2.5 px-8 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors">Précédent</button>
                    <button @click="currentStep = 3" class="bg-[#3D5A40] text-white py-3 px-10 rounded-lg font-bold text-sm hover:bg-[#2c412f] transition-colors shadow-sm">Suivant</button>
                </div>
            </div>

            <!-- STEP 3 -->
            <div x-show="currentStep === 3" x-transition.opacity style="display: none;">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label class="block text-sm text-gray-600 mb-2 font-medium">Standing</label>
                        <select x-model="standing" @change="updateCoutConstruction" class="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#3D5A40] bg-white">
                            <option value="">-- choisir --</option>
                            <option value="2300">Économique — 2 300 DH/m²</option>
                            <option value="3000">Moyen standing — 3 000 DH/m²</option>
                            <option value="5000">Haut standing — 5 000 DH/m²</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-2 font-medium">Coût de construction (DH/m²)</label>
                        <input type="number" x-model.number="coutConstruction" placeholder="auto depuis Standing" class="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#3D5A40]" />
                    </div>
                </div>
                <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button @click="currentStep = 2" class="text-[#3D5A40] border border-[#3D5A40] py-2.5 px-8 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors">Précédent</button>
                    <button @click="currentStep = 4" class="bg-[#3D5A40] text-white py-3 px-10 rounded-lg font-bold text-sm hover:bg-[#2c412f] transition-colors shadow-sm">Suivant</button>
                </div>
            </div>

            <!-- STEP 4 -->
            <div x-show="currentStep === 4" x-transition.opacity style="display: none;">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label class="block text-sm text-gray-600 mb-2 font-medium">Prix de vente appartement (DH/m²)</label>
                        <input type="number" x-model.number="prixVenteAppart" placeholder="ex: 9000" class="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#3D5A40]" />
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-2 font-medium">Prix de vente rez-de-chaussée (DH/m²)</label>
                        <input type="number" x-model.number="prixVenteRDC" placeholder="ex: 15000" class="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#3D5A40]" />
                    </div>
                </div>
                <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button @click="currentStep = 3" class="text-[#3D5A40] border border-[#3D5A40] py-2.5 px-8 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors">Précédent</button>
                    <button @click="currentStep = 5; calculateResults()" class="bg-[#3D5A40] text-white py-3 px-8 rounded-lg font-bold text-sm hover:bg-[#2c412f] transition-colors shadow-sm">Calculer & Voir les résultats</button>
                </div>
            </div>

            <!-- STEP 5 -->
            <div x-show="currentStep === 5" x-transition.opacity style="display: none;">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <span class="text-xs text-gray-500 mb-1 block">Vendable Appart (85%)</span>
                        <span class="text-lg font-bold text-gray-900" x-text="format(vendableAppart) + ' m²'"></span>
                    </div>
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <span class="text-xs text-gray-500 mb-1 block">Vendable RDC (85%)</span>
                        <span class="text-lg font-bold text-gray-900" x-text="format(vendableRDC) + ' m²'"></span>
                    </div>
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <span class="text-xs text-gray-500 mb-1 block">Vendable S-sol (50%)</span>
                        <span class="text-lg font-bold text-gray-900" x-text="format(vendableSousSol) + ' m²'"></span>
                    </div>
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <span class="text-xs text-gray-500 mb-1 block">Vendable Mezz (50%)</span>
                        <span class="text-lg font-bold text-gray-900" x-text="format(vendableMezzanine) + ' m²'"></span>
                    </div>
                    
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <span class="text-xs text-gray-500 mb-1 block">ROI</span>
                        <span class="text-lg font-bold" :class="isRentable ? 'text-green-600' : 'text-red-600'" x-text="format(roi) + ' %'"></span>
                    </div>
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                        <span class="text-xs text-gray-500 mb-1 block">Marge brute</span>
                        <span class="text-lg font-bold" :class="isRentable ? 'text-green-600' : 'text-red-600'" x-text="format(margeBrute) + ' DH'"></span>
                    </div>
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                        <span class="text-xs text-gray-500 mb-1 block">Total charges</span>
                        <span class="text-lg font-bold text-gray-900" x-text="format(totalCharges) + ' DH'"></span>
                    </div>
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                        <span class="text-xs text-gray-500 mb-1 block">Ventes totales</span>
                        <span class="text-lg font-bold text-gray-900" x-text="format(ventesTotales) + ' DH'"></span>
                    </div>
                </div>

                <div class="p-4 mb-6 rounded-lg border-l-4" :class="isRentable ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
                    <h5 class="text-sm font-bold mb-1 flex items-center gap-2" :class="isRentable ? 'text-green-700' : 'text-red-700'">
                        <i :class="isRentable ? 'ti ti-circle-check' : 'ti ti-circle-x'"></i>
                        <span x-text="isRentable ? 'Projet rentable' : 'Projet non rentable'"></span>
                    </h5>
                    <p class="text-xs" :class="isRentable ? 'text-green-800' : 'text-red-800'" x-text="isRentable ? 'La marge brute est positive. Ce projet semble viable financièrement.' : 'Marge brute négative : revoir surfaces, standing, ou négocier le foncier.'"></p>
                </div>

                <div class="flex flex-col md:flex-row gap-4 justify-end mb-5">
                    <button @click="resetSimulation" class="text-[#3D5A40] border border-[#3D5A40] py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors">
                        Nouvelle simulation
                    </button>
                    @auth
                        <button @click="saveSimulation" class="bg-[#3D5A40] text-white py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-[#2c412f] transition-colors shadow-sm flex items-center gap-2">
                            <i class="ti ti-device-floppy"></i> Enregistrer
                        </button>
                    @else
                        <a href="/connexion" class="bg-gray-800 text-white py-2.5 px-6 rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-sm flex items-center gap-2 text-center justify-center">
                            Connectez-vous pour enregistrer
                        </a>
                    @endauth
                </div>

                <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button @click="currentStep = 4" class="text-[#3D5A40] border border-[#3D5A40] py-2.5 px-8 rounded-lg font-bold text-sm hover:bg-green-50 transition-colors">Précédent</button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 class="text-base font-bold text-gray-900 mb-4">Pourquoi utiliser ce simulateur ?</h3>
                <ul class="space-y-3">
                    <li class="flex items-start gap-2 text-sm text-gray-600"><i class="ti ti-check text-yellow-500 mt-0.5"></i> Avoir une première idée de la faisabilité d'un projet.</li>
                    <li class="flex items-start gap-2 text-sm text-gray-600"><i class="ti ti-check text-yellow-500 mt-0.5"></i> Identifier les marges potentielles selon le type de projet.</li>
                    <li class="flex items-start gap-2 text-sm text-gray-600"><i class="ti ti-check text-yellow-500 mt-0.5"></i> Comparer plusieurs scénarios avant d'investir.</li>
                </ul>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 class="text-base font-bold text-gray-900 mb-4">Conseils</h3>
                <ul class="space-y-3">
                    <li class="flex items-start gap-2 text-sm text-gray-600"><i class="ti ti-bulb text-yellow-500 mt-0.5"></i> Renseignez des hypothèses réalistes et comparez plusieurs variantes.</li>
                    <li class="flex items-start gap-2 text-sm text-gray-600"><i class="ti ti-bulb text-yellow-500 mt-0.5"></i> Enregistrez le résultat et partagez-le avec votre professionnel.</li>
                </ul>
            </div>
            <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 class="text-base font-bold text-gray-900 mb-4">Besoin d'un expert ?</h3>
                <p class="text-sm text-gray-600 mb-4 flex items-start gap-2">
                    <i class="ti ti-user-check text-yellow-500 mt-0.5"></i> Contactez un professionnel vérifié sur InvestAqary pour une étude détaillée et personnalisée.
                </p>
                <a href="/entreprises" class="block w-full text-center bg-[#3D5A40] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#2c412f] transition-colors">Contacter un pro</a>
            </div>
        </div>
    </div>
</div>

<script>
function simulateur() {
    return {
        currentStep: 1,
        steps: [
            { num: 1, icon: 'ti-map-pin', label: 'Achat terrain' },
            { num: 2, icon: 'ti-building', label: 'Superficie construite' },
            { num: 3, icon: 'ti-coin', label: 'Coûts' },
            { num: 4, icon: 'ti-tag', label: 'Prix de vente' },
            { num: 5, icon: 'ti-checkbox', label: 'Résultats' },
        ],
        superficieTerrain: null,
        prixAchatTerrain: null,
        etages: [
            { id: 1, nom: 'Sous-sol 1', superficie: null },
            { id: 2, nom: 'RDC', superficie: null },
            { id: 3, nom: 'Mezzanine', superficie: null },
            { id: 4, nom: 'Étage 1', superficie: null },
            { id: 5, nom: 'Étage 2', superficie: null },
            { id: 6, nom: 'Étage 3', superficie: null },
        ],
        standing: '',
        coutConstruction: null,
        prixVenteAppart: null,
        prixVenteRDC: null,
        
        // Results
        vendableAppart: 0,
        vendableRDC: 0,
        vendableSousSol: 0,
        vendableMezzanine: 0,
        roi: 0,
        margeBrute: 0,
        totalCharges: 0,
        ventesTotales: 0,
        isRentable: false,

        updateCoutConstruction() {
            if (this.standing) {
                this.coutConstruction = parseFloat(this.standing);
            } else {
                this.coutConstruction = null;
            }
        },

        deleteEtage(id) {
            this.etages = this.etages.filter(e => e.id !== id);
        },

        addEtage() {
            const newId = Math.max(...this.etages.map(e => e.id), 0) + 1;
            const numEtages = this.etages.filter(e => e.nom.startsWith('Étage')).length;
            this.etages.push({ id: newId, nom: `Étage ${numEtages + 1}`, superficie: null });
        },

        getSuperficie(nom) {
            const etage = this.etages.find(e => e.nom === nom);
            return etage ? (parseFloat(etage.superficie) || 0) : 0;
        },

        getEtagesSuperficie() {
            return this.etages
                .filter(e => e.nom.startsWith('Étage'))
                .reduce((sum, e) => sum + (parseFloat(e.superficie) || 0), 0);
        },

        calculateResults() {
            this.vendableAppart = this.getEtagesSuperficie() * 0.85;
            this.vendableRDC = this.getSuperficie('RDC') * 0.85;
            this.vendableSousSol = this.getSuperficie('Sous-sol 1') * 0.50;
            this.vendableMezzanine = this.getSuperficie('Mezzanine') * 0.50;

            const totalSuperficieConstruite = this.etages.reduce((sum, e) => sum + (parseFloat(e.superficie) || 0), 0);
            
            const coutTerrain = (parseFloat(this.superficieTerrain) || 0) * (parseFloat(this.prixAchatTerrain) || 0);
            const coutConst = totalSuperficieConstruite * (parseFloat(this.coutConstruction) || 0);
            this.totalCharges = coutTerrain + coutConst;

            const ventesAppart = this.vendableAppart * (parseFloat(this.prixVenteAppart) || 0);
            const pRDC = parseFloat(this.prixVenteRDC) || 0;
            const ventesRDC = (this.vendableRDC + this.vendableSousSol + this.vendableMezzanine) * pRDC;
            this.ventesTotales = ventesAppart + ventesRDC;

            this.margeBrute = this.ventesTotales - this.totalCharges;
            this.roi = this.totalCharges > 0 ? (this.margeBrute / this.totalCharges) * 100 : 0;
            
            this.isRentable = this.margeBrute > 0;
        },

        format(num) {
            return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(num);
        },

        resetSimulation() {
            this.currentStep = 1;
            this.superficieTerrain = null;
            this.prixAchatTerrain = null;
            this.standing = '';
            this.coutConstruction = null;
            this.prixVenteAppart = null;
            this.prixVenteRDC = null;
            this.etages.forEach(e => e.superficie = null);
        },

        async saveSimulation() {
            // Enregistrement par appel API
            try {
                const response = await fetch('/simulations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        project_type: 'Construction',
                        area: this.etages.reduce((sum, e) => sum + (parseFloat(e.superficie) || 0), 0),
                        budget_min: this.totalCharges,
                        budget_max: this.totalCharges,
                        raw_data: {
                            terrain: { superficie: this.superficieTerrain, prix: this.prixAchatTerrain },
                            standing: this.standing,
                            results: { roi: this.roi, margeBrute: this.margeBrute }
                        }
                    })
                });

                if (response.ok) {
                    alert('Simulation enregistrée avec succès !');
                } else {
                    alert('Erreur lors de l\'enregistrement.');
                }
            } catch (error) {
                alert('Erreur système.');
            }
        }
    }
}
</script>
@endsection
