import './Carteira.css'
import { Link } from 'react-router-dom'
import { useTrade } from '../context/TradeContext'
import PlatformNav from '../components/PlatformNav'

function Carteira() {
  const { ativos, carteira } = useTrade()

  const ativosNaCarteira = Object.entries(carteira)

  const valorInvestido = ativosNaCarteira.reduce(
    (total, [codigo, quantidade]) => {
      const ativo = ativos[codigo]

      if (!ativo) {
        return total
      }

      return total + quantidade * ativo.preco
    },
    0
  )

  const quantidadeAtivos = Object.keys(carteira).length

  return (
    <div className="portfolio-page">
      <header className="portfolio-header">
        <div className="portfolio-brand">
          <h1>
            Trade<span>Flow</span>
          </h1>
        </div>

        <PlatformNav />
      </header>

      <main className="portfolio-content">
        <section className="portfolio-intro">
          <span>CARTEIRA</span>

          <h2>
            Meus investimentos
          </h2>

          <p>
            Acompanhe seus ativos, quantidades e valores investidos.
          </p>
        </section>

        <section className="portfolio-summary">
          <div className="summary-card">
            <span>
              Valor investido
            </span>

            <strong>
              R$ {valorInvestido.toFixed(2).replace('.', ',')}
            </strong>
          </div>

          <div className="summary-card">
            <span>
              Ativos na carteira
            </span>

            <strong>
              {quantidadeAtivos}
            </strong>
          </div>
        </section>

        <section className="portfolio-section">
          <div className="portfolio-section-title">
            <h2>
              Meus ativos
            </h2>

            <p>
              Ativos atualmente presentes na sua carteira.
            </p>
          </div>

          {ativosNaCarteira.length === 0 ? (
            <div className="empty-portfolio-page">
              <h3>
                Sua carteira está vazia
              </h3>

              <p>
                Você ainda não possui nenhum ativo.
              </p>

              <Link
                to="/trading"
                className="start-trading-button"
              >
                Começar a negociar
              </Link>
            </div>
          ) : (
            <div className="portfolio-table">
              <div className="portfolio-table-header">
                <span>Ativo</span>
                <span>Empresa</span>
                <span>Quantidade</span>
                <span>Preço atual</span>
                <span>Variação</span>
                <span>Valor total</span>
              </div>

              {ativosNaCarteira.map(([codigo, quantidade]) => {
                const ativo = ativos[codigo]

                if (!ativo) {
                  return null
                }

                const valorTotal = quantidade * ativo.preco

                return (
                  <div
                    className="portfolio-table-row"
                    key={codigo}
                  >
                    <strong>
                      {codigo}
                    </strong>

                    <span>
                      {ativo.empresa}
                    </span>

                    <span>
                      {quantidade}
                    </span>

                    <span>
                      R$ {ativo.preco.toFixed(2).replace('.', ',')}
                    </span>

                    <span
                      className={
                        ativo.variacao.startsWith('-')
                          ? 'negative'
                          : 'positive'
                      }
                    >
                      {ativo.variacao}
                    </span>

                    <strong>
                      R$ {valorTotal.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Carteira