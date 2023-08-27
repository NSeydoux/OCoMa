import { SolidDataset, buildThing, asIri, setThing, createSolidDataset } from "@inrupt/solid-client";
import { FOAF, DCTERMS, RDF } from "@inrupt/vocab-common-rdf";
import { v4 } from "uuid";
import { CBO, SCHEMA } from "./vocabConstants";

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
    }).addStringNoLocale(FOAF.name, author)
    .addUrl(RDF.type, FOAF.Person)
    .build()
  );
  const seriesBuilder = buildThing({
    url: new URL(`${book.series?.name}_${v4()}`, baseUrl).href
  }).addUrl(RDF.type, CBO.classes.Series);
  if(book.series !== undefined){
    seriesBuilder.addStringWithLocale(
      CBO.properties.seriesTitle,
      book.series.name,
      book.langTag
    );
  }
  const series = seriesBuilder.build();

  const bookBuilder = buildThing()
    .addUrl(RDF.type, SCHEMA.classes.PublicationIssue)
    .addStringWithLocale(DCTERMS.title, book.title, book.langTag)
    .addInteger(CBO.properties.isbn, book.isbn);
  authors.forEach((author) => { bookBuilder.addIri(DCTERMS.creator, asIri(author))});
  if (book.series !== undefined) {
    bookBuilder.addInteger(
      CBO.properties.issueNumber,
      book.series.index
    ).addIri(CBO.properties.series, asIri(series))
  }
  return [
    authors,
    series,
    bookBuilder.build()
  ].flat().reduce(setThing, createSolidDataset());
}
