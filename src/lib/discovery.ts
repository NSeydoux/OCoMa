import {
  getPodUrlAll,
  getSolidDataset,
  getContainedResourceUrlAll,
  getThing,
  getUrlAll,
  SolidDataset,
  saveSolidDatasetInContainer,
  createSolidDataset,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { RDF } from "@inrupt/vocab-common-rdf";
import { OCOMA } from "./data/vocabConstants";
import { getSession } from "./session";

export async function discoverLibraryRoot(
  session: Session
): Promise<string | undefined> {
  if (!session.info.isLoggedIn) {
    return undefined;
  }
  const pods = await getPodUrlAll(session.info.webId!, {
    fetch: session.fetch,
  });
  if (pods.length === 0) {
    return undefined;
  }
  // Arbitrarily pick a Pod. In the future, the user should be prompted.
  const podRoot = pods[0];
  const podRootDataset = await getSolidDataset(podRoot, {
    fetch: session.fetch,
  });
  const candidateLibraryContainers = getContainedResourceUrlAll(
    podRootDataset
  ).filter((containedResourceUrl) => {
    const resourceThing = getThing(podRootDataset, containedResourceUrl);
    return resourceThing === null
      ? false
      : getUrlAll(resourceThing, RDF.type).includes(OCOMA.Library);
  });
  return candidateLibraryContainers.length > 0
    ? candidateLibraryContainers[0]
    : undefined;
}

// For the time being, let's assume all of the data is in a single resource.
export async function loadLibrary(
  libraryRoot: string,
  session: Session
): Promise<SolidDataset> {
  const libraryContainer = await getSolidDataset(libraryRoot, {
    fetch: session.fetch,
  });
  const containedResources = getContainedResourceUrlAll(libraryContainer);
  if (containedResources.length === 0) {
    // The library has just been created, and doesn't contain any resources.
    // A new resource is created and returned.
    return await saveSolidDatasetInContainer(
      libraryRoot,
      createSolidDataset(),
      { fetch: getSession().fetch }
    );
  }
  if (containedResources.length > 1) {
    console.warn(
      `More than one resource found in ${libraryRoot}, arbitrarily loading ${containedResources[0]}`
    );
  }
  return await getSolidDataset(containedResources[0], { fetch: session.fetch });
}
