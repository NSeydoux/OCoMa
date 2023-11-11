"use client"

import { useSession } from "@inrupt/solid-ui-react";
import AddBookForm from "../components/AddBookForm";
import { LibraryContext } from "../contexts/libraryContext";
import { useContext } from "react";

export default function AddPage() {
  const { session } = useSession();
  const {library } = useContext(LibraryContext);
  
  if (!session.info.isLoggedIn) {
    return <div>Please log in to add a book to your library.</div>
  }

  return (
    <div>
      <h1>Add a book to your library, {session.info.webId}</h1>
      { library !== undefined 
        ? <AddBookForm/>
        : <p>To be add books to your library, please define a library root first.</p>
      }
    </div>
  )
}
