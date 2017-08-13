package fr.ocoma.in.resources;

import java.net.HttpURLConnection;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import fr.ocoma.Controler;
import fr.ocoma.model.Comic;

@Path("/test")
public class TestEndpoint {
	
	@GET
	@Path("/ping")
	public Response ping(){
		return  Response.status(HttpURLConnection.HTTP_OK)
                .entity("pong").build();
	}
	
	@POST
	@Path("/save")
	public Response saveEntity(){
		Comic b = new Comic("http://example.com/ns#testComic");
		b.setTitle("Le Schtroumpf test");
		b.setEdited(true);
		b.getAuthors().add("Un auteur");
		b.getAuthors().add("Un autre auteur");
		Controler.getInstance().getKb().saveEntity(b);
		return  Response.status(HttpURLConnection.HTTP_OK)
                .entity("Entity saved").build();
	}
}
