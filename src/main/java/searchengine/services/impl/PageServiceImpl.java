package searchengine.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import searchengine.model.Page;
import searchengine.model.Site;
import searchengine.repositories.PageRepository;
import searchengine.repositories.SiteRepository;
import searchengine.services.interfaces.PageService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PageServiceImpl implements PageService {
    private final SiteRepository siteRepository;
    private final PageRepository pageRepository;

    public Page getPageBySiteAndPath(String siteURL, String path) {
        if (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        Site site = siteRepository.findByUrl(siteURL);
        return Optional.ofNullable(pageRepository.findBySiteAndPath(site, path))
                .orElse(pageRepository.findBySiteAndPath(site, path + "/"));
    }
}
