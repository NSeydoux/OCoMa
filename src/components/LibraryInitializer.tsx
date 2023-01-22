import { 
  getContainedResourceUrlAll,
  getSolidDataset,
  isContainer,
  getPodUrlAll,
  createContainerInContainer,
  getSourceIri,
  getThing,
  addIri,
  setThing,
  saveSolidDatasetAt
} from "@inrupt/solid-client";
import { RDF } from "@inrupt/vocab-common-rdf";
import { useEffect, useState } from "react";
import { OCOMA } from "../lib/data/vocabConstants";
import { getSession } from "../lib/session";

export default function LibraryInitializer({ setLibraryRoot }: { setLibraryRoot: (root: string) => void }) {
  const [podRootUrl, setPodRootUrl] = useState<string>();
  const [rootUrl, setRootUrl] = useState<string>();
  const [childResources, setChildResources] = useState<string[]>([]);
  const session = getSession();

  useEffect(() => {
    (async () => {
      if (session.info.webId === undefined) {
        return;
      }
      if (rootUrl === undefined) {
        const [pod] = await getPodUrlAll(session.info.webId, { fetch: session.fetch });
        setPodRootUrl(pod);
        setRootUrl(pod);
        return;
      }
      const dataset = await getSolidDataset(rootUrl, { fetch: session.fetch });
      setChildResources(getContainedResourceUrlAll(dataset));
    })();
  }, [rootUrl, session.fetch, session.info.webId]);

  return (
    <div>
      <p>Pod resources:</p>
      <p>Current root: {rootUrl}</p>
      <ul>
        {podRootUrl !== rootUrl 
        ? <li 
        onClick={() => {
          // Navigate to the parent resource if not at the Pod root
          if(podRootUrl !== rootUrl) {
            setRootUrl((curRoot) => new URL("../", curRoot).href);
          }
        }}>
          <u>..</u>
        </li>
        : <></>}
        { childResources.map((resourceUrl) => (
          isContainer(resourceUrl)
          ? <li 
            key={resourceUrl}
            onClick={() => {
                setRootUrl(resourceUrl)
            }}><u>{resourceUrl}</u>
          </li>
          : <></>
        )) }
      </ul>
      <button 
        type="button"
        onClick={async () => {
          if (rootUrl === undefined) {
            return;
          }
          const created = await createContainerInContainer(rootUrl, { fetch: session.fetch, slugSuggestion: "comics-library" });
          const createdIri = getSourceIri(created);
          const containerWithNew = await getSolidDataset(rootUrl, { fetch: session.fetch });
          const newContainerThing = getThing(containerWithNew, createdIri);
          const typedContainerThing = addIri(newContainerThing!, RDF.type, OCOMA.Library);
          const updatedContainer = setThing(containerWithNew, typedContainerThing);
          await saveSolidDatasetAt(rootUrl, updatedContainer, { fetch: session.fetch });
          setChildResources(getContainedResourceUrlAll(updatedContainer));
          setLibraryRoot(createdIri);
        }}>
          Create library root
        </button>
    </div>
  )
}
