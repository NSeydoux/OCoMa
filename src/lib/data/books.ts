import { SolidDataset, buildThing, asIri, setThing, createSolidDataset } from "@inrupt/solid-client";
import { FOAF, DCTERMS } from "@inrupt/vocab-common-rdf";
import { v4 } from "uuid";
import { CBO } from "./vocabConstants";

export type Book = {
  title: string,
  langTag: string,
  isbn: number,
  authors: string[],
  series?: {
    name: string,
    index: number
  }
}

export function bookToRdf(book: Book, baseUrl: string): SolidDataset {
  const authors = book.authors.map(
    (author) => buildThing({
      url: new URL(`${author}_${v4()}`, baseUrl).href
    }).addStringNoLocale(FOAF.name, author).build()
  );
  const seriesBuilder = buildThing({
    url: new URL(`${book.series?.name}_${v4()}`, baseUrl).href
  });
  if(book.series !== undefined){
    seriesBuilder.addStringWithLocale(
      CBO.seriesTitle,
      book.series.name,
      book.langTag
    );
  }
  const series = seriesBuilder.build();

  const bookBuilder = buildThing()
    .addStringWithLocale(DCTERMS.title, book.title, book.langTag)
    .addInteger(CBO.isbn, book.isbn);
  authors.forEach((author) => { bookBuilder.addIri(DCTERMS.creator, asIri(author))});
  if (book.series !== undefined) {
    bookBuilder.addInteger(
      CBO.issueNumber,
      book.series.index
    ).addIri(CBO.series, asIri(series))
  }
  return [
    authors,
    series,
    bookBuilder.build()
  ].flat().reduce(setThing, createSolidDataset());
}
