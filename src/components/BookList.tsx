"use client";

import { SolidClientError, SolidDataset, asUrl, getThingAll, getUrlAll } from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { SCHEMA } from "../lib/data/vocabConstants";
import { Book, rdfToBook, removeBookFromDataset } from "../lib/data/books";
import { useContext } from "react";
import { LibraryContext } from "../contexts/libraryContext";
import style from "./Booklist.module.css";

const seeMore = (book: Book) => {
  console.log("See more about ", book.isbn);
}

const SeeMoreButton = ({book}: {book: Book}) => {
  return <button role="button" onClick={() => seeMore(book)}>+</button>;
}

const RemoveButton = ({book}: {book: Book}) => {
  const { library, setLibrary } = useContext(LibraryContext);
  if (library === undefined) {
    return <button role="button" disabled={ true }>x</button>;
  }
  return <button role="button" onClick={() => setLibrary(removeBookFromDataset(book, library))}>x</button>;
}

export default function BookList() {
  const { library } = useContext(LibraryContext);
  if (library === undefined) {
    return <p>Your library is currently empty.</p>;
  }
  const books = getThingAll(library).filter(
    (thing) => getUrlAll(thing, RDF.type).includes(SCHEMA.classes.PublicationIssue)
  );
  const bookList = books
    .map((book) => rdfToBook(library, asUrl(book)))
    .map((bookData) => (
      <tr key={bookData.isbn}>
        <td aria-label="Titre">{bookData.title}</td>
        <td aria-label="Auteurs">{bookData.authors.reduce((prev, cur) => prev === "" ? cur : `${cur}, ${prev}`, "")}</td>
        <td aria-label="Série">{bookData.series !== undefined ? `${bookData.series.name} (T${bookData.series.index})` : ""}</td>
        <td aria-label=""><SeeMoreButton book={bookData}/><RemoveButton book={bookData}/></td>
      </tr>
    ));
  return (
    <div className={ style.bookTableContainer }>
      <table className={ style.bookTable }>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur(s)</th>
            <th>Série</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookList}
        </tbody>
      </table>
    </div>
  );
};
