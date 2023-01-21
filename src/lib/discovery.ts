import { getPodUrlAll, getSolidDataset, getContainedResourceUrlAll, getThing, getUrlAll } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { RDF } from "@inrupt/vocab-common-rdf";
import { OCOMA } from "./data/vocabConstants";

export async function discoverLibraryRoot(session: Session): Promise<string | null> {
  if (!session.info.isLoggedIn) {
    return null;
  }
  const pods = await getPodUrlAll(session.info.webId!, { fetch: session.fetch });
  if (pods.length === 0) {
    return null;
  }
  // Arbitrarily pick a Pod. In the future, the user should be prompted.
  const podRoot = pods[0];
  const podRootDataset = await getSolidDataset(podRoot, { fetch: session.fetch });
  const candidateLibraryContainers = getContainedResourceUrlAll(podRootDataset)
    .filter((containedResourceUrl) => {
      const resourceThing = getThing(podRootDataset, containedResourceUrl);
      return resourceThing === null 
        ? false 
        : getUrlAll(resourceThing, RDF.type).includes(OCOMA.Library);
    }
  );
  return candidateLibraryContainers.length > 0
    ? candidateLibraryContainers[0]
    : null;
}
