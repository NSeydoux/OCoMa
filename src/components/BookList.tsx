import { SolidClientError, SolidDataset, asUrl, getThingAll, getUrlAll } from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { SCHEMA } from "../lib/data/vocabConstants";
import { Book, rdfToBook, removeBookFromDataset } from "../lib/data/books";
import { useContext } from "react";
import { LibraryContext } from "../contexts/libraryContext";

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
        <td>{bookData.title}</td>
        <td>{bookData.authors.reduce((prev, cur) => prev === "" ? cur : `${cur}, ${prev}`, "")}</td>
        <td>{bookData.series !== undefined ? `${bookData.series.name} (T${bookData.series.index})` : ""}</td>
        <td><SeeMoreButton book={bookData}/><RemoveButton book={bookData}/></td>
      </tr>
    ));
  return (
    <table>
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
  );
};

<table>
  <thead>
    <tr>
      <th colSpan={2}>The table header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>The table body</td>
      <td>with two columns</td>
    </tr>
  </tbody>
</table>

