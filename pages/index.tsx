import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useEffect, useState } from "react";
import { NavBar } from "../src/components/navbar";
import AddPage from '../src/components/pages/AddPage';
import { getSession } from "../src/lib/session";
import ViewPage from "../src/components/pages/ViewPage";
import { getSourceIri, isPodOwner, saveSolidDatasetAt, SolidDataset } from '@inrupt/solid-client';
import { loadLibrary } from '../src/lib/discovery';

const CurrentPage = ({
  page,
  setLibraryRoot,
  libraryResource,
  setLibraryResource
}: {
  libraryRoot?: string,
  page: "add"|"view",
  setLibraryRoot: (url?: string) => void,
  libraryResource?: SolidDataset
  setLibraryResource: (library: SolidDataset) => void
}) => {
  if (page === "add") {
    return <AddPage library={libraryResource} setLibrary={setLibraryResource} />;
  }
  return <ViewPage library={libraryResource} setLibraryRoot={setLibraryRoot} />
}

const Homepage = ({
  loggedIn,
  libraryRoot,
  setLibraryRoot,
  libraryResource,
  setLibraryResource
}: {
  loggedIn: boolean,
  libraryRoot?: string,
  setLibraryRoot: (url?: string) => void,
  libraryResource?: SolidDataset
  setLibraryResource: (library: SolidDataset) => void
}) => {
  const [currentPage, setCurrentPage] = useState<"add"|"view">("view");
  
  if(loggedIn) {
    return (
      <div>
        <ul>
          <li onClick={() => setCurrentPage("add")}>Add a book</li>
          <li onClick={() => setCurrentPage("view")}>View your books</li>
        </ul>
        <CurrentPage 
          page={currentPage}
          libraryRoot={libraryRoot}
          setLibraryRoot={setLibraryRoot}
          libraryResource={libraryResource}
          setLibraryResource={setLibraryResource}
        />
      </div>
    )
  }
  return (
    <p>Please log in.</p>
  )
}

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState<boolean>(getSession().info.isLoggedIn);
  const [libraryRoot, setLibraryRoot] = useState<string>();
  const [libraryResource, setLibraryResource] = useState<SolidDataset>();

  useEffect(() => {
    (async () => {
      const session = getSession();
      session.events.on("login", () => { setLoggedIn(true)} );
      session.events.on("logout", () => { setLoggedIn(false)} );
      session.events.on("sessionRestore", (url) => { 
        setLoggedIn(true)
        router.push(url);
      })
      try {
        await session.handleIncomingRedirect({
          restorePreviousSession: true,
          url: window.location.href
        });
      } catch(e) {
        console.error("Failed login: ", e)
      }
      
    })();
  }, [router]);

  useEffect(() => {
    (async () => {
      if (libraryRoot === undefined) {
        return;
      }
      const library = await loadLibrary(libraryRoot, getSession());
      setLibraryResource(library);
    })()
  }, [libraryRoot])

  const handleLibraryRoot = (newRoot?: string) => {
    setLibraryRoot(newRoot);
  }

  const handleLibraryUpdate = async (updatedLibrary: SolidDataset) => {
    if (libraryResource === undefined) {
      return;
    }
    const targetUrl = getSourceIri(libraryResource);
    if (targetUrl === null) {
      return;
    }
    const persistedLibrary = await saveSolidDatasetAt(
      targetUrl,
      updatedLibrary, {
        fetch: getSession().fetch
      }
    );
    setLibraryResource(persistedLibrary);
  }

  return (
    <>
      <Head>
        <title>OCoMa</title>
        <meta name="description" content="An Open Comic books Manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <NavBar />
        <h1>Welcome to OCoMa</h1>
        <Homepage 
          loggedIn={isLoggedIn}
          libraryRoot={libraryRoot}
          setLibraryRoot={handleLibraryRoot}
          libraryResource={libraryResource}
          setLibraryResource={handleLibraryUpdate}
        />
      </main>
    </>
  )
}
