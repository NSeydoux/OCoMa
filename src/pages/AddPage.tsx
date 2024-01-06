"use client"

import { useSession } from "@inrupt/solid-ui-react";
import AddBookForm from "../components/AddBookForm";
import { LibraryContext } from "../contexts/libraryContext";
import { useContext } from "react";

export default function AddPage() {
  const { session } = useSession();
  const {library } = useContext(LibraryContext);
  
  if (!session.info.isLoggedIn) {
    return <p>Please log in to add a book to your library.</p>;
  }

  if (library === undefined) {
    return <p>To be add books to your library, please define a library root first.</p>;
  }

  return <AddBookForm/>;
}
