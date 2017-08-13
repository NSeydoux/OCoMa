package fr.ocoma.persistence.graph;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import fr.irit.melodi.sparql.query.dataquery.insert.SparqlInsertData;
import fr.ocoma.model.Comic;
import fr.ocoma.model.Entity;
import fr.ocoma.model.annotations.DataProperty;
import fr.ocoma.model.annotations.OwlClass;
import fr.ocoma.persistence.IPersistence;

public class KnowledgeBase implements IPersistence {
	private static final Logger LOGGER = LogManager.getLogger(KnowledgeBase.class);
	
	public KnowledgeBase() {
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
					insert += this.retrieveUniqueSimpleDataTriple(e.getUri(), dataProperty.value(), e, f);
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

}
