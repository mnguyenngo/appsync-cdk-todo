
export const addTaskMutation = `
  mutation createNote($note: NoteInput!) {
    createNote(note: $note) {
      id name completed
    }
  }
`

export const editTaskMutation = `
  mutation updateNote($note: UpdateNoteInput!) {
    updateNote(note: $note) {
      id name completed
    }
  }
`

// delete mutation returns a string instead of object
// no fields are required to be specified deleteNote()
export const deleteTaskMutation = `
  mutation deleteNote($noteId: String!) {
    deleteNote(noteId: $noteId)
  }
`