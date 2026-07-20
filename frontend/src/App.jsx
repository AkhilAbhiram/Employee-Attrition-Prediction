import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import About from './pages/About';
import Navbar from './components/Navbar';
import { PredictionProvider } from './context/PredictionContext';

export default function App() {
  return (
    <PredictionProvider>
      <BrowserRouter>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 20px 60px 20px" }}>
          {/* Render Navbar on top of every page */}
          <Navbar />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </PredictionProvider>
  );
}
