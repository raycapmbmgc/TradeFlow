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
    pesquisarAtivos,
    historicoAtivos,
    setHistoricoAtivos
  } = useTrade()

  const [ativoEscolhido, setAtivo] = useState(null)
  const [ativoPesquisado, setAtivoPesquisado] = useState(null)

  const [quantidade, setQuantidade] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [resultadosPesquisa, setResultadosPesquisa] = useState([])
  const [pesquisando, setPesquisando] = useState(false)
  const [termoPesquisa, setTermoPesquisa] = useState('')

  const ativo =
    ativoEscolhido ||
    historicoAtivos[historicoAtivos.length - 1]

  const ativoSelecionado =
    ativoPesquisado && ativoPesquisado.stock === ativo
      ? ativoPesquisado
      : ativos[ativo]

  function selecionarAtivo(novoAtivo) {
    if (novoAtivo === ativo) {
      return
    }

    setAtivo(novoAtivo)
    setAtivoPesquisado(null)

    setHistoricoAtivos((historicoAtual) => [
      ...historicoAtual,
      novoAtivo
    ])

    setMensagem('')
  }

  function selecionarResultado(resultado) {
    const ticker = resultado.stock

    if (!ticker) {
      return
    }

    setAtivo(ticker)
    setAtivoPesquisado(resultado)

    setHistoricoAtivos((historicoAtual) => {
      if (
        historicoAtual[
          historicoAtual.length - 1
        ] === ticker
      ) {
        return historicoAtual
      }

      return [
        ...historicoAtual,
        ticker
      ]
    })

    setResultadosPesquisa([])
    setMensagem('')
  }

  function voltarAnalise() {
    if (historicoAtivos.length <= 1) {
      return
    }

    const novoHistorico =
      historicoAtivos.slice(0, -1)

    const ativoAnterior =
      novoHistorico[
        novoHistorico.length - 1
      ]

    setHistoricoAtivos(novoHistorico)
    setAtivo(ativoAnterior)

    setAtivoPesquisado(null)
    setMensagem('')
  }

  async function buscarAtivo(event) {
    event.preventDefault()

    const termo = termoPesquisa.trim()

    if (!termo) {
      setResultadosPesquisa([])
      setMensagem('Digite o nome ou código de um ativo.')
      return
    }

    setPesquisando(true)
    setMensagem('')
    setResultadosPesquisa([])

    try {
      const resultados =
        await pesquisarAtivos(termo)

      setResultadosPesquisa(resultados)

      if (!resultados.length) {
        setMensagem(
          `Nenhum ativo encontrado para "${termo}".`
        )
      }
    } catch (error) {
      console.error(
        'Erro na pesquisa:',
        error
      )

      setMensagem(
        error.message ||
          'Não foi possível pesquisar o ativo.'
      )
    } finally {
      setPesquisando(false)
    }
  }

  async function realizarOrdem(tipo) {
    const quantidadeNumerica =
      Number(quantidade)

    if (
      !quantidade ||
      quantidadeNumerica <= 0 ||
      !Number.isInteger(
        quantidadeNumerica
      )
    ) {
      setMensagem(
        'Digite uma quantidade válida.'
      )
      return
    }

    if (!ativoSelecionado) {
      setMensagem(
        'Selecione um ativo.'
      )
      return
    }

    const preco =
      Number(
        ativoSelecionado.close ??
        ativoSelecionado.preco ??
        0
      )

    if (preco <= 0) {
      setMensagem(
        'O preço deste ativo não está disponível.'
      )
      return
    }

    const ticker =
      ativoSelecionado.stock ||
      ativoSelecionado.nome

    const total =
      quantidadeNumerica * preco

    setEnviando(true)
    setMensagem('')

    try {
      await enviarOrdem(
        ticker,
        tipo,
        quantidadeNumerica,
        preco
      )

      setMensagem(
        `${tipo} enviada: ${quantidadeNumerica} unidade(s) de ${ticker} por R$ ${total
          .toFixed(2)
          .replace('.', ',')}.`
      )

      setQuantidade('')
    } catch (error) {
      setMensagem(
        error.message ||
          'Não foi possível enviar a ordem.'
      )
    } finally {
      setEnviando(false)
    }
  }

  if (!ativoSelecionado) {
    let aviso = 'Carregando ativos...'

    if (!carregando && erro) {
      aviso = erro
    } else if (
      !carregando &&
      Object.keys(ativos).length === 0
    ) {
      aviso =
        'Nenhum ativo recebido do back.'
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

  const precoAtual =
    Number(
      ativoSelecionado.close ??
      ativoSelecionado.preco ??
      0
    )

  const variacaoAtual =
    ativoSelecionado.variacao ||
    '0,00%'

  const nomeAtivo =
    ativoSelecionado.stock ||
    ativoSelecionado.nome

  const empresaAtivo =
    ativoSelecionado.name ||
    ativoSelecionado.empresa ||
    ''

  const setorAtivo =
    ativoSelecionado.sector ||
    ''

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

        {/* MERCADOS DISPONÍVEIS */}
        <section className="available-markets">
          <div className="section-title">
            <h2>
              Mercados disponíveis
            </h2>

            <p>
              Confira alguns dos principais
              ativos disponíveis para negociação.
            </p>
          </div>

          <div className="market-list">
            {Object.values(ativos).map(
              (item) => (
                <button
                  key={item.nome}
                  className={`market-item ${
                    ativo === item.nome
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    selecionarAtivo(
                      item.nome
                    )
                  }
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
                      R${' '}
                      {item.preco
                        .toFixed(2)
                        .replace(
                          '.',
                          ','
                        )}
                    </strong>

                    <span>
                      {item.variacao}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        </section>

        {/* PESQUISA */}
        <section className="asset-search">
          <h2>
            Buscar ativo
          </h2>

          <p>
            Pesquise pelo código ou pelo nome
            da empresa.
          </p>

          <form
            onSubmit={buscarAtivo}
          >
            <input
              name="codigo"
              type="text"
              value={termoPesquisa}
              onChange={(event) =>
                setTermoPesquisa(
                  event.target.value
                )
              }
              placeholder="Ex: BBAS3 ou Banco do Brasil"
            />

            <button
              type="submit"
              disabled={pesquisando}
            >
              {pesquisando
                ? 'Pesquisando...'
                : 'Buscar'}
            </button>
          </form>

          {/* RESULTADOS DA PESQUISA */}
          {resultadosPesquisa.length > 0 && (
            <div className="search-results">
              {resultadosPesquisa.map(
                (resultado, index) => (
                  <button
                    type="button"
                    className="search-result"
                    key={`${resultado.stock}-${index}`}
                    onClick={() =>
                      selecionarResultado(
                        resultado
                      )
                    }
                  >
                    <div className="search-result-left">
                      {resultado.logo ? (
                        <img
                          src={
                            resultado.logo
                          }
                          alt={
                            resultado.name ||
                            resultado.stock
                          }
                          className="asset-logo"
                        />
                      ) : (
                        <div className="asset-logo-placeholder">
                          {resultado.stock?.charAt(
                            0
                          )}
                        </div>
                      )}

                      <div>
                        <strong>
                          {resultado.stock}
                        </strong>

                        <span>
                          {resultado.name}
                        </span>

                        {resultado.sector && (
                          <small>
                            {
                              resultado.sector
                            }
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="search-result-price">
                      <strong>
                        R${' '}
                        {Number(
                          resultado.close || 0
                        )
                          .toFixed(2)
                          .replace(
                            '.',
                            ','
                          )}
                      </strong>

                      <span>
                        Selecionar →
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* HISTÓRICO */}
        <section className="analysis-history">
          <div>
            <span>
              HISTÓRICO DE ANÁLISE
            </span>

            <p>
              {historicoAtivos.join(
                ' → '
              )}
            </p>
          </div>

          <button
            onClick={voltarAnalise}
            disabled={
              historicoAtivos.length <= 1
            }
          >
            ← Voltar análise
          </button>
        </section>

        {/* INFORMAÇÕES DO ATIVO */}
        <section className="asset-info">

          <div>
            <span>
              Ativo
            </span>

            <strong>
              {nomeAtivo}
            </strong>
          </div>

          <div>
            <span>
              Empresa
            </span>

            <strong>
              {empresaAtivo}
            </strong>
          </div>

          <div>
            <span>
              Preço
            </span>

            <strong>
              R${' '}
              {precoAtual
                .toFixed(2)
                .replace(
                  '.',
                  ','
                )}
            </strong>
          </div>

          <div>
            <span>
              Setor
            </span>

            <strong>
              {setorAtivo || '—'}
            </strong>
          </div>

          <div>
            <span>
              Variação
            </span>

            <strong>
              {variacaoAtual}
            </strong>
          </div>

        </section>

        {/* ENVIO DE ORDEM */}
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
            onChange={(event) =>
              setQuantidade(
                event.target.value
              )
            }
            placeholder="Ex: 10"
          />

          <div className="order-buttons">
            <button
              className="buy-button"
              disabled={enviando}
              onClick={() =>
                realizarOrdem(
                  'Compra'
                )
              }
            >
              {enviando
                ? 'Enviando...'
                : 'Comprar'}
            </button>

            <button
              className="sell-button"
              disabled={enviando}
              onClick={() =>
                realizarOrdem(
                  'Venda'
                )
              }
            >
              {enviando
                ? 'Enviando...'
                : 'Vender'}
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