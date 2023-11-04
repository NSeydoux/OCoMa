import { SolidDataset, buildThing, asIri, setThing, createSolidDataset, getStringByLocaleAll, getThing, getSourceUrl, getInteger, getUrlAll, getStringNoLocale, ThingPersisted, getUrl, getStringWithLocale, getSourceIri, getThingAll, removeThing, getIntegerAll, asUrl, removeUrl } from "@inrupt/solid-client";
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

export function rdfToBook(data: SolidDataset, bookUrl: string): Book {
  const bookThing = getThing(data, bookUrl);
  if (bookThing === null) {
    throw new Error(`Cannot find ${bookUrl} in ${getSourceUrl(data)}`)
  }
  // FIXME: manage language preference
  // Arbitrarily pick a language if many are present.
  const titleCandidates = getStringByLocaleAll(bookThing, DCTERMS.title);
  if (titleCandidates.size === 0) {
    throw new Error(`Cannot find title for ${bookUrl} in ${getSourceUrl(data)}`);
  }
  const langTag = titleCandidates.keys().next().value
  const title = titleCandidates.get(langTag)![0];
  const isbn = getInteger(bookThing, CBO.properties.isbn);
  if (isbn === null) {
    throw new Error(`Cannot find isbn for ${bookUrl} in ${getSourceUrl(data)}`);
  }
  const authors = getUrlAll(bookThing, DCTERMS.creator)
    .map((url) => getThing(data, url))
    .filter((x: ThingPersisted | null ): x is ThingPersisted => x !== null)
    .map((author) => {
      const name = getStringNoLocale(author, FOAF.name);
      if (name === null) {
        throw new Error(`Cannot find name for ${author} in ${getSourceUrl(data)}`)
      }
      return name;
    });
  
  const seriesUrl = getUrl(bookThing, CBO.properties.series);
  let series: { name: string, index: number } | undefined;
  if (seriesUrl !== null) {
    const seriesThing = getThing(data, seriesUrl);
    if (seriesThing === null) {
      throw new Error(`Cannot find ${seriesUrl} in ${getSourceUrl(data)}`)
    }
    const name = getStringWithLocale(seriesThing, CBO.properties.seriesTitle, langTag);
    const index = getInteger(bookThing, CBO.properties.issueNumber);
    if (typeof name === "string" && typeof index === "number") {
      series = { name, index };
    }
  }
  return {
    title,
    langTag,
    isbn,
    authors,
    series
  }
}

export function addBookToDataset(book: Book, library: SolidDataset): SolidDataset {
  const baseUrl = getSourceIri(library);
  if (baseUrl === null) {
    throw new Error("Could not find library base URL");
  }
  const bookData = bookToRdf(book, baseUrl);
  // Return the library updated with data about the new book.
  return getThingAll(bookData).reduce(setThing, library);
}

export function removeBookFromDataset(book: Book, library: SolidDataset): SolidDataset {
  const baseUrl = getSourceIri(library);
  if (baseUrl === null) {
    throw new Error("Could not find library base URL");
  }
  // const bookData = bookToRdf(book, baseUrl);
  const bookThings = getThingAll(library).filter(
    (candidateThing) => getIntegerAll(candidateThing, CBO.properties.isbn).includes(book.isbn)
  );
  if (bookThings.length === 0) {
    throw new Error(`Could not find book with ISBN ${book.isbn} for deletion.`);
  }
  if (bookThings.length > 1) {
    console.warn(`More than one book are registered with ISBN ${book.isbn}.`);
  }
  // Return the library updated without data about the deleted book.
  return bookThings.reduce(removeThing, library);
}
