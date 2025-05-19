// global.d.ts

export {};

declare global {
  interface Window {
    ORIGINAL_BASE_PATH?: string
  }
}
