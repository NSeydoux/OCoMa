package fr.ocoma.config;

public class OCoMaConfiguration {
	private String tripleStoreDescFile;
	private Integer port;
	private String url;
	private String ogmConfig;

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

	public String getOgmConfig() {
		return ogmConfig;
	}

	public void setOgmConfig(String ogmConfig) {
		this.ogmConfig = ogmConfig;
	}
}
