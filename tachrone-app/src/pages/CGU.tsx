import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function CGU() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />

      <main className="max-w-[900px] mx-auto px-4 md:px-10 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-forest no-underline text-gray-400">Accueil</Link>
          <i className="ti ti-chevron-right text-[10px]"></i>
          <span className="text-navy font-bold">Conditions Générales d'Utilisation</span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-14">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="w-16 h-16 bg-forest/10 text-forest rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="ti ti-shield-check"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1E293B] mb-3">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-gray-400 text-sm">
              Dernière mise à jour : 07 Juin 2026
            </p>
          </div>

          {/* Table des matières */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-12 border border-slate-100">
            <h3 className="text-sm font-black text-navy mb-4 uppercase tracking-wider flex items-center gap-2">
              <i className="ti ti-list text-forest"></i> Table des matières
            </h3>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { num: 1, title: 'Présentation de la plateforme' },
                { num: 2, title: 'Inscription et comptes utilisateurs' },
                { num: 3, title: 'Obligations des professionnels' },
                { num: 4, title: 'Obligations des clients' },
                { num: 5, title: 'Interdiction de fraude et d\'escroquerie' },
                { num: 6, title: 'Règles spécifiques à l\'immobilier' },
                { num: 7, title: 'Propriété intellectuelle' },
                { num: 8, title: 'Protection des données personnelles' },
                { num: 9, title: 'Responsabilité et litiges' },
                { num: 10, title: 'Sanctions et résiliation' },
                { num: 11, title: 'Droit applicable' },
                { num: 12, title: 'Contact' },
              ].map(item => (
                <a key={item.num} href={`#article-${item.num}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-forest no-underline py-1.5 px-3 rounded-lg hover:bg-white transition-all">
                  <span className="w-6 h-6 bg-forest/10 text-forest rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">{item.num}</span>
                  {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Articles */}
          <div className="space-y-12 text-sm text-gray-600 leading-relaxed">

            {/* Article 1 */}
            <section id="article-1">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">1</span>
                Présentation de la plateforme
              </h2>
              <p className="mb-3">
                <strong>InvestAqary</strong> est une plateforme numérique marocaine spécialisée dans le secteur de l'immobilier et du BTP (Bâtiment et Travaux Publics). Elle met en relation des <strong>particuliers (clients)</strong> avec des <strong>professionnels qualifiés</strong> (entreprises, maalems, fournisseurs de matériaux).
              </p>
              <p className="mb-3">
                La plateforme offre les services suivants :
              </p>
              <ul className="list-none space-y-2 pl-4">
                {[
                  'Recherche et mise en relation avec des professionnels du BTP',
                  'Demande de devis pour des travaux de construction et rénovation',
                  'Simulateur de coûts pour projets immobiliers',
                  'Publication de projets et réalisations par les professionnels',
                  'Catalogue de matériaux de construction',
                  'Système d\'avis et de notation des professionnels',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="ti ti-check text-forest mt-0.5"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Article 2 */}
            <section id="article-2">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">2</span>
                Inscription et comptes utilisateurs
              </h2>
              <p className="mb-3">
                L'inscription sur InvestAqary est gratuite et ouverte à toute personne physique majeure (18 ans et plus) ou morale résidant au Maroc.
              </p>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-4">
                <h4 className="text-xs font-black text-navy mb-2 uppercase tracking-wider">Pour les clients :</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Le compte est activé <strong>immédiatement</strong> après inscription</li>
                  <li>Les informations fournies doivent être exactes et à jour</li>
                  <li>Un seul compte par personne est autorisé</li>
                </ul>
              </div>
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-4">
                <h4 className="text-xs font-black text-navy mb-2 uppercase tracking-wider">Pour les professionnels :</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li>Le compte est soumis à <strong>validation par l'administration</strong> d'InvestAqary</li>
                  <li>L'entreprise doit fournir ses informations légales (nom, catégorie, ICE le cas échéant)</li>
                  <li>InvestAqary se réserve le droit de refuser toute inscription ne respectant pas les conditions</li>
                  <li>Les maalems (artisans indépendants) doivent justifier de leur compétence</li>
                </ul>
              </div>
            </section>

            {/* Article 3 */}
            <section id="article-3">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">3</span>
                Obligations des professionnels
              </h2>
              <p className="mb-3">Tout professionnel inscrit sur InvestAqary s'engage à :</p>
              <ul className="list-none space-y-3 pl-4">
                {[
                  { icon: 'ti-certificate', text: 'Fournir des informations véridiques sur son identité, ses compétences et son expérience' },
                  { icon: 'ti-photo', text: 'Publier uniquement des photos de ses propres réalisations (pas de photos copiées d\'Internet ou d\'autres professionnels)' },
                  { icon: 'ti-currency-dirham', text: 'Proposer des devis transparents, détaillés et conformes aux prix du marché' },
                  { icon: 'ti-clock', text: 'Respecter les délais convenus avec les clients' },
                  { icon: 'ti-shield-check', text: 'Respecter les normes de sécurité et de qualité en vigueur au Maroc' },
                  { icon: 'ti-building', text: 'Disposer des assurances et autorisations nécessaires pour exercer son activité' },
                  { icon: 'ti-message', text: 'Répondre aux demandes de devis dans un délai raisonnable' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                    <i className={`ti ${item.icon} text-forest text-lg mt-0.5`}></i>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Article 4 */}
            <section id="article-4">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">4</span>
                Obligations des clients
              </h2>
              <p className="mb-3">Tout client inscrit sur InvestAqary s'engage à :</p>
              <ul className="list-none space-y-2 pl-4">
                {[
                  'Fournir des informations exactes lors de l\'inscription',
                  'Décrire clairement et honnêtement ses besoins dans les demandes de devis',
                  'Ne pas utiliser la plateforme à des fins illicites',
                  'Respecter les professionnels dans les échanges de messages',
                  'Ne pas publier de faux avis ou d\'avis diffamatoires',
                  'Signaler tout comportement suspect ou frauduleux à l\'équipe InvestAqary',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="ti ti-check text-forest mt-0.5"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Article 5 - ANTI-FRAUDE */}
            <section id="article-5">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs font-black">5</span>
                <span className="text-red-600">Interdiction de fraude et d'escroquerie</span>
              </h2>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center text-xl">
                    <i className="ti ti-alert-triangle"></i>
                  </div>
                  <h3 className="text-base font-black text-red-700">TOUTE FORME DE FRAUDE EST STRICTEMENT INTERDITE</h3>
                </div>
                <p className="text-red-700 text-sm mb-4 font-medium">
                  Conformément au <strong>Code Pénal Marocain (Articles 540 à 547)</strong>, l'escroquerie est un délit passible d'une peine d'emprisonnement de <strong>1 à 5 ans</strong> et d'une amende de <strong>500 à 5 000 dirhams</strong>. InvestAqary coopère pleinement avec les autorités judiciaires marocaines.
                </p>
              </div>

              <p className="mb-3 font-bold text-navy">Sont notamment interdits et sanctionnés :</p>
              <ul className="list-none space-y-3 pl-4">
                {[
                  { title: 'Usurpation d\'identité', desc: 'Se faire passer pour un professionnel qualifié sans l\'être, utiliser le nom ou les photos d\'un autre professionnel' },
                  { title: 'Faux devis et surfacturation', desc: 'Gonfler les prix de manière abusive, établir des devis trompeurs, facturer des travaux non réalisés' },
                  { title: 'Travaux bâclés ou non conformes', desc: 'Utiliser des matériaux de qualité inférieure à celle annoncée, ne pas respecter les normes de construction' },
                  { title: 'Fausses promesses', desc: 'Promettre des délais, des résultats ou des qualifications impossibles pour obtenir un contrat' },
                  { title: 'Abus de confiance', desc: 'Recevoir un paiement et ne pas effectuer les travaux, disparaître après réception d\'un acompte' },
                  { title: 'Faux avis et manipulations', desc: 'Publier de faux avis positifs sur son propre profil ou de faux avis négatifs sur les concurrents' },
                  { title: 'Blanchiment d\'argent', desc: 'Utiliser la plateforme pour dissimuler des revenus illicites via de fausses transactions' },
                  { title: 'Collusion et ententes illicites', desc: 'S\'entendre entre professionnels pour fixer les prix ou se répartir artificiellement les marchés' },
                ].map((item, i) => (
                  <li key={i} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="ti ti-x text-red-500"></i>
                      <strong className="text-red-700 text-xs uppercase tracking-wider">{item.title}</strong>
                    </div>
                    <p className="text-gray-600 text-xs pl-6">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Article 6 - Règles immobilier */}
            <section id="article-6">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">6</span>
                Règles spécifiques à l'immobilier et au BTP
              </h2>
              <p className="mb-4">
                Le secteur immobilier au Maroc est réglementé. Tous les utilisateurs doivent respecter les lois en vigueur :
              </p>

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <h4 className="text-xs font-black text-amber-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <i className="ti ti-gavel"></i> Lois et réglementations applicables
                  </h4>
                  <ul className="list-none space-y-2">
                    {[
                      'Loi n° 12-90 relative à l\'urbanisme',
                      'Loi n° 25-90 relative aux lotissements, groupes d\'habitations et morcellements',
                      'Loi n° 66-12 relative au contrôle et à la répression des infractions en matière d\'urbanisme et de construction',
                      'Loi n° 44-00 complétant le Dahir formant Code des Obligations et Contrats (VEFA)',
                      'Règlement Général de Construction (RGC)',
                      'Règlement de Construction Parasismique (RPS 2000)',
                      'Normes Marocaines de Construction (NM)',
                    ].map((law, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-amber-900">
                        <i className="ti ti-scale text-amber-600 mt-0.5"></i>
                        <span>{law}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h4 className="text-xs font-black text-navy mb-3 uppercase tracking-wider flex items-center gap-2">
                    <i className="ti ti-building"></i> Obligations dans les travaux de construction
                  </h4>
                  <ul className="list-none space-y-2">
                    {[
                      'Tout projet de construction doit disposer d\'un permis de construire délivré par la commune',
                      'Les travaux doivent être conformes aux plans approuvés par l\'architecte agréé',
                      'L\'utilisation de matériaux conformes aux normes marocaines est obligatoire',
                      'Un suivi régulier des travaux par un bureau de contrôle agréé est recommandé',
                      'Les professionnels doivent respecter les règles de sécurité sur les chantiers',
                      'Tout professionnel doit souscrire une assurance responsabilité civile professionnelle',
                      'Les délais de garantie décennale s\'appliquent conformément au DOC (articles 769 et suivants)',
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <i className="ti ti-check-circle text-forest mt-0.5"></i>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/30 border border-red-100 rounded-xl p-5">
                  <h4 className="text-xs font-black text-red-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <i className="ti ti-ban"></i> Pratiques interdites dans l'immobilier
                  </h4>
                  <ul className="list-none space-y-2">
                    {[
                      'Construire sans permis de construire valide',
                      'Modifier les plans approuvés sans autorisation de la commune',
                      'Utiliser des matériaux non conformes aux normes de sécurité',
                      'Vendre un bien immobilier non achevé sans contrat VEFA conforme à la loi 44-00',
                      'Exercer comme architecte, ingénieur ou topographe sans être inscrit à l\'ordre professionnel',
                      'Construire dans des zones non constructibles ou des zones à risque',
                      'Sous-traiter les travaux sans en informer le client',
                      'Réaliser des travaux de nuit sans autorisation dans les zones résidentielles',
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                        <i className="ti ti-x text-red-500 mt-0.5"></i>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Article 7 */}
            <section id="article-7">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">7</span>
                Propriété intellectuelle
              </h2>
              <p className="mb-3">
                Le contenu de la plateforme InvestAqary (logo, design, textes, code source, images) est protégé par les droits de propriété intellectuelle conformément à la <strong>loi n° 2-00 relative aux droits d'auteur et droits voisins</strong>.
              </p>
              <p>
                Les utilisateurs conservent la propriété de leurs contenus (photos, descriptions) mais accordent à InvestAqary une licence non exclusive d'utilisation à des fins de promotion de la plateforme.
              </p>
            </section>

            {/* Article 8 */}
            <section id="article-8">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">8</span>
                Protection des données personnelles
              </h2>
              <p className="mb-3">
                Conformément à la <strong>loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, InvestAqary s'engage à :
              </p>
              <ul className="list-none space-y-2 pl-4">
                {[
                  'Protéger les données personnelles de tous les utilisateurs',
                  'Ne jamais vendre ou partager les données avec des tiers sans consentement',
                  'Permettre à chaque utilisateur d\'accéder, modifier ou supprimer ses données',
                  'Sécuriser les données par des moyens techniques appropriés (chiffrement, pare-feu)',
                  'Respecter les décisions de la CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="ti ti-lock text-forest mt-0.5"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Article 9 */}
            <section id="article-9">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">9</span>
                Responsabilité et litiges
              </h2>
              <p className="mb-3">
                InvestAqary agit en tant que <strong>plateforme de mise en relation</strong>. À ce titre :
              </p>
              <ul className="list-none space-y-2 pl-4 mb-4">
                {[
                  'InvestAqary n\'est pas partie aux contrats conclus entre clients et professionnels',
                  'InvestAqary ne garantit pas la qualité des travaux réalisés par les professionnels',
                  'InvestAqary met tout en œuvre pour vérifier les profils des professionnels mais ne peut être tenu responsable de leurs agissements',
                  'En cas de litige, les parties sont invitées à tenter une résolution amiable avant toute action en justice',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="ti ti-info-circle text-blue-500 mt-0.5"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                En cas de fraude avérée, InvestAqary se réserve le droit de <strong>transmettre les informations de l'utilisateur frauduleux aux autorités compétentes</strong>.
              </p>
            </section>

            {/* Article 10 */}
            <section id="article-10">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs font-black">10</span>
                Sanctions et résiliation
              </h2>
              <p className="mb-3">En cas de non-respect des présentes conditions, InvestAqary peut :</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { level: 'Avertissement', icon: 'ti-alert-circle', color: 'amber', desc: 'Notification envoyée à l\'utilisateur pour un premier manquement mineur' },
                  { level: 'Suspension', icon: 'ti-user-off', color: 'orange', desc: 'Suspension temporaire du compte en cas de récidive ou manquement grave' },
                  { level: 'Suppression', icon: 'ti-trash', color: 'red', desc: 'Suppression définitive du compte et signalement aux autorités en cas de fraude' },
                ].map((item, i) => (
                  <div key={i} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-xl p-4 text-center`}>
                    <div className={`w-10 h-10 bg-${item.color}-500 text-white rounded-xl flex items-center justify-center text-xl mx-auto mb-3`}>
                      <i className={`ti ${item.icon}`}></i>
                    </div>
                    <h4 className={`text-xs font-black text-${item.color}-700 mb-2 uppercase`}>{item.level}</h4>
                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Article 11 */}
            <section id="article-11">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">11</span>
                Droit applicable
              </h2>
              <p className="mb-3">
                Les présentes conditions générales d'utilisation sont régies par le <strong>droit marocain</strong>. Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis aux tribunaux compétents du <strong>Royaume du Maroc</strong>.
              </p>
              <p>
                Les textes de référence incluent notamment : le <strong>Dahir des Obligations et Contrats (DOC)</strong>, le <strong>Code Pénal Marocain</strong>, la <strong>loi 09-08</strong> sur la protection des données et les lois relatives à l'urbanisme et la construction.
              </p>
            </section>

            {/* Article 12 */}
            <section id="article-12">
              <h2 className="text-lg font-black text-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center text-xs font-black">12</span>
                Contact
              </h2>
              <p className="mb-4">
                Pour toute question relative aux présentes conditions, vous pouvez nous contacter :
              </p>
              <div className="bg-forest/5 border border-forest/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center">
                    <i className="ti ti-mail text-sm"></i>
                  </div>
                  <span className="text-sm font-bold text-navy">contact@investaqary.ma</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center">
                    <i className="ti ti-phone text-sm"></i>
                  </div>
                  <span className="text-sm font-bold text-navy">+212 5XX-XXXXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center">
                    <i className="ti ti-map-pin text-sm"></i>
                  </div>
                  <span className="text-sm font-bold text-navy">Casablanca, Maroc</span>
                </div>
              </div>
            </section>

          </div>

          {/* Footer note */}
          <div className="mt-14 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              En utilisant InvestAqary, vous acceptez les présentes conditions dans leur intégralité.
            </p>
            <p className="text-[10px] text-gray-300 mt-2">
              © 2026 InvestAqary. Tous droits réservés.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
