import { Session } from "@inrupt/solid-client-authn-browser";
import { fetch as crossFetch } from "cross-fetch";

let serverSideSession: Session | undefined = undefined;
export let fetch: typeof crossFetch = crossFetch;

export function getSession(): Session | undefined {
    return serverSideSession;
}

export function setSession(session: Session) {
    serverSideSession = session;
    fetch = serverSideSession.fetch;
}
