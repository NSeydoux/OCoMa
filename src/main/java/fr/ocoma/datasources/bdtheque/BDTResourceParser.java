package fr.ocoma.datasources.bdtheque;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import fr.ocoma.model.Comic;

public class BDTResourceParser {
	
	public static Comic extractComic(String html){
		return extractComicInfo(extractResourceDescription(html));
	}
	
	public static Element extractResourceDescription(String html){
		Document d = Jsoup.parse(html);
		Elements infos = d.getElementsByClass("infos-albums");
		return infos.first();
	}
	
	public static Comic extractComicInfo(Element htmlFragment){
		if(htmlFragment.tagName().equals("ul")){
			for(Element listElement : htmlFragment.children()){
				System.out.println(listElement.toString());
			}
		} else {
			return null;
		}
		return null;
	}
}
