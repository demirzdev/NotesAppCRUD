import { useEffect, useState } from 'react'
import './App.css'

type Note = {
  id: number,
  user_name: string,
  title: string,
  content: string
}


function App() {
  const [userName, setUserName] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")

  const [noteList, setNoteList] = useState<Note[]>([])

  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editingNote, setEditingNote] = useState<number | null>(null)

  useEffect(() => {
    const getNotes = async () => {
      const response = await fetch('http://localhost:3000/api/notes')

      const notes = await response.json()

      setNoteList(notes)
    }

    getNotes()
  }, [])


  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault()

    const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName,
            title,
            content
        })
    })

    if (!response.ok) {
        const error = await response.json()
        console.log(error.error)
        return
    }

    const note = await response.json()

    setNoteList([...noteList, note])

    setUserName("")
    setTitle("")
    setContent("")

    console.log(note.id)
}

  const handleDelete = async (id: number) => {
   console.log("DELETE ID:", id) 

  try {
     const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
      method: 'DELETE'
     })

     console.log("DELETE RESPONSE:", response.status)

     setNoteList(prev => prev.filter(note => note.id !== id))
  }
  catch (error) {
    console.error("DELETE ERROR:", error)
  }

  }

  const getNoteDetails = async (id: number) => {
    
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${id}`)

      const note = await response.json()
      console.log(note)
    }
    catch (error) {
      console.error(error)
    }
  }

  const updateNotes = async (id: number) => {
    try {
        const response = await fetch(
            `http://localhost:3000/api/notes/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent
                })
            }
        )

        if (!response.ok) {
            const error = await response.json()
            console.log(error.error)
            return
        }

        const updatedNote = await response.json()

        setNoteList(prevNotes =>
            prevNotes.map(note =>
                note.id === updatedNote.id ? updatedNote : note
            )
        )

        setEditingNote(null)

        console.log('UPDATED NOTE:', updatedNote)

    } catch (error) {
        console.error(error)
    }
}

  const startEditing = (note: Note) => {
    setEditingNote(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
}


  return (
    <>
      <section>
        <div>
          <h1> NotesApp</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Your Name</label>
              <input id='userName' 
                     placeholder='Enter your name' 
                     type='text' 
                     value={userName}
                     onChange={(event) => setUserName(event.target.value)}/>
            </div>

            <div>
              <label>Title</label>
              <input id='title' 
                     placeholder='Enter note title' 
                     type='text'
                     value={title}
                     onChange={(event) => setTitle(event.target.value)}/>
            </div>

            <div>
              <label>Your Note</label>
              <input id='content' 
                     placeholder='Write your note...' 
                     type='text'
                     value={content}
                     onChange={(event) => setContent(event.target.value)}/>
            </div>

            <button type='submit'>Add</button>
          </form>

          <div>
              {noteList.map((note) => (
  <div key={note.id}>

    {editingNote === note.id ? (
      <>
        <input
          type="text"
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
        />

        <input
          type="text"
          value={editContent}
          onChange={(event) => setEditContent(event.target.value)}
        />

        <button onClick={() => updateNotes(note.id)}>Save</button>
        <button onClick={() => setEditingNote(null)}>Cancel</button>
      </>
    ) : (
      <>
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <small>{note.user_name}</small>

        <button onClick={() => handleDelete(note.id)}>
          Delete
        </button>

        <button onClick={() => getNoteDetails(note.id)}>
          Details
        </button>

        <button onClick={() => startEditing(note)}>
          Edit
        </button>
      </>
    )}

  </div>
))}
         </div>

         <div>
          <label>Lista zadataka</label>

         </div>

        </div>
      </section>
    </>
  )
    
    

}

export default App
