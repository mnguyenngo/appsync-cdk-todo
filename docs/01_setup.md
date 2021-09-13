# Setup

## Create the project directory

```bash
mkdir appsync-cdk-tod
```

Create `cdk` directory

```bash
cd appsync-cdk-todo
mkdir cdk
cdk init --language typescript
```

Create `frontend` directory

```bash
npx create-react-app frontend --template typescript
```

## Build default frontend app

From the `frontend/` directory, build the frontend app and check the app at
localhost:8000.

```bash
yarn build
yarn start
```

## S3 Static Website Setup

Add dependencies

From `cdk/` directory:

```bash
yarn add @aws-cdk/aws-s3
yarn add @aws-cdk/aws-s3-deployment
yarn add @aws-cdk/aws-cloudfront
```

Create the [frontend-stack](../lib/frontend-stack.ts) which will include the
AWS resources needed to support the Todo app.

Add the frontend stack to [`bin/cdk.ts`](../bin/cdk.ts).

Deploy the TodoStaticWebsite

```bash
cdk deploy TodoStaticWebsite
```

Check the Cloudformation URL that is returned as output after the deploy is
successful. On 8/29/2021, I confirmed that the frontend stack was deployed and
I verified this by going to the Cloudfront URL found in the AWS console:
d3XXXXXXXXX.cloudfront.net.

## Backend AppSync Setup

From the `cdk/` directory, install the following:

```bash
yarn add @aws-cdk/aws-appsync @aws-cdk/aws-lambda @aws-cdk/aws-dynamodb
```

Create the [api-stack](../lib/api-stack.ts) and add the TodoApiStack to the
[`bin/cdk.ts`](../bin/cdk.ts).

Add the [Graphql schema](../graphql/schema.graphl).

Add the Lambda data sources to [api-stack](../lib/api-stack.ts).

Add the Lambda functions to `lambdaFns/` directory.

```bash
cdk deploy TodoApiStack
```

From the [Mozilla Todo app tutorial](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_todo_list_beginning),
we can see that a `Todo` item has the following attributes:

- id
- name
- completed

These are the same attributes that are used in the
[AWS AppSync tutorial](https://aws.amazon.com/blogs/mobile/building-scalable-graphql-apis-on-aws-with-cdk-and-aws-appsync/).

We are going to create the default Todo items that are used in the frontend
tutorial using the AppSync console.

```javascript
const DATA = [
  { id: "todo-0", key: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", key: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", key: "todo-2", name: "Repeat", completed: false }
]
```

Verify that the items are created in DynamoDB by going to the `todos` table.

## Create the frontend UI for the Todo app

[Add initial frontend UI code](https://github.com/mnguyenngo/appsync-cdk-todo/commit/39d4a986e87c2eaf434bb3f75978c1c4cf00973f).

See this [tutorial from Mozilla](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_components).

### Connect Frontend UI to Backend AppSync API

See the "Connecting a Client application" section in this [AWS Appsync tutorial](https://aws.amazon.com/blogs/mobile/building-scalable-graphql-apis-on-aws-with-cdk-and-aws-appsync/).

Install aws-amplify

```bash
yarn add aws-amplify
```

Fetch data from Amplify API

See [Amplify docs on fetching data](https://docs.amplify.aws/lib/graphqlapi/query-data/q/platform/js/).

Add environment variables to `.env.local`. This file is not committed to the
repo. You can add your variables to `.env` but make sure not to commit any
secret tokens to a public repo.

See [create-react-app docs](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env)
for more info.

Add the following to `App.tsx` to configure Amplify.

```typescript
import { Amplify, API } from 'aws-amplify'
import config from './config'

Amplify.configure({
  aws_appsync_region: 'us-west-2',
  aws_appsync_graphqlEndpoint: config.appsyncApiEndpoint,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: config.appsyncApiKey,
})
```

Add the `listNotes` query.

```typescript
const query = `
  query listNotes {
    listNotes {
      id name completed
    }
  }
`
```

Integrate fetched data with state.

```typescript
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
```
