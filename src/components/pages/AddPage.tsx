import { SolidDataset } from "@inrupt/solid-client";
import { getSession } from "../../lib/session";
import AddBookForm from "../AddBookForm";

export default function AddPage({
  library,
  setLibrary
}: {
  library?: SolidDataset,
  setLibrary: (library: SolidDataset) => void
}) {
  return (
  <div>
    <h1>Add a book to your library, {getSession().info.webId}</h1>
    { library !== undefined 
      ? <AddBookForm library={library} setLibrary={setLibrary}/>
      : <p>To be add books to your library, please define a library root first.</p>
    }
    
  </div>)
}
