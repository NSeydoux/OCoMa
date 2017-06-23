package fr.ocoma;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import fr.ocoma.endpoint.RESTServer;

public class Controler {
	
	private static final Logger LOGGER = LogManager.getLogger(Controler.class);
	
	public static void main(String[] args) {
		LOGGER.info("Exécution du main !");
		RESTServer.getInstance().run();
	}
}
