package fr.ocoma.persistence.graph;

import fr.ocoma.model.Entity;
import fr.ocoma.persistence.IPersistence;

public class KnowledgeBase implements IPersistence {
	
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
	}

}
