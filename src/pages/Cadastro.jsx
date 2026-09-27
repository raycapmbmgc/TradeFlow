import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Cadastro.css'
import { api } from '../api'

function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function cadastrar(event) {
    event.preventDefault()

    if (!nome || !email || !cpf || !senha || !confirmarSenha) {
      setMensagem('Preencha todos os campos.')
      return
    }

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.')
      return
    }

    setEnviando(true)
    setMensagem('')

    try {
      await api.cadastrar(nome, email, cpf.trim(), senha)

      setMensagem('Cadastro realizado com sucesso!')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (error) {
      setMensagem(error.message)
      setEnviando(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>
          Trade<span>Flow</span>
        </h1>

        <p className="register-subtitle">
          Crie sua conta
        </p>

        <form onSubmit={cadastrar}>
          <label>
            Nome
          </label>

          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />

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
            CPF
          </label>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Digite seu CPF"
            value={cpf}
            onChange={(event) => setCpf(event.target.value)}
          />

          <label>
            Senha
          </label>

          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />

          <label>
            Confirmar senha
          </label>

          <input
            type="password"
            placeholder="Digite a senha novamente"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
          />

          {mensagem && (
            <p className="register-message">
              {mensagem}
            </p>
          )}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="login-link">
          Já possui uma conta?{' '}

          <Link to="/login">
            Entrar
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

export default Cadastro