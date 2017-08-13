package fr.ocoma.persistence.exceptions;

public class FieldTypeNotSupportedException extends Exception {

	private static final long serialVersionUID = -7117307501472167694L;

	public FieldTypeNotSupportedException(String type){
		super(type+" cannot be serialized by the Object-Graph Mapper");
	}
}
