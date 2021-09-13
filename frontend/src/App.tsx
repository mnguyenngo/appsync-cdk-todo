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

const query = `
  query listNotes {
    listNotes {
      id name completed
    }
  }
`

type Task = {
  id: string
  key: string
  name: string
  completed: boolean
}

function App() {

  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const resp = await API.graphql({ query }) as { data: { listNotes: Task[] } }
        setTasks(resp.data.listNotes)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTasks()
  }, [])

  const toggleTaskCompleted = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (id === task.id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    setTasks(updatedTasks)
  }

  const deleteTask = (id: string) => {
    const remainingTasks = tasks.filter(task => id !== task.id)
    setTasks(remainingTasks)
  }

  const editTask = (id: string, newName: string) => {
    const editedTaskList = tasks.map(task => {
      if (id === task.id) {
        return { ...task, name: newName }
      }
      return task
    })
    setTasks(editedTaskList)
  }

  const taskList = tasks.map(task => (
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
    setTasks([...tasks, newTask])
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
