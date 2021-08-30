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

Build the frontend app and check the app at localhost:8000

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
