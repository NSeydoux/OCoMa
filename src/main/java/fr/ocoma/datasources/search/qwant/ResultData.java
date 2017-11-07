package fr.ocoma.datasources.search.qwant;


public class ResultData {
	private ResultQuerySummary query;
	private QwantResult result;
	
	public ResultQuerySummary getQuery() {
		return query;
	}
	public void setQuery(ResultQuerySummary query) {
		this.query = query;
	}
	public QwantResult getResult() {
		return result;
	}
	public void setResult(QwantResult result) {
		this.result = result;
	}
	
}
