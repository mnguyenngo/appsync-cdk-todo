# Lessons Learned

## Backend

1. CDK dependencies need to have the same version number.

## Frontend

1. Environment variables are built-in into create-react-app projects. See the [create-react-app docs](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-development-environment-variables-in-env). **Environment variables will not work unless they are prepended with `REACT_APP_`**.

2. Fetch request to AWS Amplify in Typescript by [Mat Warger via dev.to](https://dev.to/mwarger/aws-amplify-graphql-queries-with-typescript-and-hooks-1e2).