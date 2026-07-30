import 'dotenv/config'
import cors from 'cors'
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (_request, response) => {
  response.json({ ok: true })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
