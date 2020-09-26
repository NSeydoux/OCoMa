const endpoint = "https://www.googleapis.com/books/v1/volumes";
const apiKey = "AIzaSyDH1vFUH98bTwu9iYZqYGbE04wrn7cvEpo";

type Book = {
    title: string,
    authors: string[],
    publishedDate: string,
    description: string,
    isbn10: string,
    isbn13: string
}

export async function lookup(isbn: string): Promise<string> {
    const searchParams = new URLSearchParams("");
    searchParams.append("apiKey", apiKey);
    searchParams.append("q", `isbn:${isbn}`);
    const url = new URL(`${endpoint}?${searchParams.toString()}`);
    return fetch(url.toString())
    .then(response => response.text());
}

export function extractBook(json: string): Book | undefined {
    const rawRecord = JSON.parse(json);
    if(rawRecord.items) {
        const info = rawRecord.items[0].volumeInfo;
        const title = info.title;
        const authors = info.authors;
        const publishedDate = info.publishedDate;
        const description = info.description;
        // @ts-ignore
        const isbn10 = info.industryIdentifiers.filter(item => item.type === "ISBN_10")[0].identifier;
        // @ts-ignore
        const isbn13 = info.industryIdentifiers.filter(item => item.type === "ISBN_13")[0].identifier;
        return {
            title,
            authors,
            publishedDate,
            description,
            isbn10,
            isbn13
        }
    } else {
        return undefined;
    }
}