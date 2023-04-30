# Meroku Namespace

.app and .dev minting web interface.


# Organization

This repository contains the source code for interacting with the Meroku Protocol.
This is a [turbo monorepo](https://turbo.build).

Primary directories

- [app/web](app/web) Webapp for minting of NFTs core to Meroku Protocol.
- [packages/contracts](packages/contract/) Smart Contract for the Meroku Protocol.

# Getting started

## Development

1. Clone this repo

```shell
git clone git@github.com:merokudao/namespace.git
```

2. Use node version 19.2.0 or latest stable.

3. Run `yarn` to install dependencies

4. Run `yarn turbo build` to build the entire monorepo or `yarn turbo dev` to start the dev
servers. If you want to work with individual apps or packages, the steps are mentioned inside each one's README.md