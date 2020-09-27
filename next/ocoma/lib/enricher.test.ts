import { describe, it, expect } from "@jest/globals";
import { buildDate, enrich } from "./enricher";
import { Book } from "./isbn_lookup";
import { 
    getStringInLocaleOne,
    getStringNoLocale,
    getDatetime,
    getStringNoLocaleAll
} from "@inrupt/solid-client";
import { DCTERMS } from "@inrupt/vocab-common-rdf";
import { ISBN } from "./constants";

describe("buildDate", () => {
    it("should parse yyyy-mm-dd date format", () => {
        const date = buildDate("2020-09-01");
        expect(date?.getFullYear()).toEqual(2020);
        expect(date?.getMonth()).toEqual(8);
        expect(date?.getDate()).toEqual(1);
    });

    it("should returned undefined for other date formats", () => {
        expect(buildDate("Not a valid date")).toBeUndefined();
    });
});

describe("enrich", () => {
    it("should build an RDF dataset from a Book record", () => {
        const rawBook: Book = {
            title: "Quelquepart entre les ombres",
            authors: ["Juan Díaz Canales", "Juanjo Guarnido"],
            description: "Une description",
            language: "fr",
            isbn10: "2205049658",
            isbn13: "9782205049657",
            publishedDate: "2000-11-10"
        };
        const rdfBook = enrich(rawBook);
        expect(getStringInLocaleOne(rdfBook, DCTERMS.title, "fr")).toEqual("Quelquepart entre les ombres");
        expect(getStringInLocaleOne(rdfBook, DCTERMS.abstract, "fr")).toEqual("Une description");
        expect(getStringNoLocale(rdfBook, DCTERMS.language)).toEqual("fr");
        expect(getDatetime(rdfBook, DCTERMS.issued)).toEqual(buildDate("2000-11-10"));
        expect(getStringNoLocaleAll(rdfBook, DCTERMS.creator)).toEqual(["Juan Díaz Canales", "Juanjo Guarnido"]);
        expect(getStringNoLocale(rdfBook, ISBN)).toEqual("9782205049657");
        expect(getStringNoLocale(rdfBook, DCTERMS.identifier)).toEqual("9782205049657");
    });

    it("should build an RDF dataset from a Book record without a date", () => {
        const rawBook: Book = {
            title: "Quelquepart entre les ombres",
            authors: ["Juan Díaz Canales", "Juanjo Guarnido"],
            description: "Une description",
            language: "fr",
            isbn10: "2205049658",
            isbn13: "9782205049657",
            publishedDate: "Not a date"
        };
        const rdfBook = enrich(rawBook);
        expect(getStringInLocaleOne(rdfBook, DCTERMS.title, "fr")).toEqual("Quelquepart entre les ombres");
        expect(getStringInLocaleOne(rdfBook, DCTERMS.abstract, "fr")).toEqual("Une description");
        expect(getStringNoLocale(rdfBook, DCTERMS.language)).toEqual("fr");
        expect(getStringNoLocaleAll(rdfBook, DCTERMS.creator)).toEqual(["Juan Díaz Canales", "Juanjo Guarnido"]);
        expect(getStringNoLocale(rdfBook, ISBN)).toEqual("9782205049657");
        expect(getStringNoLocale(rdfBook, DCTERMS.identifier)).toEqual("9782205049657");
    })
})