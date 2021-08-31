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
