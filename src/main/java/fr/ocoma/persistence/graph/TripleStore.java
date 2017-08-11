package fr.ocoma.persistence.graph;

import org.apache.jena.query.Dataset;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.ReadWrite;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.tdb.TDBFactory;
import org.apache.jena.update.UpdateAction;

import fr.ocoma.Controler;

public class TripleStore {
	private static TripleStore instance;
	private Dataset dataset;
	
	private TripleStore(String assemblerFilePath){
		dataset = TDBFactory.assembleDataset(assemblerFilePath);
	}
	
	public static TripleStore getInstance(){
		if(TripleStore.instance == null){
			TripleStore.instance = new TripleStore(Controler.getInstance().getConfiguration().getTripleStoreDescFile());
		}
		return TripleStore.instance;
	}
	
	public ResultSet selectQuery(String query){
		this.dataset.begin(ReadWrite.READ) ;
		ResultSet rs = null;
		try(QueryExecution qExec = QueryExecutionFactory.create(query, this.dataset)) {
		     rs = qExec.execSelect() ;
		} finally {
			dataset.end(); 
		}
		return rs;
	}
	
	public void updateQuery(String query){
		this.dataset.begin(ReadWrite.WRITE) ;
		try(QueryExecution qExec = QueryExecutionFactory.create(query, this.dataset)) {
			UpdateAction.parseExecute(query, this.dataset);
			this.dataset.commit();
		} finally {
			dataset.end(); 
		}
	}
	
	public Model decribeQuery(String query){
		this.dataset.begin(ReadWrite.READ) ;
		Model result=null;
		try(QueryExecution qExec = QueryExecutionFactory.create(query, this.dataset)) {
		     result= qExec.execDescribe() ;
		} finally {
			dataset.end(); 
		}
		return result;
	}
	
	public Model constructQuery(String query){
		this.dataset.begin(ReadWrite.READ) ;
		Model result=null;
		try(QueryExecution qExec = QueryExecutionFactory.create(query, this.dataset)) {
		     result= qExec.execConstruct() ;
		} finally {
			dataset.end(); 
		}
		return result;
	}
}
