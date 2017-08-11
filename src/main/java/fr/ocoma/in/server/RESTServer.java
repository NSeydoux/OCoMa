package fr.ocoma.in.server;

import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import fr.ocoma.in.resources.FrontendEndpoint;
import fr.ocoma.in.resources.TestEndpoint;

public class RESTServer extends Thread {
	
	private static final Logger LOGGER = LogManager.getLogger(RESTServer.class);
    private String name;
    private String baseUrl;
    private int port;
    private String url;
    private static HttpServer server;

    public RESTServer(String url, String name, int port){
        this.name = name;
        this.port = port;
        this.baseUrl = url;
        this.url = url +":"+port+"/"+name;
    }

    public int getListeningPort(){
        return this.port;
    }

    public String getURL(){
        return this.url;
    }

    public void run() {
        LOGGER.info("Setting up REST server" + name);
        URI baseUri = UriBuilder.fromUri(this.baseUrl+"/"+this.name).port(this.port).build();
        LOGGER.info("Configuring resources");
        ResourceConfig rc = new ResourceConfig()
        		.register(FrontendEndpoint.class)
                .register(TestEndpoint.class);
        
        LOGGER.info("Creating the HTTP server...");
        server = GrizzlyHttpServerFactory.createHttpServer(baseUri, rc);
        try {
            LOGGER.info("Starting REST server");
            server.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
