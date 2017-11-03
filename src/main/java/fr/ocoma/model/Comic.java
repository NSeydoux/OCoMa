package fr.ocoma.model;

import java.util.ArrayList;
import java.util.List;

import org.framagit.nseydoux.ogm.annotations.DataProperty;
import org.framagit.nseydoux.ogm.annotations.ObjectProperty;
import org.framagit.nseydoux.ogm.annotations.OwlClass;
import org.framagit.nseydoux.ogm.graph.Resource;

@OwlClass("http://comicmeta.org/cbo/Comic")
public class Comic extends Resource {

	@DataProperty("http://purl.org/dc/terms/title")
	private String title;
	@DataProperty("http://example.com/ns#published")
	private Boolean edited;
	@ObjectProperty("http://comicmeta.org/cbo/creator")
	private List<String> authors;
	
	public Comic(String uri) {
		super(uri);
		this.authors = new ArrayList<>();
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public Boolean getEdited(){
		return this.edited;
	}
	
	public void setEdited(Boolean edited){
		this.edited = edited;
	}

	public List<String> getAuthors() {
		return authors;
	}

	public void setAuthors(List<String> authors) {
		this.authors = authors;
	}
	
	

}
