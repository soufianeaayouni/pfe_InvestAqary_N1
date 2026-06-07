import { Link, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts } from '../data/blogData';

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'Tout';
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Tout', ...new Set(blogPosts.map(p => p.category))];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = categoryParam === 'Tout' || post.category === categoryParam;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryParam, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-navy mb-4">Blog InvestAqary</h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium mb-10">
            Conseils d'experts, guides de prix et tendances pour vos projets de construction et rénovation au Maroc.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative flex-1 w-full">
              <i className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Rechercher un article..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gold/20 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchParams(cat === 'Tout' ? {} : { category: cat })}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    categoryParam === cat 
                    ? 'bg-gold text-navy shadow-md' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <Link to={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-navy text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 font-medium">
                    <span className="flex items-center gap-1">
                      <i className="ti ti-calendar"></i> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="ti ti-clock"></i> {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-navy mb-3 leading-tight group-hover:text-gold transition-colors">
                    <Link to={`/blog/${post.slug}`} className="no-underline text-inherit">
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-2 text-navy font-bold text-sm no-underline group/link"
                  >
                    Lire la suite 
                    <i className="ti ti-arrow-right transition-transform group-hover/link:translate-x-1"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-navy mb-2">Aucun article trouvé</h3>
            <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSearchParams({}); }}
              className="mt-6 text-gold font-bold hover:underline"
            >
              Voir tous les articles
            </button>
          </div>
        )}

        {/* SEO Content Section */}
        <section className="mt-24 p-10 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-extrabold text-navy mb-6">Pourquoi suivre le blog InvestAqary ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gold mb-3">Expertise Locale</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Nos articles sont rédigés par des professionnels du bâtiment connaissant parfaitement les spécificités du marché marocain.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gold mb-3">Transparence des Prix</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Nous analysons les coûts réels des matériaux et de la main-d'œuvre pour vous aider à préparer vos budgets sereinement.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gold mb-3">Accompagnement</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                De la conception à la réalisation, nous vous guidons dans le choix des meilleurs prestataires et solutions techniques.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
