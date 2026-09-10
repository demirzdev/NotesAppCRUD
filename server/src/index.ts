import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { title } from 'node:process'
import { notStrictEqual } from 'node:assert'
import { describe } from 'node:test'

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

app.get('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params

        const result = await pool.query(
             'SELECT * FROM notes WHERE id = $1', 
             [id]
        )
        
        res.json(result.rows[0])
    }
    catch (error) {

        console.error(error)
        res.status(500).json({ error: 'Database error' })
    }
}) 

/*  
=====================
POST  
=====================
*/

app.post('/api/notes', async (req, res) => {
    try {
        const { userName, title, content } = req.body

        if (!userName || !title || !content) {
         return res.status(400).json({
        error: 'All fields are required'
             })
        }

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

/*  
=====================
DELETE
=====================
*/

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params

        const result = await pool.query(
              'DELETE FROM notes WHERE id = $1 RETURNING *',
              [id]
        )

        res.status(200).json(result.rows[0])

    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
    }
    
})

/*  
=====================
UPDATE
=====================
*/

app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, content } = req.body

        if (!title || !content) {
            return res.status(400).json({
                error: 'Title and content are required'
            })
        }

        const result = await pool.query(
            'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        )

        res.json(result.rows[0])
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
    }
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})




