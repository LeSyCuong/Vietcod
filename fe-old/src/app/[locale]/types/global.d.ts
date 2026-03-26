export {};

declare global {
  interface UnicornStudioType {
    isInitialized: boolean;
    init: () => void;
  }

  interface Window {
    UnicornStudio?: UnicornStudioType;
  }
}
