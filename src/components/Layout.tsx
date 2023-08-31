import Head from 'next/head'
import { NavBar } from './navbar'
import { SessionProvider, useSession } from "@inrupt/solid-ui-react"
import { useRouter } from 'next/router';

import { LibraryContext } from "../contexts/libraryContext";
import { useEffect, useState } from 'react';
import { SolidDataset, getSourceIri, saveSolidDatasetAt, hasResourceInfo } from '@inrupt/solid-client';

const Main = (
  { children }: { children: any } 
) => {
  const { session } = useSession();
  const [library, setLibrary] = useState<SolidDataset>();

  // Persist library updates to the remote resource.
  useEffect(() => {
    if (library === undefined) {
      // Case where the library is initialized from the remote resource.
      // There aren't any changes to persist remotely yet.
      return;
    }
    const targetUrl = getSourceIri(library);
    if (targetUrl === null) {
      console.error("Could not determine the target URL to save the library.")
      return;
    }
    saveSolidDatasetAt(
      targetUrl,
      library, {
        fetch: session.fetch
      }
    ).catch((e) => {
      console.error(`Saving the library to ${targetUrl} failed: `, e.toString());
    });
  }, [library, session]);

  if (!session.info.isLoggedIn) {
    return <main>Please log in.</main>
  }
  return (
    <LibraryContext.Provider value={{ library, setLibrary }}>
      <main>{children}</main>
    </LibraryContext.Provider>
  );
}
 
export default function Layout({ children }: any) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider 
        restorePreviousSession={ true }
        onSessionRestore={
          (url) => { router.push(url); }
      }>
        <NavBar />
        <Main>{children}</Main>
      </SessionProvider>
    </>
  )
}
