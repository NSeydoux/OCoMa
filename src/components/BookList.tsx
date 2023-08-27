import { SolidDataset, asUrl, getThingAll, getUrlAll } from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { SCHEMA } from "../lib/data/vocabConstants";
import { rdfToBook } from "../lib/data/books";

const listAuthors = (authors: string[]) => {

}

export default function BookList({library}: { library: SolidDataset }) {
  // Tu en es là. D'abord, il faudrait modifier bookToRdf pour ajouter des types aux entités dans le graphe, 
  // pour ensuite matcher sur ces types ici pour itérer sur les Things de type book.
  const books = getThingAll(library).filter(
    (thing) => getUrlAll(thing, RDF.type).includes(SCHEMA.classes.PublicationIssue)
  );
  const bookList = books
    .map((book) => rdfToBook(library, asUrl(book)))
    .map((bookData) => (
      <li key={bookData.isbn}>{bookData.title}, {bookData.authors.reduce((prev, cur) => `${cur}, ${prev}`, "")}, (ISBN: {bookData.isbn})</li>
    ));
  return <ul>{bookList}</ul>;
};

