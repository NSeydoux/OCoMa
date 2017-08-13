package fr.ocoma.persistence.graph;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import fr.irit.melodi.sparql.query.dataquery.insert.SparqlInsertData;
import fr.ocoma.model.Comic;
import fr.ocoma.model.Entity;
import fr.ocoma.model.annotations.DataProperty;
import fr.ocoma.model.annotations.OwlClass;
import fr.ocoma.persistence.IPersistence;
import fr.ocoma.persistence.exceptions.FieldTypeNotSupportedException;

public class ObjectGraphMapper implements IPersistence {
	private static final Logger LOGGER = LogManager.getLogger(ObjectGraphMapper.class);
	private static List<Class<?>> supportedAtomicTypes;
	private static List<Class<?>> supportedComposedTypes;
	
	static {
		ObjectGraphMapper.supportedAtomicTypes = new ArrayList<>();
		ObjectGraphMapper.supportedAtomicTypes.add(String.class);
		ObjectGraphMapper.supportedAtomicTypes.add(Boolean.class);
		ObjectGraphMapper.supportedAtomicTypes.add(Integer.class);
		ObjectGraphMapper.supportedAtomicTypes.add(Float.class);
		
		ObjectGraphMapper.supportedComposedTypes = new ArrayList<>();
		ObjectGraphMapper.supportedComposedTypes.add(List.class);
		ObjectGraphMapper.supportedComposedTypes.add(Set.class);
	}
	
	public ObjectGraphMapper() {
		// Initializes the triplestore
		TripleStore.getInstance();
	}
	
	@Override
	public Entity getEntity(String uri) {
		return null;
	}

	@Override
	public void saveEntity(Entity e) {
		LOGGER.trace("saved entity class : "+e.getClass());
		for(Annotation a : e.getClass().getAnnotations()){
			LOGGER.trace(a.getClass());
		}
		if(e.getClass().getAnnotation(OwlClass.class) != null){
			OwlClass classAnnotation = e.getClass().getAnnotation(OwlClass.class);
			String insert = e.getUri()+" rdf:type "+classAnnotation.value()+".";
			for(Field f : e.getClass().getDeclaredFields()){
				if(f.getAnnotation(DataProperty.class) != null){
					DataProperty dataProperty = f.getAnnotation(DataProperty.class);
					String newTriple="";
					boolean fieldTypeSupported = false;
					try {
						for(Class<?> composedClass : ObjectGraphMapper.supportedComposedTypes){
							if(composedClass.isAssignableFrom(f.getType())){
								// The type is a supported composed type
								fieldTypeSupported = true;
								newTriple = this.retrieveComposedSimpleDataTriple(e.getUri(), dataProperty.value(), e, f);
							}
						}
						if(!fieldTypeSupported && ObjectGraphMapper.supportedAtomicTypes.contains(f.getType())){
							// The type is a supported atomic type
							fieldTypeSupported = true;
							newTriple = this.retrieveUniqueSimpleDataTriple(e.getUri(), dataProperty.value(), e, f);
						}
						// TODO : Test if the type is an annotated type, that has an IRI that can be referred to
						if(!fieldTypeSupported){
							throw new FieldTypeNotSupportedException(f.getType().toString());
						} else {
							LOGGER.trace("Persisting a "+f.getType()+" field");
						}
					} catch (FieldTypeNotSupportedException e1) {
						e1.printStackTrace();
					}
					insert += newTriple;
					LOGGER.debug(insert);
				}
			}
		} else {
			LOGGER.fatal("Cannot persist entity "+e.getUri()+", its type has no class annotation");
		}
	}
	
	/**
	 * Returns the triple <Subject Property Data> representing the relationship between an object and
	 * one of its attributes. The attribute must be an atomic value (not a list), and a simple type (not an object)  
	 * @param subject
	 * @param property
	 * @param e
	 * @param f
	 * @return an RDF triple serialized in TTL
	 * @throws FieldTypeNotSupportedException 
	 */
	public String retrieveUniqueSimpleDataTriple(String subject, String property, Entity e, Field f){
		for(Method m : e.getClass().getDeclaredMethods()){
			if(m.getName().toLowerCase().equals("get"+f.getName().toLowerCase())){
				try {
					Object o = m.invoke(e, (Object[])null);
					return subject+" "+property+" \""+o.toString()+"\".";
				} catch (IllegalAccessException e1) {
					e1.printStackTrace();
				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				} catch (InvocationTargetException e1) {
					e1.printStackTrace();
				}
			}
		}
		return null;
	}
	
	public String retrieveComposedSimpleDataTriple(String subject, String property, Entity e, Field f){
		for(Method m : e.getClass().getDeclaredMethods()){
			if(m.getName().toLowerCase().equals("get"+f.getName().toLowerCase())){
				try {
					Iterable<?> iterable = (Iterable<?>) m.invoke(e, (Object[])null);
					String triples = "";
					for(Object o : iterable){
						triples += subject+" "+property+" \""+o.toString()+"\".";
					}
					return triples;
				} catch (IllegalAccessException e1) {
					e1.printStackTrace();
				} catch (IllegalArgumentException e1) {
					e1.printStackTrace();
				} catch (InvocationTargetException e1) {
					e1.printStackTrace();
				}
			}
		}
		return null;
	}
}
