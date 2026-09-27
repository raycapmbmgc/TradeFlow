import './Dashboard.css'
import PlatformNav from '../components/PlatformNav'
import { useTrade } from '../context/TradeContext'

function Dashboard() {
  const { ativos, carteira } = useTrade()

  const valorInvestido = Object.entries(carteira).reduce(
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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1>
            Trade<span>Flow</span>
          </h1>
        </div>

        <PlatformNav />
      </header>

      <main className="dashboard-content">
        <section className="dashboard-intro">
          <span>VISÃO GERAL</span>

          <h2>
            Sua carteira
          </h2>

          <p>
            Acompanhe seus investimentos e os principais ativos do mercado.
          </p>
        </section>

        <section className="summary">
          <div className="summary-card">
            <span>
              Ativos na carteira
            </span>

            <strong>
              {quantidadeAtivos}
            </strong>
          </div>

          <div className="summary-card">
            <span>Valor investido</span>

            <strong>
              R$ {valorInvestido.toFixed(2).replace('.', ',')}
            </strong>
          </div>
        </section>

        <section className="assets">
          <div className="assets-title">
            <div>
              <h2>Mercados disponíveis</h2>

              <p>
                Confira os principais ativos disponíveis para negociação.
              </p>
            </div>
          </div>

          <div className="assets-table">
            <div className="assets-header">
              <span>Ativo</span>
              <span>Empresa</span>
              <span>Preço</span>
              <span>Variação</span>
            </div>

            {Object.entries(ativos).map(([codigo, ativo]) => (
              <div
                className="asset-row"
                key={codigo}
              >
                <div className="asset-name">
                  <strong>
                    {codigo}
                  </strong>
                </div>

                <span>
                  {ativo.empresa}
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
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard