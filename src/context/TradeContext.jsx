import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { api, obterToken } from '../api'

const TradeContext = createContext()

export function TradeProvider({ children }) {
  const [ativos, setAtivos] = useState({})
  const [carteira, setCarteira] = useState({})
  const [ordens, setOrdens] = useState([])
  const [extrato, setExtrato] = useState([])

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [historicoAtivos, setHistoricoAtivos] = useState(['PETR4'])

  const carregarDados = useCallback(async () => {
    if (!obterToken()) {
      return
    }

    setCarregando(true)
    setErro('')

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

    if (resultadoAtivos.status === 'fulfilled') {
      const listaAtivos = resultadoAtivos.value
      const primeiroAtivo = Object.keys(listaAtivos)[0]

      setAtivos(listaAtivos)

      if (primeiroAtivo) {
        setHistoricoAtivos((atual) =>
          listaAtivos[atual[0]] ? atual : [primeiroAtivo]
        )
      }
    } else {
      setErro(resultadoAtivos.reason.message)
    }

    if (resultadoCarteira.status === 'fulfilled') {
      setCarteira(resultadoCarteira.value)
    } else {
      console.warn('Carteira:', resultadoCarteira.reason.message)
    }

    if (resultadoOrdens.status === 'fulfilled') {
      setOrdens(resultadoOrdens.value)
    } else {
      console.warn('Ordens:', resultadoOrdens.reason.message)
    }

    if (resultadoExtrato.status === 'fulfilled') {
      setExtrato(resultadoExtrato.value)
    } else {
      console.warn('Extrato:', resultadoExtrato.reason.message)
    }

    setCarregando(false)
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function enviarOrdem(ativo, tipo, quantidade, preco) {
    const resposta = await api.enviarOrdem(ativo, tipo, quantidade, preco)
    await carregarDados()
    return resposta
  }

  return (
    <TradeContext.Provider
      value={{
        ativos,
        carteira,
        ordens,
        extrato,
        carregando,
        erro,
        carregarDados,
        enviarOrdem,
        historicoAtivos,
        setHistoricoAtivos
      }}
    >
      {children}
    </TradeContext.Provider>
  )
}

export function useTrade() {
  return useContext(TradeContext)
}