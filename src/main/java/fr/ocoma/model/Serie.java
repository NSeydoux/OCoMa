package fr.ocoma.model;

import org.framagit.nseydoux.ogm.graph.Resource;

public class Serie extends Resource{

	private String title;
	private Integer publishedElements;
	
	public Serie(String uri) {
		super(uri);
	}

}
