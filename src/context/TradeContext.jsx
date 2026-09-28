import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  api,
  obterToken
} from '../api'

const TradeContext =
  createContext()

export function TradeProvider({
  children
}) {
  const [ativos, setAtivos] =
    useState({})

  const [carteira, setCarteira] =
    useState({})

  const [ordens, setOrdens] =
    useState([])

  const [extrato, setExtrato] =
    useState([])

  const [carregando, setCarregando] =
    useState(false)

  const [erro, setErro] =
    useState('')

  const [
    historicoAtivos,
    setHistoricoAtivos
  ] = useState(['PETR4'])

  const carregarDados =
    useCallback(async () => {
      if (!obterToken()) {
        return
      }

      setCarregando(true)
      setErro('')

      try {
        const [
          resultadoAtivos,
          resultadoCarteira,
          resultadoOrdens,
          resultadoExtrato
        ] = await Promise.allSettled([
          api.listarAtivos(),
          api.buscarCarteira(),
          api.listarOrdens(),
          api.listarExtrato()
        ])

        if (
          resultadoAtivos.status ===
          'fulfilled'
        ) {
          const listaAtivos =
            resultadoAtivos.value

          const primeiroAtivo =
            Object.keys(
              listaAtivos
            )[0]

          setAtivos(
            listaAtivos
          )

          if (primeiroAtivo) {
            setHistoricoAtivos(
              (atual) =>
                listaAtivos[
                  atual[0]
                ]
                  ? atual
                  : [primeiroAtivo]
            )
          }
        } else {
          setErro(
            resultadoAtivos
              .reason?.message ||
              'Não foi possível carregar os ativos.'
          )
        }

        if (
          resultadoCarteira.status ===
          'fulfilled'
        ) {
          setCarteira(
            resultadoCarteira.value
          )
        } else {
          console.warn(
            'Carteira:',
            resultadoCarteira
              .reason?.message
          )
        }

        if (
          resultadoOrdens.status ===
          'fulfilled'
        ) {
          setOrdens(
            resultadoOrdens.value
          )
        } else {
          console.warn(
            'Ordens:',
            resultadoOrdens
              .reason?.message
          )
        }

        if (
          resultadoExtrato.status ===
          'fulfilled'
        ) {
          setExtrato(
            resultadoExtrato.value
          )
        } else {
          console.warn(
            'Extrato:',
            resultadoExtrato
              .reason?.message
          )
        }
      } finally {
        setCarregando(false)
      }
    }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  /*
   * Cria uma nova ordem.
   *
   * A ordem NÃO é executada aqui.
   *
   * Depois de criada:
   *
   * aberta
   *    ↓
   * fila
   *    ↓
   * executor
   */
  async function enviarOrdem(
    ativo,
    tipo,
    quantidade,
    preco
  ) {
    const resposta =
      await api.enviarOrdem(
        ativo,
        tipo,
        quantidade,
        preco
      )

    await carregarDados()

    return resposta
  }

  /*
   * Executa a fila.
   *
   * O backend é responsável por
   * selecionar a ordem correta
   * e executar respeitando o FIFO.
   */
  async function executarFila() {
    const resposta =
      await api.executarFila()

    await carregarDados()

    return resposta
  }

  async function pesquisarAtivos(
    query
  ) {
    const termo = String(
      query || ''
    ).trim()

    if (!termo) {
      return []
    }

    try {
      return await api.pesquisarAtivos(
        termo
      )
    } catch (error) {
      console.error(
        'Erro ao pesquisar ativos:',
        error
      )

      throw error
    }
  }

  /*
   * Ordens que ainda estão abertas.
   *
   * Ordenadas da mais antiga
   * para a mais recente.
   *
   * Isso permite visualizar
   * a fila em ordem FIFO.
   */
  const ordensAbertas =
    [...ordens]
      .filter(
        (ordem) =>
          String(
            ordem.status || ''
          ).toLowerCase() ===
          'aberta'
      )
      .sort(
        (a, b) =>
          new Date(a.data) -
          new Date(b.data)
      )

  /*
   * Histórico de ordens executadas.
   */
  const ordensExecutadas =
    [...ordens]
      .filter(
        (ordem) =>
          String(
            ordem.status || ''
          ).toLowerCase() ===
          'executada'
      )
      .sort(
        (a, b) =>
          new Date(b.data) -
          new Date(a.data)
      )

  return (
    <TradeContext.Provider
      value={{
        ativos,
        carteira,
        ordens,
        ordensAbertas,
        ordensExecutadas,
        extrato,
        carregando,
        erro,

        carregarDados,

        enviarOrdem,

        executarFila,

        pesquisarAtivos,

        historicoAtivos,
        setHistoricoAtivos
      }}
    >
      {children}
    </TradeContext.Provider>
  )
}

export function useTrade() {
  return useContext(
    TradeContext
  )
}