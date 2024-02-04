function buildClientIdentifierDoc() {
    const baseUrl = `https://${process.env.VERCEL_URL}/` ?? "http://localhost:3000/";
    return {
      "@context": ["https://www.w3.org/ns/solid/oidc-context.jsonld"],
      client_id: new URL("/id", baseUrl).href,
      client_name: "OCoMa",
      // URLs the user will be redirected back to upon successful authentication:
      redirect_uris: [baseUrl],
      // URLs the user can be redirected to back to upon successful logout:
      post_logout_redirect_uris: [baseUrl],
      // Support refresh_tokens for refreshing the session:
      grant_types: ["authorization_code", "refresh_token"],
      // The default scopes don't include offline_access
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