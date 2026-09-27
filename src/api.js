export const ROTAS = {
  login: '/api/auth/login',
  cadastro: '/api/auth/register',
  perfil: '/api/users/profile',
  ativos: '/api/assets',
  buscarAtivo: '/api/assets/search',
  carteira: '/api/wallets/portfolio',
  criarCarteira: '/api/wallets',
  ordens: '/api/orders',
  executarFila: '/api/orders/execute-queue',
  extrato: '/api/transactions'
}

export const SALDO_INICIAL = 10000

export const ATIVOS_PADRAO = [
  { ticker: 'PETR4', name: 'Petrobras', price: 38.42, variation: 1.25 },
  { ticker: 'VALE3', name: 'Vale', price: 62.18, variation: 0.84 },
  { ticker: 'ITUB4', name: 'Itaú Unibanco', price: 36.75, variation: 0.52 },
  { ticker: 'BBAS3', name: 'Banco do Brasil', price: 28.9, variation: -0.31 }
]

export const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://tradeflow-backend-7l4b.onrender.com'
).replace(/\/+$/, '')

export function salvarSessao(token, usuario) {
  localStorage.setItem('token', token)
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
}

export function obterToken() {
  return localStorage.getItem('token')
}

export function obterUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem('usuarioLogado'))
  } catch {
    return null
  }
}

export function encerrarSessao() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuarioLogado')
}

async function requisicao(caminho, { metodo = 'GET', corpo, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const tokenUsado = token || obterToken()

  if (tokenUsado) {
    headers.Authorization = `Bearer ${tokenUsado}`
  }

  let resposta

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined
    })
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. ' +
      'Se o back estava parado, aguarde alguns segundos e tente de novo.'
    )
  }

  const texto = await resposta.text()

  let dados = null

  try {
    dados = texto ? JSON.parse(texto) : null
  } catch {
    dados = texto
  }

  if (resposta.status === 401 && obterToken()) {
    encerrarSessao()
    window.location.href = '/login'
  }

  if (!resposta.ok) {
    let mensagem = ''

    if (typeof dados === 'string') {
      mensagem = dados
    } else if (dados) {
      mensagem = dados.erro || dados.mensagem || dados.message || dados.error
    }

    if (resposta.status === 403 && !mensagem) {
      mensagem = 'Acesso negado pelo servidor.'
    }

    const erro = new Error(mensagem || `Erro ${resposta.status} ao acessar o servidor.`)
    erro.status = resposta.status
    throw erro
  }

  return dados
}

let cadastroDeAtivos = null

async function cadastrarAtivosPadrao() {
  const criados = []

  for (const ativo of ATIVOS_PADRAO) {
    const dados = { ...ativo }

    try {
      const resultado = await requisicao(
        `${ROTAS.buscarAtivo}?query=${encodeURIComponent(ativo.ticker)}`
      )
      const encontrado = (resultado || []).find((item) => item.stock === ativo.ticker)

      if (encontrado && Number(encontrado.close) > 0) {
        dados.price = Number(encontrado.close)
      }
    } catch (error) {
      console.warn(`Brapi indisponível para ${ativo.ticker}:`, error.message)
    }

    try {
      criados.push(await requisicao(ROTAS.ativos, { metodo: 'POST', corpo: dados }))
    } catch (error) {
      console.warn(`Não foi possível cadastrar ${ativo.ticker}:`, error.message)
    }
  }

  if (criados.length === 0) {
    throw new Error('Nenhum ativo cadastrado no back e não foi possível cadastrar os ativos padrão.')
  }

  return criados
}

const TIPOS = {
  BUY: 'Compra',
  SELL: 'Venda'
}

function formatarVariacao(variacao) {
  const numero = Number(variacao ?? 0)
  const sinal = numero >= 0 ? '+' : ''
  return `${sinal}${numero.toFixed(2).replace('.', ',')}%`
}

function adaptarAtivos(lista) {
  return (lista || []).reduce((mapa, item) => {
    mapa[item.ticker] = {
      nome: item.ticker,
      empresa: item.name || '',
      preco: Number(item.price ?? 0),
      variacao: formatarVariacao(item.variation)
    }
    return mapa
  }, {})
}

function adaptarCarteira(portfolio) {
  return (portfolio?.items || []).reduce((mapa, item) => {
    if (Number(item.quantity) > 0) {
      mapa[item.ticker] = Number(item.quantity)
    }
    return mapa
  }, {})
}

function adaptarOrdem(ordem) {
  const quantidade = Number(ordem.quantity ?? 0)
  const preco = Number(ordem.price ?? 0)

  return {
    id: ordem.id,
    usuarioId: ordem.userId,
    ativo: ordem.assetTicker,
    tipo: TIPOS[ordem.type] || ordem.type,
    quantidade,
    total: quantidade * preco,
    status: ordem.status,
    data: ordem.createdAt
  }
}

function adaptarTransacao(transacao) {
  const quantidade = Number(transacao.quantity ?? 0)
  const preco = Number(transacao.price ?? 0)
  const total = quantidade * preco
  const tipo = TIPOS[transacao.type] || transacao.type

  return {
    id: transacao.id,
    tipo,
    descricao: `${transacao.assetTicker} — ${quantidade} unidade(s)`,
    valor: transacao.type === 'BUY' ? -total : total,
    data: transacao.executedAt
  }
}

export const api = {
  async login(email, senha) {
    let resposta

    try {
      resposta = await requisicao(ROTAS.login, {
        metodo: 'POST',
        corpo: { email, password: senha }
      })
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        throw new Error('E-mail ou senha incorretos.')
      }
      throw error
    }

    const token = resposta?.token

    if (!token) {
      throw new Error('O servidor não devolveu o token de acesso.')
    }

    let usuario = { email }

    try {
      const perfil = await requisicao(ROTAS.perfil, { token })
      usuario = { id: perfil.id, nome: perfil.name, email: perfil.email }
    } catch {
      usuario = { email }
    }

    return { token, usuario }
  },

  cadastrar(nome, email, documento, senha) {
    return requisicao(ROTAS.cadastro, {
      metodo: 'POST',
      corpo: { name: nome, email, document: documento, password: senha }
    })
  },

  async listarAtivos() {
    const lista = await requisicao(ROTAS.ativos)

    if (Array.isArray(lista) && lista.length > 0) {
      return adaptarAtivos(lista)
    }

    if (!cadastroDeAtivos) {
      cadastroDeAtivos = cadastrarAtivosPadrao().finally(() => {
        cadastroDeAtivos = null
      })
    }

    await cadastroDeAtivos

    return adaptarAtivos(await requisicao(ROTAS.ativos))
  },

  async buscarCarteira() {
    try {
      return adaptarCarteira(await requisicao(ROTAS.carteira))
    } catch (error) {
      if (error.status !== 400) {
        throw error
      }

      let usuarioId = obterUsuarioLogado()?.id

      if (!usuarioId) {
        const perfil = await requisicao(ROTAS.perfil)
        usuarioId = perfil.id
        localStorage.setItem(
          'usuarioLogado',
          JSON.stringify({ id: perfil.id, nome: perfil.name, email: perfil.email })
        )
      }

      const chave = `carteiraCriada_${usuarioId}`

      if (localStorage.getItem(chave)) {
        throw error
      }

      localStorage.setItem(chave, 'sim')

      await requisicao(ROTAS.criarCarteira, {
        metodo: 'POST',
        corpo: { userId: usuarioId, availableBalance: SALDO_INICIAL }
      })

      return adaptarCarteira(await requisicao(ROTAS.carteira))
    }
  },

  async listarOrdens() {
    const ordens = ((await requisicao(ROTAS.ordens)) || []).map(adaptarOrdem)
    const usuarioId = obterUsuarioLogado()?.id

    if (!usuarioId) {
      return ordens
    }

    return ordens.filter((ordem) => !ordem.usuarioId || ordem.usuarioId === usuarioId)
  },

  async listarExtrato() {
    return ((await requisicao(ROTAS.extrato)) || []).map(adaptarTransacao)
  },

  async enviarOrdem(ativo, tipo, quantidade, preco) {
    const ordem = await requisicao(ROTAS.ordens, {
      metodo: 'POST',
      corpo: {
        assetTicker: ativo,
        type: tipo === 'Compra' ? 'BUY' : 'SELL',
        quantity: quantidade,
        price: preco
      }
    })

    try {
      await requisicao(ROTAS.executarFila, { metodo: 'POST' })
    } catch (error) {
      console.warn('Não foi possível executar a fila de ordens:', error.message)
    }

    return ordem
  }
}