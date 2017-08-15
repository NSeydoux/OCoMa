package fr.ocoma.model;

public class Entity {
	private final String uri;

	public Entity(String uri){
		this.uri = uri;
	}
	
	public String getUri() {
		return uri;
	}
	
	@Override
	public String toString() {
		return this.uri;
	}
}
