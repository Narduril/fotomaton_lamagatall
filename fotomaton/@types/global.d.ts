export {};

declare global {
  interface Window {
    electronAPI: {
      savePhoto: (base64Data: string, filename: string) => Promise<{ success: boolean; path?: string; error?: string }>;
    };
  }
}