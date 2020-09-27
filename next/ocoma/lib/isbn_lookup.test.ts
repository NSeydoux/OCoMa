import { describe, it, expect } from "@jest/globals";
import { hitGoogleApi, parseGoogleBooksResponse } from "./isbn_lookup";

/* eslint-disable no-useless-escape */
const EXAMPLE_JSON = `{
    "kind": "books#volumes",
    "totalItems": 1,
    "items": [
        {
            "kind": "books#volume",
            "id": "XTrvAAAACAAJ",
            "etag": "b5nhpq6q8oY",
            "selfLink": "https://www.googleapis.com/books/v1/volumes/XTrvAAAACAAJ",
            "volumeInfo": {
                "title": "Quelque part entre les ombres",
                "authors": [
                    "Juan Díaz Canales",
                    "Juanjo Guarnido"
                ],
                "publishedDate": "2000-11-09",
                "description": " Parfois, quand j'entre dans mon bureau, j'ai l'impression de marcher dans les ruines d'une ancienne civilisation. Non à cause du désordre qui règne, mais parce que certainement cela ressemble aux vestiges de l'être civilisé que je fus jadis. ",
                "industryIdentifiers": [
                    {
                        "type": "ISBN_10",
                        "identifier": "2205049658"
                    },
                    {
                        "type": "ISBN_13",
                        "identifier": "9782205049657"
                    }
                ],
                "readingModes": {
                    "text": false,
                    "image": false
                },
                "pageCount": 48,
                "printType": "BOOK",
                "categories": [
                    "Blacksad, John (Fictitious character)"
                ],
                "maturityRating": "NOT_MATURE",
                "allowAnonLogging": false,
                "contentVersion": "preview-1.0.0",
                "language": "fr",
                "previewLink": "http://books.google.fr/books?id=XTrvAAAACAAJ&dq=isbn:9782205049657&hl=&cd=1&source=gbs_api",
                "infoLink": "http://books.google.fr/books?id=XTrvAAAACAAJ&dq=isbn:9782205049657&hl=&source=gbs_api",
                "canonicalVolumeLink": "https://books.google.com/books/about/Quelque_part_entre_les_ombres.html?hl=&id=XTrvAAAACAAJ"
            },
            "saleInfo": {
                "country": "FR",
                "saleability": "NOT_FOR_SALE",
                "isEbook": false
            },
            "accessInfo": {
                "country": "FR",
                "viewability": "NO_PAGES",
                "embeddable": false,
                "publicDomain": false,
                "textToSpeechPermission": "ALLOWED",
                "epub": {
                    "isAvailable": false
                },
                "pdf": {
                    "isAvailable": false
                },
                "webReaderLink": "http://play.google.com/books/reader?id=XTrvAAAACAAJ&hl=&printsec=frontcover&source=gbs_api",
                "accessViewStatus": "NONE",
                "quoteSharingAllowed": false
            },
            "searchInfo": {
                "textSnippet": "&quot; Parfois, quand j&#39;entre dans mon bureau, j&#39;ai l&#39;impression de marcher dans les ruines d&#39;une ancienne civilisation."
            }
        }
    ]
}`;

describe("hitGoogleApi", () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
        Promise.resolve({
            text: () => Promise.resolve("Some text."),
        })
    );

    it("builds a correct Google Books request", async () => {
        await hitGoogleApi("9782205049657");
        expect(fetch).toHaveBeenCalledWith(
            "https://www.googleapis.com/books/v1/volumes?apiKey=AIzaSyDH1vFUH98bTwu9iYZqYGbE04wrn7cvEpo&q=isbn%3A9782205049657"
        )
    })
})

describe("parseGoogleBooksResponse", () => {
    it("extracts books from well-formed JSON", () => {
        const bookInfo = parseGoogleBooksResponse(EXAMPLE_JSON);
        expect(bookInfo?.title).toEqual("Quelque part entre les ombres");
        expect(bookInfo?.authors).toEqual([
            "Juan Díaz Canales",
            "Juanjo Guarnido"
        ])
        expect(bookInfo?.description).toEqual(" Parfois, quand j'entre dans mon bureau, j'ai l'impression de marcher dans les ruines d'une ancienne civilisation. Non à cause du désordre qui règne, mais parce que certainement cela ressemble aux vestiges de l'être civilisé que je fus jadis. ");
        expect(bookInfo?.publishedDate).toEqual("2000-11-09");
        expect(bookInfo?.isbn10).toEqual("2205049658");
        expect(bookInfo?.isbn13).toEqual("9782205049657");
    });

    it("throws on malformed JSON", () => {
        expect(() => parseGoogleBooksResponse("This is not proper json")).toThrow();
    })

    it("returns undefined for JSON inconsistent with the expected schema", () => {
        const bookInfo = parseGoogleBooksResponse("\"This is proper json\"");
        expect(bookInfo).toBeUndefined();
    })
})