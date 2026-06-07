import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import MaalemSection from '../components/MaalemSection';
import ProjectSection from '../components/ProjectSection';
import RevetementSection from '../components/RevetementSection';
import GrosOeuvresSection from '../components/GrosOeuvresSection';
import CtaBanner from '../components/CtaBanner';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <MaalemSection />
        <ProjectSection />
        <RevetementSection />
        <GrosOeuvresSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
