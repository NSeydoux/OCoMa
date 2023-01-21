import { useEffect, useState } from 'react';
import { discoverLibraryRoot } from '../../lib/discovery';
import { getSession } from '../../lib/session';
import LibraryInitializer from '../LibraryInitializer';

const LibraryExplorer = ({ root }: { root: string | null }) => {
  if (root === null) {
    return <LibraryInitializer />
  }
  return (<div>
    <p>Showing your library at <code>{root}</code>.</p>
  </div>)
}

export default function ViewPage() {
  const [libraryRoot, setLibraryRoot] = useState<string | null>(null);

  useEffect(() =>  {
    (async () => {
      const session = getSession();
      await session.handleIncomingRedirect({
        restorePreviousSession: true
      });
      setLibraryRoot(await discoverLibraryRoot(session));
    })();
  });

  return (
    <div>
      <h1>View all books in your library, {getSession().info.webId}</h1>
      {/* <Link href="/">Go back to homepage</Link> */}
      <LibraryExplorer root={libraryRoot} />
    </div>
  )
}
