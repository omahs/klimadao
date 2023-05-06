import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "src/graphql/generated/marketplace.types.ts": {
      schema: "https://api.thegraph.com/subgraphs/name/najada/marketplace-new",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-generic-sdk",
      ],
      documents: "src/graphql/marketplace.gql",
    },
    "src/graphql/generated/poolprices.types.ts": {
      schema: "https://api.thegraph.com/subgraphs/name/klimadao/klimadao-pairs",
      plugins: ["typescript"],
      // documents: "src/graphql/poolprices.gql",
    },
    "src/graphql/generated/carbon.types.ts": {
      schema:
        "https://api.thegraph.com/subgraphs/name/klimadao/polygon-bridged-carbon",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-generic-sdk",
      ],
      documents: "src/graphql/polygon-bridged-carbon.gql",
    },
  },
};

export default config;
