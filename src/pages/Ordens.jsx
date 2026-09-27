import { Link } from 'react-router-dom'
import './Ordens.css'
import PlatformNav from '../components/PlatformNav'
import { useTrade } from '../context/TradeContext'

function Ordens() {
  const { ordens } = useTrade()

  return (
    <div className="orders-page">
      <header className="orders-header">
        <div className="orders-brand">
          <h1>
            Trade<span>Flow</span>
          </h1>
        </div>

        <PlatformNav />
      </header>

      <main className="orders-content">
        <section className="orders-section">
          <h2>Minhas ordens</h2>

          {ordens.length === 0 ? (
            <div className="empty-orders">
              <h3>Nenhuma ordem realizada</h3>

              <p>
                Suas compras e vendas aparecerão aqui.
              </p>

              <Link
                to="/trading"
                className="start-trading-button"
              >
                Começar a negociar
              </Link>
            </div>
          ) : (
            <div className="orders-table">
              <div className="orders-table-header">
                <span>Ativo</span>
                <span>Tipo</span>
                <span>Quantidade</span>
                <span>Valor</span>
                <span>Data</span>
                <span>Hora</span>
              </div>

              {ordens.map((ordem) => {
                const dataOrdem = new Date(ordem.data)

                return (
                  <div
                    className="orders-table-row"
                    key={ordem.id}
                  >
                    <strong>
                      {ordem.ativo}
                    </strong>

                    <span>
                      {ordem.tipo}
                    </span>

                    <span>
                      {ordem.quantidade}
                    </span>

                    <strong>
                      R$ {ordem.total.toFixed(2).replace('.', ',')}
                    </strong>

                    <span>
                      {dataOrdem.toLocaleDateString('pt-BR')}
                    </span>

                    <span>
                      {dataOrdem.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
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

export default Ordens