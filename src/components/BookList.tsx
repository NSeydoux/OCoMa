import { asUrl, getThingAll, getUrlAll } from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { SCHEMA } from "../lib/data/vocabConstants";
import { rdfToBook } from "../lib/data/books";
import { useContext } from "react";
import { LibraryContext } from "../contexts/libraryContext";

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
      <li key={bookData.isbn}>{bookData.title}, {bookData.authors.reduce((prev, cur) => prev === "" ? cur : `${cur}, ${prev}`, "")}, (ISBN: {bookData.isbn})</li>
    ));
  return <ul>{bookList}</ul>;
};

