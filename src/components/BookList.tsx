import { SolidDataset, asUrl, getThingAll, getUrlAll } from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { SCHEMA } from "../lib/data/vocabConstants";
import { rdfToBook } from "../lib/data/books";

export default function BookList({library}: { library: SolidDataset }) {
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

