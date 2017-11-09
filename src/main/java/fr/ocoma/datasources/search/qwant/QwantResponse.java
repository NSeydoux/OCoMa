package fr.ocoma.datasources.search.qwant;

import fr.ocoma.datasources.search.ISearchResult;

public class QwantResponse implements ISearchResult {
	private String status;
	private ResultData data;
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public ResultData getData() {
		return data;
	}
	public void setData(ResultData data) {
		this.data = data;
	}
	
	@Override
	public String getURL() {
		return this.data.getResult().getItems().get(0).getUrl();
	}
	@Override
	public String getDescription() {
		return this.data.getResult().getItems().get(0).getDesc();
	}
}
