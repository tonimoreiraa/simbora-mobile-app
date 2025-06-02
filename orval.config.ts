import {defineConfig} from 'orval';

export default defineConfig({
  doca: {
    hooks: {
      afterAllFilesWrite: 'prettier --write .',
    },
    input: {
      target: './src/services/openapi.json',
      // validation: true,
    },
    output: {
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      override: {
        mutator: {
          name: 'axiosInstance',
          path: './src/services/axios.ts',
        },
      },
      schemas: './src/services/client/models',
      target: './src/services/client',
    },
  },
});
