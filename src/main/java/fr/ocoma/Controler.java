package fr.ocoma;

import java.io.File;
import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.framagit.nseydoux.ogm.PersistenceEngine;
import org.framagit.nseydoux.ogm.PersistenceEngineFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fr.ocoma.config.OCoMaConfiguration;
import fr.ocoma.in.server.RESTServer;

public class Controler {
	
	private static final Logger LOGGER = LogManager.getLogger(Controler.class);
	private static final String appName = "ocoma";
	
	private static Controler instance;
	private OCoMaConfiguration config;
	
	
	private Controler(String configFile){
		ObjectMapper mapper = new ObjectMapper();
        if(configFile != null){
            try {
                this.config = mapper.readValue(new File(configFile), OCoMaConfiguration.class);
            } catch (JsonParseException ex) {
                LOGGER.error("Parsing failed");
                ex.printStackTrace();
            } catch (JsonMappingException e) {
            	LOGGER.error("Mapping exception");
				e.printStackTrace();
			} catch (IOException e) {
				LOGGER.error("IO exception");
				e.printStackTrace();
			}
        }
	}
	
	public static Controler buildInstance(String configFile){
		Controler.instance = new Controler(configFile);
		return Controler.instance;
	}
	
	public static Controler getInstance(){
		return Controler.instance;
	}	
	
	public OCoMaConfiguration getConfiguration(){
		return this.config;
	}
	
	public static void main(String[] args) {
		LOGGER.info("Exécution du main !");
		if(args[0] != null){
			Controler.buildInstance(args[0]);
			RESTServer rs = new RESTServer(Controler.getInstance().config.getUrl(), Controler.appName, Controler.getInstance().config.getPort());
			rs.run();
		} else {
			LOGGER.fatal("Usage : mvn exec:java -Dconfig=<config file path>");
		}
	}
}
