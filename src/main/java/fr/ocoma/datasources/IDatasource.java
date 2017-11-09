package fr.ocoma.datasources;

import java.util.List;
import fr.ocoma.model.Comic;

public interface IDatasource {
	/**
	 * @param title
	 * @return the comics matching closely the title, an empty list if none
	 */
	public List<Comic> getComicByTitle(String title);
	
	/**
	 * @param ISBN
	 * @return the comic with the required ISBN, null otherwise
	 */
	public Comic getComicByISBN(String ISBN);
}
