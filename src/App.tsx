import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const TeachingsPage = lazy(() => import('./pages/TeachingsPage').then((module) => ({ default: module.TeachingsPage })));
const TeachingDetails = lazy(() => import('./pages/TeachingDetails').then((module) => ({ default: module.TeachingDetails })));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage').then((module) => ({ default: module.ProgramsPage })));
const ProgramDetails = lazy(() => import('./pages/ProgramDetails').then((module) => ({ default: module.ProgramDetails })));
const AskQuestion = lazy(() => import('./pages/AskQuestion').then((module) => ({ default: module.AskQuestion })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const TestimoniesPage = lazy(() => import('./pages/TestimoniesPage').then((module) => ({ default: module.TestimoniesPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((module) => ({ default: module.GalleryPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-navy-900 text-soft-white selection:bg-gold-500 selection:text-navy-900 relative overflow-hidden font-sans flex flex-col">
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      <Navigation />
      <main className="relative flex-col flex w-full flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center px-6">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-4">Loading</div>
                <p className="text-white/50 text-sm">Preparing the page...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/teachings" element={<TeachingsPage />} />
            <Route path="/teachings/:id" element={<TeachingDetails />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonies" element={<TestimoniesPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
