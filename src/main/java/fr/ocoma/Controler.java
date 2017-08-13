package fr.ocoma;

import java.io.File;
import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fr.ocoma.config.Configuration;
import fr.ocoma.in.server.RESTServer;
import fr.ocoma.persistence.graph.ObjectGraphMapper;

public class Controler {
	
	private static final Logger LOGGER = LogManager.getLogger(Controler.class);
	private static final String appName = "ocoma";
	
	private static Controler instance;
	private Configuration config;
	private ObjectGraphMapper kb;
	
	private Controler(File configFile){
		ObjectMapper mapper = new ObjectMapper();
        if(configFile != null){
            try {
                this.config = mapper.readValue(configFile, Configuration.class);
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
	
	public static Controler buildInstance(File configFile){
		Controler.instance = new Controler(configFile);
		Controler.instance.kb = new ObjectGraphMapper();
		return Controler.instance;
	}
	
	public static Controler getInstance(){
		return Controler.instance;
	}	
	
	public Configuration getConfiguration(){
		return this.config;
	}
	

	public ObjectGraphMapper getKb() {
		return kb;
	}
	
	public static void main(String[] args) {
		LOGGER.info("Exécution du main !");
		if(args[0] != null){
			Controler.buildInstance(new File(args[0]));
			RESTServer rs = new RESTServer(Controler.getInstance().config.getUrl(), Controler.appName, Controler.getInstance().config.getPort());
			rs.run();
		} else {
			LOGGER.fatal("Usage : mvn exec:java -Dconfig=<config file path>");
		}
	}
}
