function buildClientIdentifierDoc() {
    const baseUrl = process.env.VERCEL_URL ?? "https://localhost:3000/";
    console.log("Base URL: ", baseUrl);
    return {
      "@context": ["https://www.w3.org/ns/solid/oidc-context.jsonld"],
      client_id: new URL("/id", baseUrl).href,
      client_name: "OCoMa",
      // URLs the user will be redirected back to upon successful authentication:
      redirect_uris: baseUrl,
      // URLs the user can be redirected to back to upon successful logout:
      post_logout_redirect_uris: baseUrl,
      // Support refresh_tokens for refreshing the session:
      grant_types: ["authorization_code", "refresh_token"],
      // The scope must be explicit, as the default doesn't include offline_access,
      // preventing the refresh token from being issued.
      scope: "openid webid offline_access",
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      application_type: "web",
      require_auth_time: false,
    };
}

export async function GET() {
    return new Response(JSON.stringify(buildClientIdentifierDoc()), {
        headers: {
            "Content-Type": "application/ld+json",
        },
        status: 200,
    })
}