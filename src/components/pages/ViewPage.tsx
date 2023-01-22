import { useEffect, useState } from 'react';
import { discoverLibraryRoot } from '../../lib/discovery';
import { getSession } from '../../lib/session';
import LibraryInitializer from '../LibraryInitializer';

const LibraryExplorer = ({ root, setRoot }: { root?: string, setRoot: (root?: string) => void }) => {
  console.log("Explorer root: ", root)
  if (root === undefined) {
    return <LibraryInitializer setLibraryRoot={setRoot} />
  }
  return (<div>
    <p>Showing your library at <code>{root}</code>.</p>
  </div>)
}

export default function ViewPage({ libraryRoot, setLibraryRoot }: { libraryRoot?: string; setLibraryRoot: (root?: string) => void }) {

  useEffect(() =>  {
    (async () => {
      const session = getSession();
      await session.handleIncomingRedirect({
        restorePreviousSession: true
      });
      console.log("Found library root: ", await discoverLibraryRoot(session));
      setLibraryRoot(await discoverLibraryRoot(session));
    })();
  }, [libraryRoot, setLibraryRoot]);

  return (
    <div>
      <h1>View all books in your library, {getSession().info.webId}</h1>
      {/* <Link href="/">Go back to homepage</Link> */}
      <LibraryExplorer root={libraryRoot} setRoot={setLibraryRoot} />
    </div>
  )
}
