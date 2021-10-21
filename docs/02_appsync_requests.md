# AppSync Requests

## LIST

### Fetching the data from AppSync

#### The GraphQL Schema for List

```graphql
type Note {
  id: ID!
  name: String!
  completed: Boolean!
}

type Query {
  getNoteById(noteId: String!): Note
  listNotes: [Note] # <- this one
}
```

#### The GraphQL Query for List

```typescript
const listTasksQuery = `
  query listNotes {
    listNotes {
      id name completed
    }
  }
`
```

#### API call for List

```typescript
const resp = await API.graphql({ query: listTasksQuery }) as { data: { listNotes: Task[] } }
```

### Data in Redux State

#### useState

```typescript
const [tasks, setTasks] = useState<Task[]>([])
```

#### useEffect

```typescript
useEffect(() => {
    const fetchTasks = async () => {
        try {
            const resp = await API.graphql({ query: listTasksQuery }) as { data: { listNotes: Task[] } }
            setTasks(resp.data.listNotes)
        } catch (error) {
            console.log(error)
        }
    }

    fetchTasks()
}, [])
```

## CREATE

### The GraphQL Schema for Create

```graphql
input NoteInput {
  id: ID!
  name: String!
  completed: Boolean!
}

type Mutation {
  createNote(note: NoteInput!): Note # <- this one
  updateNote(note: UpdateNoteInput!): Note
  deleteNote(noteId: String!): String
}
```

### The GraphQL Query for Create

```typescript
const addTaskMutation = `
  mutation createNote($note: NoteInput!) {
    createNote(note: $note) {
      id name completed
    }
  }
`
```

### API call for Create

```typescript
const createTask = async (id: string, name: string) => {
    console.log(`sending id: ${id} and name: ${name} to AppSync`)
    await API.graphql({
        query: addTaskMutation,
        variables: { note: { id: id, name: name, completed: false } },
    })

    console.log('task successfully created!')
    setTasks([...tasks, { id: id, name: name, completed: false }])
}
```

## DELETE

### The GraphQL Query for Delete

```typescript
```

### API Call for Delete

```typescript
```
