package fr.ocoma.persistence.graph;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import fr.ocoma.Controler;
import fr.ocoma.model.Entity;
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
	}

}
