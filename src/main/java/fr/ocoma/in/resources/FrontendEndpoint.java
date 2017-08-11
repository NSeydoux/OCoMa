package fr.ocoma.in.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/frontend-api")
public class FrontendEndpoint {
	
	@GET
    @Produces(MediaType.TEXT_PLAIN)
	public String hello() {
		return "Frontend endpoint is up.";
	}

}
