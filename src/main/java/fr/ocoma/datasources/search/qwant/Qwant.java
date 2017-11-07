package fr.ocoma.datasources.search.qwant;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import org.apache.http.client.utils.URIUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.jersey.client.ClientConfig;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;


public class Qwant {
	private static final Logger LOGGER = LogManager.getLogger(Qwant.class);
	public static final String endpoint = "https://api.qwant.com/egp/search/web";
	
	// GET https://api.qwant.com/egp/search/web?q=bdtheque born to be a larve returns structured json
	public static Response search(String query){
		
		Client client = ClientBuilder.newClient(new ClientConfig());
		try {
			return client.target(Qwant.endpoint+"?q="+URLEncoder.encode(query, "utf-8"))
					.request()
					.get();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static void main(String[] args) {
		Response r = Qwant.search("Born to be a larve");
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
		System.out.println(result.toString());
		Gson gson = new Gson();
		QwantResponse qr = gson.fromJson(result.toString(), QwantResponse.class);
		System.out.println(qr.getStatus());
	}
}
