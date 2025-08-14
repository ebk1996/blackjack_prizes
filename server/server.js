import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pkg from 'pg'
const { Pool } = pkg

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
})

app.get('/health', (req, res) => res.json({ ok: true }))

app.post('/api/entries', async (req, res) => {
  const { fullName, email, phone, address, city, state, zip, consent } = req.body || {}
  if (!fullName || !email || !phone || !address || !city || !state || !zip) {
    return res.status(400).json({ error: 'Missing fields' })
  }
  try {
    const q = `INSERT INTO prize_entries (full_name,email,phone,address,city,state,zip,consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, created_at`
    const { rows } = await pool.query(q, [fullName, email, phone, address, city, state, zip, !!consent])
    res.status(201).json({ id: rows[0].id, created_at: rows[0].created_at })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'DB error' })
  }
})

const port = process.env.PORT || 8787
app.listen(port, () => console.log('Server listening on', port))
