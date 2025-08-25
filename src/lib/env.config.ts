interface IEnvVars {
    VITE_BASE_URL: string
  }
  
  const loadEnvVars = (): IEnvVars => {
    const requiredEnvVar: string[] = [
      'VITE_BASE_URL'
    ];
    requiredEnvVar.forEach((key) => {
      if (!(key in import.meta.env)) {
        throw new Error(`env not found error -> ${key}`);
      }
    });
    return {
      VITE_BASE_URL: import.meta.env.VITE_BASE_URL as string
    }
  };
  
  export const envVars = loadEnvVars();