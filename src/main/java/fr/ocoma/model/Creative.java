package fr.ocoma.model;

public class Creative extends Entity {

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
