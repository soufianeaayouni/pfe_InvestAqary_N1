import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignupClient from './pages/SignupClient';
import SignupPro from './pages/SignupPro';
import Simulateur from './pages/Simulateur';
import CompanyDetail from './pages/CompanyDetail';
import MaalemList from './pages/MaalemList';
import CompanyList from './pages/CompanyList';
import MaalemDetail from './pages/MaalemDetail';
import SupplierList from './pages/SupplierList';
import PrestataireList from './pages/PrestataireList';
import SearchResults from './pages/SearchResults';
import ProjectDetail from './pages/ProjectDetail';
import ProjectList from './pages/ProjectList';
import ProductDetail from './pages/ProductDetail';
import SupplierDetail from './pages/SupplierDetail';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import CGU from './pages/CGU';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import ProDashboard from './pages/pro/ProDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ModalProvider } from './context/ModalContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import DevisModal from './components/DevisModal';
import ChatModal from './components/ChatModal';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/inscription-client" element={<SignupClient />} />
              <Route path="/inscription-pro" element={<SignupPro />} />
              <Route path="/simulateur" element={<Simulateur />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/client" 
                element={
                  <ProtectedRoute allowedRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/pro" 
                element={
                  <ProtectedRoute allowedRole="pro">
                    <ProDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/entreprise/:slug" element={<CompanyDetail />} />
              <Route path="/projet/:slug" element={<ProjectDetail />} />
              <Route path="/produit/:slug" element={<ProductDetail />} />
              <Route path="/projets" element={<ProjectList />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/entreprises" element={<CompanyList />} />
              <Route path="/maalems" element={<MaalemList />} />
              <Route path="/maalem/:slug" element={<MaalemDetail />} />
              <Route path="/suppliers" element={<Navigate to="/fournisseurs" replace />} />
              <Route path="/fournisseurs" element={<SupplierList />} />
              <Route path="/fournisseurs/:id" element={<SupplierDetail />} />
              <Route path="/signup-pro" element={<Navigate to="/inscription-pro" replace />} />
              <Route path="/prestataires" element={<PrestataireList />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cgu" element={<CGU />} />
            </Routes>
            <DevisModal />
            <ChatModal />
          </Router>
        </ModalProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
