package fr.ocoma.config;

public class Configuration {
	private String tripleStoreDescFile;
	private Integer port;
	private String url;

	public String getTripleStoreDescFile() {
		return tripleStoreDescFile;
	}

	public void setTripleStoreDescFile(String tripleStoreDescFile) {
		this.tripleStoreDescFile = tripleStoreDescFile;
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
