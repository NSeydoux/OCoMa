package fr.ocoma.datasources.bdtheque;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.jersey.client.ClientConfig;

import fr.ocoma.datasources.search.qwant.Qwant;
import fr.ocoma.model.Comic;

public class BDTheque {
	private static Logger LOGGER = LogManager.getLogger(BDTheque.class);
	
	public static boolean isBDThequeRessourceURL(String url){
		Pattern p = Pattern.compile("https://www.bedetheque.com/BD-(.+?)-(\\d+).html");
		Matcher m = p.matcher(url);
		return m.matches();
	}
	
	public static String retrieveHTMLResource(String url){	
		Client client = ClientBuilder.newClient(new ClientConfig());
		Response r = client.target(url)
				.request()
				.get();
		if(r.getStatus() == 200){
			InputStream is = (InputStream)r.getEntity();
			BufferedReader reader = new BufferedReader(new InputStreamReader(is));
			StringBuilder result = new StringBuilder();
			String line;
			try {
				while ((line = reader.readLine()) != null) {
				    result.append(line);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			return result.toString();
		}
		return null;
	}
	
	public static void main(String[] args) {
		if(isBDThequeRessourceURL("https://www.bedetheque.com/BD-Plus-pres-de-toi-Tome-1-Premiere-partie-311711.html")){
			System.out.println("matches");
			String html = retrieveHTMLResource("https://www.bedetheque.com/BD-Plus-pres-de-toi-Tome-1-Premiere-partie-311711.html");
			Comic c = BDTResourceParser.extractComic(html);
		} else {
			System.out.println("No match");
		}
	}
}
