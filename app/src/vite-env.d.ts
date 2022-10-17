/// <reference types="vite/client" />

interface ImportMetaEnv {
  [key: `VITE_${string}`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
