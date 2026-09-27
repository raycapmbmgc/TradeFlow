import { useState } from 'react'
import './Trading.css'

import PlatformNav from '../components/PlatformNav'
import { useTrade } from '../context/TradeContext'

function Trading() {
  const {
    ativos,
    carregando,
    erro,
    enviarOrdem,
    historicoAtivos,
    setHistoricoAtivos
  } = useTrade()

  const [ativoEscolhido, setAtivo] = useState(null)
  const [quantidade, setQuantidade] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  const ativo =
    ativoEscolhido ||
    historicoAtivos[historicoAtivos.length - 1]

  const ativoSelecionado = ativos[ativo]

  function selecionarAtivo(novoAtivo) {
    if (novoAtivo === ativo) {
      return
    }

    setAtivo(novoAtivo)

    setHistoricoAtivos((historicoAtual) => [
      ...historicoAtual,
      novoAtivo
    ])

    setMensagem('')
  }

  function voltarAnalise() {
    if (historicoAtivos.length <= 1) {
      return
    }

    const novoHistorico = historicoAtivos.slice(0, -1)
    const ativoAnterior = novoHistorico[novoHistorico.length - 1]

    setHistoricoAtivos(novoHistorico)
    setAtivo(ativoAnterior)
    setMensagem('')
  }

  function buscarAtivo(event) {
    event.preventDefault()

    const codigo = event.target.codigo.value.toUpperCase().trim()

    if (ativos[codigo]) {
      selecionarAtivo(codigo)
    } else {
      setMensagem('Ativo não encontrado.')
    }
  }

  async function realizarOrdem(tipo) {
    const quantidadeNumerica = Number(quantidade)

    if (!quantidade || quantidadeNumerica <= 0 || !Number.isInteger(quantidadeNumerica)) {
      setMensagem('Digite uma quantidade válida.')
      return
    }

    if (!ativoSelecionado) {
      setMensagem('Selecione um ativo.')
      return
    }

    const total = quantidadeNumerica * ativoSelecionado.preco

    setEnviando(true)
    setMensagem('')

    try {
      await enviarOrdem(
        ativoSelecionado.nome,
        tipo,
        quantidadeNumerica,
        ativoSelecionado.preco
      )

      setMensagem(
        `${tipo} enviada: ${quantidadeNumerica} unidade(s) de ${ativoSelecionado.nome} por R$ ${total
          .toFixed(2)
          .replace('.', ',')}.`
      )

      setQuantidade('')
    } catch (error) {
      setMensagem(error.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!ativoSelecionado) {
    let aviso = 'Carregando ativos...'

    if (!carregando && erro) {
      aviso = erro
    } else if (!carregando && Object.keys(ativos).length === 0) {
      aviso = 'Nenhum ativo recebido do back.'
    }

    return (
      <div className="trading">
        <header className="trading-header">
          <div className="trading-brand">
            <h1>
              Trade<span>Flow</span>
            </h1>
          </div>

          <PlatformNav />
        </header>

        <main className="trading-content">
          <p className="order-message">
            {aviso}
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="trading">
      <header className="trading-header">
        <div className="trading-brand">
          <h1>
            Trade<span>Flow</span>
          </h1>
        </div>

        <PlatformNav />
      </header>

      <main className="trading-content">
        <section className="available-markets">
          <div className="section-title">
            <h2>
              Mercados disponíveis
            </h2>

            <p>
              Confira alguns dos principais ativos disponíveis para negociação.
            </p>
          </div>

          <div className="market-list">
            {Object.values(ativos).map((item) => (
              <button
                key={item.nome}
                className={`market-item ${ativo === item.nome ? 'selected' : ''}`}
                onClick={() => selecionarAtivo(item.nome)}
              >
                <div className="market-item-info">
                  <strong>
                    {item.nome}
                  </strong>

                  <span>
                    {item.empresa}
                  </span>
                </div>

                <div className="market-item-value">
                  <strong>
                    R$ {item.preco.toFixed(2).replace('.', ',')}
                  </strong>

                  <span>
                    {item.variacao}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="asset-search">
          <h2>
            Buscar ativo
          </h2>

          <form onSubmit={buscarAtivo}>
            <input
              name="codigo"
              type="text"
              placeholder="Digite o código do ativo"
            />

            <button type="submit">
              Buscar
            </button>
          </form>
        </section>

        <section className="analysis-history">
          <div>
            <span>
              HISTÓRICO DE ANÁLISE
            </span>

            <p>
              {historicoAtivos.join(' → ')}
            </p>
          </div>

          <button
            onClick={voltarAnalise}
            disabled={historicoAtivos.length <= 1}
          >
            ← Voltar análise
          </button>
        </section>

        <section className="asset-info">
          <div>
            <span>
              Ativo
            </span>

            <strong>
              {ativoSelecionado.nome}
            </strong>
          </div>

          <div>
            <span>
              Preço
            </span>

            <strong>
              R$ {ativoSelecionado.preco.toFixed(2).replace('.', ',')}
            </strong>
          </div>

          <div>
            <span>
              Variação
            </span>

            <strong>
              {ativoSelecionado.variacao}
            </strong>
          </div>
        </section>

        <section className="order">
          <h2>
            Enviar ordem
          </h2>

          <label>
            Quantidade
          </label>

          <input
            type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={(event) => setQuantidade(event.target.value)}
            placeholder="Ex: 10"
          />

          <div className="order-buttons">
            <button
              className="buy-button"
              disabled={enviando}
              onClick={() => realizarOrdem('Compra')}
            >
              Comprar
            </button>

            <button
              className="sell-button"
              disabled={enviando}
              onClick={() => realizarOrdem('Venda')}
            >
              Vender
            </button>
          </div>

          {mensagem && (
            <p className="order-message">
              {mensagem}
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default Trading