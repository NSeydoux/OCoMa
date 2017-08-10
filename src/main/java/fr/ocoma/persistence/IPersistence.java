package fr.ocoma.persistence;

import fr.ocoma.model.Entity;

public interface IPersistence {
	/**
	 * Returns an entity based on its uri. 
	 * @param uri
	 * @return the corresponding entity, with the most specific type possible
	 */
	Entity getEntity(String uri);
	
	/**
	 * Persists an entity, with the most specific type possible
	 * @param e
	 */
	void saveEntity(Entity e);
}
