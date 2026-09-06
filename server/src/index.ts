import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Backend radi !')
})

app.get('/api/notes', async (req, res) => {
    try {
        const results = await pool.query(
            'SELECT * FROM notes ORDER BY created_at DESC'
        )

        res.json(results.rows)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
    }
})

app.post('/api/notes', async (req, res) => {
    try {
        const { userName, title, content } = req.body

        const results = await pool.query(
            'INSERT INTO notes (user_name, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userName, title, content]
        )  

        res.status(201).json(results.rows[0])
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error!' })
    }
    
})

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params

        const result = await pool.query(
              'DELETE FROM notes WHERE id = $1 RETURNING *',
              [id]
        )

        res.status(200).json(result.rows[0])

        console.log(id)
        res.status(200).json({ message: 'Delete request received' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
    }
    
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})