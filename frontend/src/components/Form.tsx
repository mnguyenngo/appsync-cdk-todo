import React, { useState } from 'react'

type FormProps = {
  addTask: Function,
}

export const Form = (props: FormProps) => {

  const [name, setName] = useState('')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    props.addTask(name)
    setName('')
  }

  const handleChange = (e: { target: HTMLInputElement }) => {
    setName(e.target.value)
  }

  return (
    <form>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        onSubmit={handleSubmit}
        value={name}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="btn btn__primary btn__lg"
        onClick={handleSubmit}
      >
        Add
      </button>
    </form>
  )
}