import { getSession } from "../../lib/session";
import AddBookForm from "../AddBookForm";

export default function AddPage() {
  return (
  <div>
    <h1>Add a book to your library, {getSession().info.webId}</h1>
    {/* <Link href="/">Go back to homepage</Link> */}
    <AddBookForm />
  </div>)
}
