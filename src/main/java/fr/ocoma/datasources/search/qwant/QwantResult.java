package fr.ocoma.datasources.search.qwant;

import java.util.ArrayList;
import java.util.List;

public class QwantResult {
	private List<ResultItem> items;
	
	public QwantResult(){
		this.items = new ArrayList<>();
	}

	public List<ResultItem> getItems() {
		return items;
	}

	public void setItems(List<ResultItem> items) {
		this.items = items;
	}
	
}
