import { Link } from 'react-router-dom'
import './Ordens.css'
import PlatformNav from '../components/PlatformNav'
import { useTrade } from '../context/TradeContext'

function Ordens() {
  // Puxando ordensAbertas e executarFila do Context
  const { ordensAbertas, executarFila } = useTrade()

  const handleExecute = async () => {
    try {
      await executarFila()
      alert('Fila de ordens executada com sucesso!')
    } catch (error) {
      alert('Erro ao executar a fila: ' + error.message)
    }
  }

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
          
          {/* Header da Seção com o Botão Execute */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0 }}>Minhas ordens (OPEN)</h2>
            <button 
              className="trade-button" 
              onClick={handleExecute}
              style={{ border: 'none', cursor: 'pointer' }}
              disabled={ordensAbertas.length === 0}
            >
              Execute
            </button>
          </div>

          {ordensAbertas.length === 0 ? (
            <div className="empty-orders">
              <h3>Nenhuma ordem aberta na fila</h3>

              <p>Suas novas ordens de compra e venda aparecerão aqui aguardando execução.</p>

              <Link to="/trading" className="start-trading-button">
                Começar a negociar
              </Link>
            </div>
          ) : (
            <div className="orders-table">
              <div className="orders-table-header">
                <span>Ativo</span>
                <span>STATUS</span>
                <span>Quantidade</span>
                <span>Valor</span>
                <span>Data</span>
                <span>Hora</span>
              </div>

              {/* Trocado 'ordens' por 'ordensAbertas' */}
              {ordensAbertas.map((ordem) => {
                const dataOrdem = new Date(ordem.data)

                return (
                  <div className="orders-table-row" key={ordem.id}>
                    <strong>{ordem.ativo}</strong>
                    <span>{ordem.status}</span>
                    <span>{ordem.quantidade}</span>
                    <strong>R$ {ordem.total.toFixed(2).replace('.', ',')}</strong>
                    <span>{dataOrdem.toLocaleDateString('pt-BR')}</span>
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