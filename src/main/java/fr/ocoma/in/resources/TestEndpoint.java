package fr.ocoma.in.resources;

import java.io.StringWriter;
import java.net.HttpURLConnection;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.apache.jena.rdf.model.Model;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import fr.ocoma.Controler;
import fr.ocoma.model.Comic;
import fr.ocoma.model.OCoMaModel;

@Path("/test")
public class TestEndpoint {
	private static final Logger LOGGER = LogManager.getLogger(TestEndpoint.class);
	
	@GET
	@Path("/ping")
	public Response ping(){
		return  Response.status(HttpURLConnection.HTTP_OK)
                .entity("pong").build();
	}
	
//	@GET
//	@Path("/kb")
//	public Response getKB(){
//		Model m = TripleStore.getInstance().getModel();
//		StringWriter sw = new StringWriter();
//		m.write(sw, "TTL");
//		LOGGER.debug(sw.toString());
//		return  Response.status(HttpURLConnection.HTTP_OK)
//                .entity(sw.toString()).build();
//	}
	
	@POST
	@Path("/save")
	public Response saveEntity(){
		try{
			Comic b = new Comic("http://example.com/ns#testComic");
			b.setTitle("Le Schtroumpf test");
			b.setEdited(true);
			b.getAuthors().add("http://example.com/ns#unAuteur");
			b.getAuthors().add("http://example.com/ns#unAutreAuteur");
			OCoMaModel.getInstance().saveEntity(b);
		} catch (Exception e){
			e.printStackTrace();
		}	
		return  Response.status(HttpURLConnection.HTTP_OK)
                .entity("Entity saved").build();
	}
}
