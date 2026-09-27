import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Login.css'
import { api, salvarSessao } from '../api'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function entrar(event) {
    event.preventDefault()

    if (!email || !senha) {
      setMensagem('Preencha todos os campos.')
      return
    }

    setEnviando(true)
    setMensagem('')

    try {
      const { token, usuario } = await api.login(email, senha)

      salvarSessao(token, usuario || { email })

      window.location.href = '/inicio'
    } catch (error) {
      setMensagem(error.message)
      setEnviando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          Trade<span>Flow</span>
        </h1>

        <p className="login-subtitle">
          Entre na sua conta
        </p>

        <form onSubmit={entrar}>
          <label>
            E-mail
          </label>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>
            Senha
          </label>

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />

          {mensagem && (
            <p className="login-message">
              {mensagem}
            </p>
          )}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="register-link">
          Ainda não tem uma conta?{' '}

          <Link to="/cadastro">
            Cadastre-se
          </Link>
        </p>

        <Link
          to="/"
          className="back-home"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}

export default Login