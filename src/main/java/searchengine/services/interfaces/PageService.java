package searchengine.services.interfaces;

import searchengine.model.Page;

public interface PageService {
    Page getPageBySiteAndPath(String siteURL, String path);
}
