import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'
import Recipes from './pages/Recipes'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router>
            <div className="app">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tarihce" element={<History />} />
                <Route path="/tarifler" element={<Recipes />} />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
