package fr.ocoma;

import fr.ocoma.endpoint.RESTServer;

public class Controler {
	
	public static void main(String[] args) {
		System.out.println("Exécution du main !");
		RESTServer.getInstance().run();
	}
}
