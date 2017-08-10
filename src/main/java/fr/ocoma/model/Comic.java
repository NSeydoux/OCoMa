package fr.ocoma.model;

import java.util.Map;

public class Comic extends Entity {

	private String title;
	private Map<String, String> authors;
	
	public Comic(String uri) {
		super(uri);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Map<String, String> getAuthors() {
		return authors;
	}

	public void setAuthors(Map<String, String> authors) {
		this.authors = authors;
	}
	
	

}
