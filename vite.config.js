import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const URL_PADRAO = 'https://tradeflow-backend-7l4b.onrender.com'

function statusDoBack(url) {
  return {
    name: 'status-do-back',
    apply: 'serve',
    configureServer(server) {
      server.httpServer?.once('listening', async () => {
        console.log(`\n  Conectando com o back (${url})...`)

        try {
          const resposta = await fetch(url, { signal: AbortSignal.timeout(60000) })
          console.log(`  \x1b[32m✔ Front conectado com o back\x1b[0m (status ${resposta.status})\n`)
        } catch (error) {
          console.log(`  \x1b[31m✘ Front NÃO conectado com o back\x1b[0m (${error.message})\n`)
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const urlDoBack = (env.VITE_API_URL || URL_PADRAO).replace(/\/+$/, '')

  return {
    plugins: [react(), statusDoBack(urlDoBack)]
  }
})