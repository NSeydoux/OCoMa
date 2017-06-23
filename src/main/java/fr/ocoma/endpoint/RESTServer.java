package fr.ocoma.endpoint;

import java.io.IOException;
import java.net.URI;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import fr.ocoma.endpoint.resources.FrontendEndpoint;

public class RESTServer extends Thread {
	
	private static final Logger LOGGER = LogManager.getLogger(RESTServer.class);

	public static final String BASE_URL = "http://127.0.0.1:9555/ocoma";
	private static RESTServer instance;
	// Private constructor to force the use as a singleton
	private RESTServer(){}
	public static RESTServer getInstance(){
		if(RESTServer.instance == null){
			RESTServer.instance = new RESTServer();
		}
		return RESTServer.instance;
	}

    /**
     * Starts Grizzly HTTP server exposing JAX-RS resources defined in this application.
     * @return Grizzly HTTP server.
     */
    public static HttpServer startServer() {
        // create a resource config that scans for JAX-RS resources and providers
        final ResourceConfig rc = new ResourceConfig().packages("fr.ocoma.endpoint.resources");
        // create and start a new instance of grizzly http server
        // exposing the Jersey application at BASE_URI
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URL), rc);
    }
	
	public void run() {
		LOGGER.info("Setting up OCoMa REST services");
		startServer();
	}
}
