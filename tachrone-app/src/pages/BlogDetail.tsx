import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts } from '../data/blogData';

export default function BlogDetail() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  // Dynamic Title for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog InvestAqary`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Link to="/blog" className="text-gold font-bold hover:underline">Retour au blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-poppins">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400 font-medium">
          <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
          <i className="ti ti-chevron-right text-[10px]"></i>
          <Link to="/blog" className="hover:text-gold transition-colors">Blog</Link>
          <i className="ti ti-chevron-right text-[10px]"></i>
          <span className="text-slate-600 truncate">{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-[300px] md:h-[500px]">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6">
                <span className="bg-gold text-navy text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="px-6 md:px-12 py-10 md:py-16">
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-navy">
                    <i className="ti ti-user text-xl"></i>
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ti ti-calendar text-lg text-gold"></i>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ti ti-clock text-lg text-gold"></i>
                  <span>{post.readTime} de lecture</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-navy mb-8 leading-[1.1]">
                {post.title}
              </h1>

              <div 
                className="prose prose-lg max-w-none text-slate-600 leading-relaxed
                  prose-headings:text-navy prose-headings:font-black
                  prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:mb-6 prose-strong:text-navy
                  prose-ul:mb-6 prose-li:mb-2
                  prose-a:text-gold prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                {post.tags.map(tag => (                  <span key={tag} className="bg-slate-50 text-slate-500 text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Engagement Box */}
              <div className="mt-12 bg-navy rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black mb-3">Besoin d'un devis précis ?</h3>
                    <p className="text-slate-300 text-sm max-w-md font-medium">
                      Ne laissez pas votre budget au hasard. Utilisez notre simulateur gratuit pour estimer vos travaux en quelques clics.
                    </p>
                  </div>
                  <Link 
                    to="/simulateur" 
                    className="bg-gold text-navy px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform no-underline shadow-lg"
                  >
                    Essayer le simulateur
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[350px] space-y-8">
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <h3 className="text-lg font-black text-navy mb-6 flex items-center gap-2">
                <i className="ti ti-layout-grid text-gold"></i>
                Articles similaires
              </h3>
              <div className="space-y-6">
                {relatedPosts.map(rp => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="flex gap-4 group no-underline">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={rp.title} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy group-hover:text-gold transition-colors leading-snug line-clamp-2">
                        {rp.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                        {rp.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gold rounded-[32px] p-8 text-navy shadow-sm relative overflow-hidden group">
              <h3 className="text-xl font-black mb-4 relative z-10">Trouvez les meilleurs artisans</h3>
              <p className="text-sm font-medium mb-6 relative z-10 opacity-80">
                Accédez à notre annuaire de Maalems et entreprises vérifiés partout au Maroc.
              </p>
              <Link 
                to="/entreprises" 
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold text-xs no-underline relative z-10 hover:gap-3 transition-all"
              >
                Voir l'annuaire <i className="ti ti-arrow-right"></i>
              </Link>
              <i className="ti ti-tool absolute -bottom-4 -right-4 text-8xl text-navy/10 -rotate-12 transition-transform group-hover:scale-110"></i>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
