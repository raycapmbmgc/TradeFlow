import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Inicio from './pages/Inicio'
import Dashboard from './pages/Dashboard'
import Trading from './pages/Trading'
import Carteira from './pages/Carteira'
import Ordens from './pages/Ordens'
import Extrato from './pages/Extrato'
import ProtectedRoute from './components/ProtectedRoute'

import { TradeProvider } from './context/TradeContext'

function App() {
  return (
    <TradeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trading"
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            }
          />

          <Route
            path="/carteira"
            element={
              <ProtectedRoute>
                <Carteira />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ordens"
            element={
              <ProtectedRoute>
                <Ordens />
              </ProtectedRoute>
            }
          />

          <Route
            path="/extrato"
            element={
              <ProtectedRoute>
                <Extrato />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TradeProvider>
  )
}

export default App