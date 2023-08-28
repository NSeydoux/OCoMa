import { getSourceIri, SolidDataset } from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react"
import { useEffect, useState } from 'react';
import { discoverLibraryRoot } from '../../lib/discovery';
import LibraryInitializer from '../LibraryInitializer';
import BookList from '../BookList';

const LibraryExplorer = ({ library, setRoot }: { library?: SolidDataset, setRoot: (root?: string) => void }) => {
  if (library === undefined) {
    return <LibraryInitializer setLibraryRoot={setRoot} />
  }
  return (<div>
    <p>Showing your library at <code>{getSourceIri(library)}</code>.</p>
    <BookList library={library}/>
  </div>)
}

export default function ViewPage({
  library,
  setLibraryRoot
}: {
  library?: SolidDataset;
  setLibraryRoot: (root?: string) => void 
}) {
  const { session } = useSession();
  useEffect(() =>  {
    (async () => {
      setLibraryRoot(await discoverLibraryRoot(session));
    })();
  }, [library, setLibraryRoot, session]);

  return (
    <div>
      <h1>View all books in your library, {session.info.webId}</h1>
      <LibraryExplorer library={library} setRoot={setLibraryRoot} />
    </div>
  )
}
