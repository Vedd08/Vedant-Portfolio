import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ExperiencePage from './pages/ExperiencePage';
import useViewTracker from './hooks/useViewTracker';

// Layout component for shared Navbar and Footer
function Layout({ children }) {
  useViewTracker(); // Track page views
  
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// Main Landing Page
function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/experience" element={<Layout><ExperiencePage /></Layout>} />
        <Route path="*" element={<Layout><HomePage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;