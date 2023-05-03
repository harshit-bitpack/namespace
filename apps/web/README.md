# Getting started

## Development

First, run the development server:

```bash
yarn dev
```

## Production (docker)

Build using the following command. Run this command from the root directory of this project.

```shell
  docker build \
    -f apps/web/Dockerfile \
    -t registry \
    --build-arg NEXT_PUBLIC_APP_CONTRACT_ADDRESS=0x00 \
    --build-arg NEXT_PUBLIC_DEV_CONTRACT_ADDRESS=0x01 \
    --build-arg NEXT_PUBLIC_BICONOMY_API_KEY=yourKEY \
    -t registry:prod \
    .
```

Run using the following Docker command

```shell
  docker run -p 3000:3000 registry:prod
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# General NextJs Instructions
[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn/foundations/about-nextjs) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!ya