import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useEffect, useState } from "react";
import { NavBar } from "../src/components/navbar";
import AddPage from '../src/components/pages/AddPage';
import { getSession } from "../src/lib/session";
import ViewPage from "../src/components/pages/ViewPage";

const CurrentPage = ({ libraryRoot, page, setLibraryRoot }: { libraryRoot?: string, page: "add"|"view", setLibraryRoot: (url?: string) => void}) => {
  if (page === "add") {
    return <AddPage />;
  }
  return <ViewPage libraryRoot={libraryRoot} setLibraryRoot={setLibraryRoot} />
}

const Homepage = ({loggedIn, libraryRoot, setLibraryRoot }: { loggedIn: boolean, libraryRoot?: string, setLibraryRoot: (url?: string) => void}) => {
  const [currentPage, setCurrentPage] = useState<"add"|"view">("view");
  
  if(loggedIn) {
    return (
      <div>
        <ul>
          <li onClick={() => setCurrentPage("add")}>Add a book</li>
          <li onClick={() => setCurrentPage("view")}>View your books</li>
        </ul>
        <CurrentPage page={currentPage} libraryRoot={libraryRoot} setLibraryRoot={setLibraryRoot} />
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

  useEffect(() => {
    (async () => {
      const session = getSession();
      session.onLogin(() => { setLoggedIn(true)} );
      session.onLogout(() => { setLoggedIn(false)} );
      session.onSessionRestore((url) => { 
        setLoggedIn(true)
        router.push(url);
      })
      await session.handleIncomingRedirect({
        restorePreviousSession: true,
        url: window.location.href
      });
    })();
  })

  useEffect(() => {
    console.log("Library root set to ", libraryRoot)
  }, [libraryRoot])

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
        <Homepage loggedIn={isLoggedIn} libraryRoot={libraryRoot} setLibraryRoot={setLibraryRoot}/>
      </main>
    </>
  )
}
