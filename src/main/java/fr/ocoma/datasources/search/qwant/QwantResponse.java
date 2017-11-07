package fr.ocoma.datasources.search.qwant;

public class QwantResponse {
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
}
