import { asIri, getSolidDataset, getThing, getThingAll, getUrl, getUrlAll, thingAsMarkdown, ThingPersisted } from "@inrupt/solid-client";
import { fetch, getSession } from "./auth";
import { SOLID } from "@inrupt/vocab-solid-common";
import { RDF, SCHEMA_INRUPT_EXT } from "@inrupt/vocab-common-rdf";

const SCHEMA_BOOK = `${SCHEMA_INRUPT_EXT.NAMESPACE}Book`

// export function isSetup(webid: string): boolean {
//     const profile = getSolidDataset(webid);

// }

export async function addLibraryToTypeIndex() {
    console.log("Looking up type index")
    const webid = getSession()?.info.webId;
    if(webid === undefined) {
        console.log("Cannot update type index: Not logged in.")
        return;
    }
    const profileDoc = await getSolidDataset(webid);
    const profile = getThing(profileDoc, webid);
    if (profile === null) {
        console.log("Mismatch between WebID and profile");
        return;
    }
    const privateTypeIndex = getUrl(profile, SOLID.privateTypeIndex);
    if (privateTypeIndex === null) {
        console.log("No type index in the profile");
        return;
    }
    const privateTypeIndexDoc = await getSolidDataset(privateTypeIndex, {fetch: fetch});
    let bookTypeIndexEntryExists = false;
    for (const registration of getThingAll(privateTypeIndexDoc) ) {
        // console.log(thingAsMarkdown(registration))

        if (getUrlAll(registration, RDF.type).includes(SOLID.TypeRegistration.toString())) {
            console.log(`${asIri(registration as ThingPersisted)} is a registration`)
            console.log(getUrlAll(registration, SOLID.forClass))
            console.log(SCHEMA_BOOK)
            bookTypeIndexEntryExists = bookTypeIndexEntryExists || getUrlAll(registration, SOLID.forClass).includes(SCHEMA_BOOK);
        }
    }
    console.log(`Book type index entry exists: ${bookTypeIndexEntryExists}`);
}