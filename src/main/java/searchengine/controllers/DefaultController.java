package searchengine.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import searchengine.model.Page;
import searchengine.services.interfaces.PageService;

import java.net.HttpURLConnection;
import java.net.URL;

@Controller
@RequiredArgsConstructor
public class DefaultController {
    private final PageService pageService;

    /**
     * Метод формирует страницу из HTML-файла index.html,
     * который находится в папке resources/templates.
     * Это делает библиотека Thymeleaf.
     */
    @RequestMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/displayPage")
    public String displayPage(
            @RequestParam(name = "site") @org.hibernate.validator.constraints.URL(
                regexp = "^http(s)?://[-A-Za-z0-9.]+",
                message = "URL адреса сайта должен соответствовать формату http(-s)://www.site.com") String siteURL,
            @RequestParam @org.hibernate.validator.constraints.URL(
                    regexp = "^/.*[^/]$",
                    message = "URI адреса страницы должен соответствовать формату /path/to/resource/") String path,
            Model model) {

        Page page = pageService.getPageBySiteAndPath(siteURL, path);
        model.addAttribute("content", page.getContent());
        return "page";
    }

    @GetMapping("/check-internet")
    @ResponseBody
    public ResponseEntity<String> checkInternetConnection() {
        try {
            URL url = new URL("https://www.google.com");
            HttpURLConnection urlConnect = (HttpURLConnection) url.openConnection();
            urlConnect.setConnectTimeout(2000);
            urlConnect.connect();
            if (urlConnect.getResponseCode() == 200) {
                return ResponseEntity.ok("Online");
            } else {
                return ResponseEntity.status(503).body("Offline");
            }
        } catch (Exception e) {
            return ResponseEntity.status(503).body("Offline");
        }
    }
}
