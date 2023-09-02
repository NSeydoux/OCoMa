import { createContext } from 'react';

export const DeploymentContext = createContext<{
  deploymentUrl?: string, setDeploymentUrl: (url: string) => void 
}>({
  deploymentUrl: undefined,
  setDeploymentUrl: () => {}
});
