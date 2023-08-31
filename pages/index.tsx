import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from "@inrupt/solid-ui-react";

import { useContext, useEffect, useState } from "react";
import ViewPage from "../src/components/pages/ViewPage";
import { loadLibrary } from '../src/lib/discovery';
import { LibraryContext } from '../src/contexts/libraryContext';


export default function Home() {
  const { session } = useSession();
  // La librairie est une ressource nécessaire partout , elle devrait être stockée dans un contexte
  const [libraryRoot, setLibraryRoot] = useState<string>();
  const { setLibrary } = useContext(LibraryContext);
  

  useEffect(() => {
    if (libraryRoot === undefined) {
      return;
    }
    console.log("Loading the library ", libraryRoot)
    loadLibrary(libraryRoot, session)
      .then((library) => { setLibrary(library); })
      .catch((e) => {
        console.error("Loading the library failed: ", e.toString());
      });
  }, [libraryRoot, session, setLibrary])

  return (
    <>
      <h1>Welcome to OCoMa</h1>
      <ViewPage setLibraryRoot={setLibraryRoot} />
    </>
  )
}
