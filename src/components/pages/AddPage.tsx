import { SolidDataset } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import AddBookForm from "../AddBookForm";

export default function AddPage({
  library,
  setLibrary
}: {
  library?: SolidDataset,
  setLibrary: (library: SolidDataset) => void
}) {
  const { session } = useSession()
  return (
  <div>
    <h1>Add a book to your library, {session.info.webId}</h1>
    { library !== undefined 
      ? <AddBookForm library={library} setLibrary={setLibrary}/>
      : <p>To be add books to your library, please define a library root first.</p>
    }
    
  </div>)
}
