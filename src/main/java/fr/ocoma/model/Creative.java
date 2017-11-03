package fr.ocoma.model;

import org.framagit.nseydoux.ogm.graph.Resource;

public class Creative extends Resource {

	private String name;
	
	public Creative(String uri) {
		super(uri);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
