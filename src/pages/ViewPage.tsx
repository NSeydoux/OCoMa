"use client"

import { getSourceIri, SolidDataset } from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react"
import { useContext, useEffect, useState } from 'react';
import { discoverLibraryRoot } from '../lib/discovery';
import LibraryInitializer from '../components/LibraryInitializer';
import BookList from '../components/BookList';
import { LibraryContext } from '../contexts/libraryContext';

const LibraryExplorer = ({ setRoot }: { setRoot: (root?: string) => void }) => {
  const { library } = useContext(LibraryContext);
  if (library === undefined) {
    return <LibraryInitializer setLibraryRoot={setRoot} />
  }
  return <BookList/>
}

export default function ViewPage({
  setLibraryRoot
}: {
  setLibraryRoot: (root?: string) => void 
}) {
  const { session } = useSession();
  useEffect(() =>  {
    discoverLibraryRoot(session)
      .then(setLibraryRoot)
      .catch((e) => {
        console.error("Discovering the library root failed: ", e.toString());
      });
  }, [setLibraryRoot, session]);

  return (
    <div>
      <h1>View all books in your library, {session.info.webId}</h1>
      <LibraryExplorer setRoot={setLibraryRoot} />
    </div>
  )
}
