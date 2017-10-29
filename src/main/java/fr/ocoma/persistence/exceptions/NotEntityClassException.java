package fr.ocoma.persistence.exceptions;

public class NotEntityClassException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8956508784852058037L;
	
	public NotEntityClassException(String className){
		super(className+" does not extend the Entity class");
	}

}
