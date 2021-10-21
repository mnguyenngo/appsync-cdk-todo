import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { Amplify, API } from 'aws-amplify'

import { Todo } from './components/Todo'
import { Form } from './components/Form'
import config from './config'

Amplify.configure({
  aws_appsync_region: 'us-west-2',
  aws_appsync_graphqlEndpoint: config.appsyncApiEndpoint,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: config.appsyncApiKey,
})

const listTasksQuery = `
  query listNotes {
    listNotes {
      id name completed
    }
  }
`

const addTaskMutation = `
  mutation createNote($note: NoteInput!) {
    createNote(note: $note) {
      id name completed
    }
  }
`

const editTaskMutation = `
  mutation updateNote($note: UpdateNoteInput!) {
    updateNote(note: $note) {
      id name completed
    }
  }
`

type Task = {
  id: string
  name: string
  completed: boolean
}

function App() {

  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // optionally can use graphqlOperation to construct query
        // const resp = await API.graphql(graphqlOperation(query)) as { data: { listNotes: Task[] } }
        const resp = await API.graphql({ query: listTasksQuery }) as { data: { listNotes: Task[] } }
        setTasks(resp.data.listNotes)
      } catch (error) {
        console.error(error)
      }
    }

    fetchTasks()
  }, [])

  const createTask = async (id: string, name: string) => {
    console.log(`sending id: ${id} and name: ${name} to AppSync`)
    await API.graphql({
      query: addTaskMutation,
      variables: { note: { id: id, name: name, completed: false } },
    })

    console.log('task successfully created!')
    setTasks([...tasks, { id: id, name: name, completed: false }])
  }

  const toggleTaskCompleted = async (id: string) => {
    // determine the value to send to AppSync
    let isComplete = false
    // create new array of tasks with the one task updated
    const updatedTasks = tasks.map(task => {
      if (id === task.id) {
        isComplete = task.completed
        return { ...task, completed: !task.completed }
      }
      return task
    })

    // send updated task to AppSync
    console.log(`updating id: ${id} to AppSync`)
    await API.graphql({
      query: editTaskMutation,
      variables: { note: { id: id, completed: !isComplete } },
    })
    console.log('task successfully updated!')

    // update data in state
    setTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    const remainingTasks = tasks.filter(task => id !== task.id)
    setTasks(remainingTasks)
  }

  const editTask = async (id: string, newName: string) => {
    // determine the value to send to AppSync; if this param is not sent,
    // there will be an errror
    let currentIsComplete = false
    // create new array of tasks with the one task updated
    const editedTaskList = tasks.map(task => {
      if (id === task.id) {
        currentIsComplete = task.completed
        return { ...task, name: newName }
      }
      return task
    })

    // update data in state
    setTasks(editedTaskList)

    // send updated task to AppSync
    console.log(`updating id: ${id} and name: ${newName} to AppSync`)
    await API.graphql({
      query: editTaskMutation,
      variables: { note: { id: id, name: newName, completed: currentIsComplete } },
    })
    console.log('task successfully updated!')
  }

  const taskList = tasks.map((task, index) => (
    <Todo
      id={task.id}
      key={task.id}
      name={task.name}
      completed={task.completed}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ))

  const addTask = (name: string) => {
    const taskId = 'todo-' + nanoid()
    const newTask = {
      id: taskId,
      key: taskId,
      name: name,
      completed: false,
      toggleTaskCompleted: toggleTaskCompleted,
    }
    createTask(newTask.id, newTask.name)
  }

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const headingTasksCount = `${taskList.length} ${tasksNoun} remaining`

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <h2 id="list-heading">
        {headingTasksCount}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  )
}

export default App
