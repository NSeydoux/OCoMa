import { parse } from 'node-html-parser';
import { createSolidDataset, getSolidDataset, getStringNoLocale, getStringWithLocale, getThing, solidDatasetAsMarkdown } from '@inrupt/solid-client';
import { SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

const WORLDCAT_ISBN_API = "http://www.worldcat.org/isbn/";

/**
 * Note: this method should be called on the server side, because of CORS policies
 * @param isbn 
 * @returns The resource permalink
 */
export async function deriveUriFromIsbn(isbn: string): Promise<string | undefined> {
    return fetch(`${WORLDCAT_ISBN_API}${isbn}`)
    .then(
        resp => resp.text()
    ).then(
        html => {
            const root = parse(html);
            for (const element of root.querySelectorAll('[property]')) {
                if(element.getAttribute("property") === "http://schema.org/about") {
                    return element.getAttribute("resource");
                }
            }
            return undefined
        }
    ).catch(err => {
        console.error(err);
        return undefined;
    });
}

export async function lookupWorldcatOclc(oclcUri: string): Promise<string | null> {
    const dataset = await getSolidDataset(oclcUri);
    const item = getThing(dataset, oclcUri);
    if(item) {
        const title = getStringNoLocale(item, SCHEMA_INRUPT_EXT.name) 
            ?? getStringWithLocale(item, SCHEMA_INRUPT_EXT.name, "fr") 
            ?? getStringWithLocale(item, SCHEMA_INRUPT_EXT.name, "en");
        return title ;
    }
    return null;
}

export async function processResource(data: string): Promise<void> {
    // const parser = new Parser();
    // const quads = parser.parse(data);
    // const dataset = await createSolidDataset();
    // for (const quad of quads) {
    //     dataset.
    // }
}