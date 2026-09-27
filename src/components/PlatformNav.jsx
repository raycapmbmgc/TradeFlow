import { Link } from 'react-router-dom'
import './PlatformNav.css'
import { encerrarSessao } from '../api'

function PlatformNav() {
  function sair() {
    encerrarSessao()
    window.location.href = '/login'
  }

  return (
    <nav className="platform-nav">
      <Link to="/inicio">
        Início
      </Link>

      <Link to="/dashboard">
        Dashboard
      </Link>

      <Link to="/trading">
        Negociar
      </Link>

      <Link to="/carteira">
        Carteira
      </Link>

      <Link to="/ordens">
        Ordens
      </Link>

      <Link to="/extrato">
        Extrato
      </Link>

      <button
        className="logout-button"
        onClick={sair}
      >
        Sair
      </button>
    </nav>
  )
}

export default PlatformNav