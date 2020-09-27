const googleEndpoint = "https://www.googleapis.com/books/v1/volumes";
const apiKey = "AIzaSyDH1vFUH98bTwu9iYZqYGbE04wrn7cvEpo";

export type Book = {
    title: string,
    authors: string[],
    publishedDate?: string,
    description: string,
    isbn10?: string,
    isbn13: string,
    language: string
}

interface IsbnResolver {
    lookup: (isbn:string) => Promise<Book | undefined>
}

export function hitGoogleApi(isbn: string): Promise<string> {
    const searchParams = new URLSearchParams("");
    searchParams.append("apiKey", apiKey);
    searchParams.append("q", `isbn:${isbn}`);
    const url = new URL(`${googleEndpoint}?${searchParams.toString()}`);
    return fetch(url.toString())
    .then(response => response.text());
}

export function parseGoogleBooksResponse(json: string): Book | undefined {
    const rawRecord = JSON.parse(json);
    if(rawRecord.items) {
        const info = rawRecord.items[0].volumeInfo;
        const title = info.title;
        const authors = info.authors;
        const publishedDate = info.publishedDate;
        const description = info.description;
        const language = info.language;
        // @ts-ignore
        const isbn10 = info.industryIdentifiers.filter(item => item.type === "ISBN_10")[0].identifier;
        // @ts-ignore
        const isbn13 = info.industryIdentifiers.filter(item => item.type === "ISBN_13")[0].identifier;
        return {
            title,
            authors,
            publishedDate,
            description,
            language,
            isbn10,
            isbn13
        }
    } else {
        return undefined;
    }
}

export const googleBooksResolver: IsbnResolver = {
    lookup: async (isbn: string): Promise<Book | undefined> => 
        hitGoogleApi(isbn).then(parseGoogleBooksResponse)
}

const isbnSearchEndpoint = "https://www.bookfinder.com/search/";

export function hitIsbnsearchApi(isbn: string): Promise<string> {
    const searchParams = new URLSearchParams("");
    searchParams.append("isbn", isbn);
    searchParams.append("submitBtn", "Search");
    searchParams.append("mode", "isbn");
    searchParams.append("st", "sr");
    searchParams.append("ac", "qr");
    const url = new URL(`${isbnSearchEndpoint}?${searchParams.toString()}`);
    console.log(url.toString())
    return fetch(url.toString())
    .then(response => response.text());
}

export function parseIbnsearchResponse(json: string): Book | undefined {
    return undefined; 
}

export const bookfinderResolver: IsbnResolver = {
    lookup: async (isbn: string): Promise<Book | undefined> => 
        hitIsbnsearchApi(isbn).then(parseIbnsearchResponse)
}

export async function lookup(isbn: string): Promise<Book | undefined> {
    return googleBooksResolver.lookup(isbn)
        .then(result => {
            if(result === undefined) {
                return bookfinderResolver.lookup(isbn)
            }
            return result;
        })
}
    