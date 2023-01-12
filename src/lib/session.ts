import { Session } from "@inrupt/solid-client-authn-browser";

let session: Session;

/**
 * @returns a session singleton.
 */
export function getSession() {
  if(session === undefined) {
    session = new Session();
  }
  return session;
}
