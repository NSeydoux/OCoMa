package fr.ocoma.model;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.framagit.nseydoux.ogm.PersistenceEngine;
import org.framagit.nseydoux.ogm.PersistenceEngineFactory;
import org.framagit.nseydoux.ogm.graph.Resource;

import fr.ocoma.Controler;

public class OCoMaModel {
	private static OCoMaModel instance=null;
	private PersistenceEngine persistence;
	private static Logger LOGGER = LogManager.getLogger(OCoMaModel.class);
	
	private OCoMaModel(){
		persistence = PersistenceEngineFactory.buildPersistenceEngine(Controler.getInstance().getConfiguration().getOgmConfig());
	}
	
	public static OCoMaModel getInstance(){
		if(OCoMaModel.instance == null){
			OCoMaModel.instance = new OCoMaModel();
		}
		return OCoMaModel.instance;
	}
	
	public String saveEntity(Resource toSave){
		persistence.saveEntity(toSave);
		//TODO : should return a URI
		LOGGER.debug("The uri of the newly created entity should be returned");
		return "";
	}
	
	
}
