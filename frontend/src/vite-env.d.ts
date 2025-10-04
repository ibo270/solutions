/// <reference types="vite/client" />

// (необязательно, но удобно явно подсветить наши переменные)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
