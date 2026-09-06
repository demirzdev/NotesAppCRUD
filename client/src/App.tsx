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
              {noteList.map((note, index) => (
                <div key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <small>{note.user_name}</small>

                  <button onClick={() => handleDelete(note.id)}>Delete</button>
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
