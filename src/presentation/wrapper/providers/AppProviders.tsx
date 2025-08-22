import { StrictMode } from 'react';

interface Props {
  children: React.ReactNode;
}

const allProviders: Record<string, React.ComponentType<{ children: React.ReactNode }>> = {
  strict: StrictMode,
};

const providerOrder = ['strict', 'router'];

const AppProviders = ({ children }: Props) => {
  return providerOrder.reduceRight((acc, key) => {
    const Provider = allProviders[key];
    if (!Provider) {
      console.warn(`Provider "${key}" is not registered in allProviders`);
      return acc;
    }
    return <Provider>{acc}</Provider>;
  }, children);
};

export default AppProviders;
