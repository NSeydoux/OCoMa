import { SolidDataset } from '@inrupt/solid-client';
import { createContext } from 'react';

export const LibraryContext = createContext<{
  library?: SolidDataset, setLibrary: (l: SolidDataset) => void
}>({
  library: undefined,
  setLibrary: () => {}
});
