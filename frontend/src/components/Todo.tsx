import { ChangeEvent, FormEvent, useState } from 'react'

export type TodoProps = {
  completed: boolean
  id: string
  name: string
  key: string
  toggleTaskCompleted: Function
  deleteTask: Function
  editTask: Function
}

export const Todo = (props: TodoProps) => {
  const [isEditing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    props.editTask(props.id, newName)
    setNewName('')
    setEditing(false)
  }

  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement
    setNewName(target.value)
  }

  const editingTemplate = (
    <form
      className="stack-small"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button
          type="submit"
          className="btn btn__primary todo-edit"
          onClick={() => handleSubmit}
        >
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  )

  const viewTemplate = (
    <>
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
        >
          Edit <span className="visually-hidden">Eat</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">Eat</span>
        </button>
      </div>
    </>
  )


  return (
    <li className="todo stack-small">
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  )
}
