import { Link } from 'react-router-dom'
import './Inicio.css'

import { useTrade } from '../context/TradeContext'
import { obterUsuarioLogado } from '../api'
import PlatformNav from '../components/PlatformNav'

function Inicio() {
  const { carteira } = useTrade()

  const usuarioSalvo = obterUsuarioLogado()
  const nomeUsuario = usuarioSalvo?.nome || 'investidor'
  const quantidadeAtivos = Object.keys(carteira).length

  return (
    <div className="platform-home">
      <header className="platform-header">
        <div className="platform-brand">
          <h1>
            Trade<span>Flow</span>
          </h1>
        </div>

        <PlatformNav />
      </header>

      <main className="platform-content">
        <section className="welcome-section">
          <div className="welcome-content">
            <span className="welcome-label">
              HOME BROKER
            </span>

            <h2>
              Olá, {nomeUsuario}!
            </h2>

            <p>
              Acompanhe seus investimentos,
              consulte seus ativos e realize
              suas operações em um só lugar.
            </p>
          </div>
        </section>

        <section className="platform-summary">
          <div className="platform-card">
            <span>
              Ativos na carteira
            </span>

            <strong>
              {quantidadeAtivos}
            </strong>

            <small>
              Ativos em sua carteira
            </small>
          </div>

          <div className="platform-card">
            <span>
              Status da conta
            </span>

            <strong className="status">
              Ativa
            </strong>

            <small>
              Conta TradeFlow
            </small>
          </div>
        </section>

        <section className="platform-actions">
          <div className="section-title">
            <span>
              PLATAFORMA
            </span>

            <h2>
              O que você deseja fazer?
            </h2>
          </div>

          <div className="action-cards">
            <Link
              to="/trading"
              className="action-card"
            >
              <div className="action-icon">
                ↗
              </div>

              <strong>
                Negociar
              </strong>

              <span>
                Compre ou venda ativos
                diretamente pela plataforma.
              </span>

              <div className="action-arrow">
                →
              </div>
            </Link>

            <Link
              to="/carteira"
              className="action-card"
            >
              <div className="action-icon">
                ◫
              </div>

              <strong>
                Minha carteira
              </strong>

              <span>
                Consulte seus ativos,
                quantidades e patrimônio.
              </span>

              <div className="action-arrow">
                →
              </div>
            </Link>

            <Link
              to="/ordens"
              className="action-card"
            >
              <div className="action-icon">
                ⇄
              </div>

              <strong>
                Minhas ordens
              </strong>

              <span>
                Acompanhe suas compras
                e vendas realizadas.
              </span>

              <div className="action-arrow">
                →
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Inicio