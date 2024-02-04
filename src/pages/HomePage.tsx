"use client"

import { useSession } from "@inrupt/solid-ui-react";

import { useContext, useEffect, useState } from "react";
import ViewPage from "./ViewPage";
import { loadLibrary } from '../lib/discovery';
import { LibraryContext } from '../contexts/libraryContext';

export default function Home() {
  const { session } = useSession();
  const [libraryRoot, setLibraryRoot] = useState<string>();
  const { setLibrary } = useContext(LibraryContext);
  
  useEffect(() => {
    if (libraryRoot === undefined) {
      return;
    }
    loadLibrary(libraryRoot, session)
      .then((library) => { setLibrary(library); })
      .catch((e) => {
        console.error("Loading the library failed: ", e.toString());
      });
  }, [libraryRoot, session, setLibrary])

  if (!session.info.isLoggedIn) {
    return <></>;
  }
  return <ViewPage setLibraryRoot={setLibraryRoot} />
}
