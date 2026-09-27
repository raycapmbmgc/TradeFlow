import './Extrato.css'

import PlatformNav from '../components/PlatformNav'
import { useTrade } from '../context/TradeContext'

function Extrato() {
  const { extrato } = useTrade()

  const movimentacoes = [...extrato].reverse()

  function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="extrato">
      <header className="extrato-header">
        <div className="extrato-brand">
          <h1>
            Trade<span>Flow</span>
          </h1>
        </div>

        <PlatformNav />
      </header>

      <main className="extrato-content">
        <section className="extrato-intro">
          <span>
            MOVIMENTAÇÕES
          </span>

          <h2>
            Extrato
          </h2>

          <p>
            Consulte todas as compras e vendas
            realizadas na sua conta TradeFlow.
          </p>
        </section>

        <section className="extrato-table-section">
          {movimentacoes.length === 0 ? (
            <div className="extrato-empty">
              <strong>
                Nenhuma movimentação registrada
              </strong>

              <p>
                Quando você comprar ou vender ativos,
                as movimentações aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="extrato-table">
              <div className="extrato-row extrato-header-row">
                <span>Data</span>
                <span>Tipo</span>
                <span>Descrição</span>
                <span>Valor</span>
              </div>

              {movimentacoes.map((movimentacao) => (
                <div
                  className="extrato-row"
                  key={movimentacao.id}
                >
                  <span>
                    {formatarData(movimentacao.data)}
                  </span>

                  <span>
                    {movimentacao.tipo}
                  </span>

                  <span>
                    {movimentacao.descricao}
                  </span>

                  <span
                    className={
                      movimentacao.valor >= 0
                        ? 'positive'
                        : 'negative'
                    }
                  >
                    {movimentacao.valor >= 0 ? '+' : '-'}
                    {' '}
                    R$ {Math.abs(movimentacao.valor).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Extrato