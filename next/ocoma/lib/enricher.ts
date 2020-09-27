import { Book } from "./isbn_lookup";
import { 
    Thing,
    createThing,
    addStringWithLocale,
    addStringNoLocale,
    addDatetime
} from "@inrupt/solid-client"
import { DCTERMS } from "@inrupt/vocab-common-rdf"
import { ISBN } from "./constants";

import { Writer, Parser } from "n3";
export { dataset } from "@rdfjs/dataset";
export const DataFactory = { quad, literal, namedNode, blankNode };
import { quad, literal, namedNode, blankNode, dataset } from "@rdfjs/dataset";
import { Quad } from "rdf-js";


/**
 * @param quads Triples that should be serialised to Turtle
 * @internal Utility method for internal use; not part of the public API.
 */
 /* istanbul ignore */
export async function triplesToTurtle(quads: Quad[]): Promise<string> {
  const format = "text/turtle";
  const writer = new Writer({ format: format });
  // Remove any potentially lingering references to Named Graphs in Quads;
  // they'll be determined by the URL the Turtle will be sent to:
  const triples = quads.map((quad) =>
    DataFactory.quad(quad.subject, quad.predicate, quad.object, undefined)
  );
  writer.addQuads(triples);
  const writePromise = new Promise<string>((resolve, reject) => {
    writer.end((error, result) => {
      /* istanbul ignore if [n3.js doesn't actually pass an error nor a result, apparently: https://github.com/rdfjs/N3.js/blob/62682e48c02d8965b4d728cb5f2cbec6b5d1b1b8/src/N3Writer.js#L290] */
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });

  const rawTurtle = await writePromise;
  return rawTurtle;
}

export function buildDate(rawDate: string): Date | undefined{
    if(rawDate.match(/\d{4}-\d{2}-\d{2}/)) {
        const splitDate = rawDate.split("-");
        const date = new Date(0);
        date.setFullYear(
            Number.parseInt(splitDate[0]),
            Number.parseInt(splitDate[1]) - 1,
            Number.parseInt(splitDate[2])
            )
        return date;
    } else {
        return undefined;
    }
}

export function enrich(record: Book): Thing {
    let bookThing = createThing();
    bookThing = addStringWithLocale(bookThing, DCTERMS.title, record.title, record.language);
    record.authors.forEach(author => {
        bookThing = addStringNoLocale(bookThing, DCTERMS.creator, author);
    })
    bookThing = addStringWithLocale(bookThing, DCTERMS.abstract, record.description, record.language);
    bookThing = addStringNoLocale(bookThing, DCTERMS.language, record.language);
    let date;
    if(record.publishedDate) {
        date = buildDate(record.publishedDate);
    }
    if(date) {
        bookThing = addDatetime(bookThing, DCTERMS.issued, date);
    }
    bookThing = addStringNoLocale(bookThing, ISBN, record.isbn13);
    bookThing = addStringNoLocale(bookThing, DCTERMS.identifier, record.isbn13);
    return bookThing;
}