import { Link } from 'react-router-dom'
import './Ordens.css'
import PlatformNav from '../components/PlatformNav'
import { useTrade } from '../context/TradeContext'

function Ordens() {
  const { ordens, ordensAbertas, executarFila } = useTrade()

  const handleExecute = async () => {
    try {
      await executarFila()
      alert('Fila de ordens executada com sucesso!')
    } catch (error) {
      alert('Erro ao executar a fila: ' + error.message)
    }
  }
  const historicoOrdens = ordens
    .filter((ordem) => String(ordem.status || '').toUpperCase() !== 'OPEN')
    .sort((a, b) => {
      const dataA = new Date(a.executadaEm || a.data)
      const dataB = new Date(b.executadaEm || b.data)
      return dataB - dataA
    })

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
        <section className="orders-section" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0 }}>Fila de Execução (OPEN)</h2>
            <button 
              className="trade-button" 
              onClick={handleExecute}
              style={{ border: 'none', cursor: 'pointer' }}
              disabled={ordensAbertas.length === 0}
            >
              Executar Fila
            </button>
          </div>

          {ordensAbertas.length === 0 ? (
            <div className="empty-orders" style={{ padding: '40px 20px' }}>
              <p>Nenhuma ordem aguardando execução na fila.</p>
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

              {ordensAbertas.map((ordem) => {
                const dataOrdem = new Date(ordem.data)
                return (
                  <div className="orders-table-row" key={ordem.id}>
                    <strong>{ordem.ativo}</strong>
                    <span style={{ color: '#f39c12' }}>{ordem.status}</span>
                    <span>{ordem.quantidade}</span>
                    <strong>R$ {ordem.total.toFixed(2).replace('.', ',')}</strong>
                    <span>{dataOrdem.toLocaleDateString('pt-BR')}</span>
                    <span>
                      {dataOrdem.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="orders-section">
          <h2 style={{ marginBottom: '24px' }}>Histórico de Ordens</h2>

          {historicoOrdens.length === 0 ? (
            <div className="empty-orders">
              <h3>Nenhum histórico disponível</h3>
              <p>Suas ordens executadas aparecerão aqui.</p>
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

              {historicoOrdens.map((ordem) => {
                const dataOrdem = new Date(ordem.executadaEm || ordem.data)
                const statusColor = String(ordem.status).toUpperCase() === 'EXECUTADA' ? '#00e676' : '#e74c3c'

                return (
                  <div className="orders-table-row" key={ordem.id}>
                    <strong>{ordem.ativo}</strong>
                    <span style={{ color: statusColor, fontWeight: '500' }}>{ordem.status}</span>
                    <span>{ordem.quantidade}</span>
                    <strong>R$ {ordem.total.toFixed(2).replace('.', ',')}</strong>
                    <span>{dataOrdem.toLocaleDateString('pt-BR')}</span>
                    <span>
                      {dataOrdem.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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