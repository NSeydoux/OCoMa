import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { discoverLibraryRoot } from '../../src/lib/discovery';
import { getSession } from "../../src/lib/session";

const LibraryInitializer = () => {
  return <p>Initialize your library!</p>
}

const LibraryExplorer = ({ root }: { root: string | null }) => {
  if (root === null) {
    return <LibraryInitializer />
  }
  return (<div>
    <p>Showing your library at <code>{root}</code>.</p>
  </div>)
}

export default function View() {
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
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>View all books in your library, {getSession().info.webId}</h1>
        <Link href="/">Go back to homepage</Link>
        <LibraryExplorer root={libraryRoot} />
      </main>
    </>
  )
}
