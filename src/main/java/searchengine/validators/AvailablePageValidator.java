package searchengine.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import searchengine.annotations.AvailablePage;
import searchengine.dto.PageData;
import searchengine.services.utils.PageIntrospect;
import searchengine.services.utils.PropertiesUtil;

@Component
@RequiredArgsConstructor
public class AvailablePageValidator implements ConstraintValidator<AvailablePage, PageData> {
    private static final Logger LOGGER = LoggerFactory.getLogger(AvailablePageValidator.class);

    private final PropertiesUtil propertiesUtil;

    @Override
    public void initialize(AvailablePage constraintAnnotation) {
        LOGGER.debug("AvailablePageValidator initialized");
    }

    @Override
    public boolean isValid(PageData pageData, ConstraintValidatorContext constraintValidatorContext) {
        String url = pageData.getUrl();
        if (!url.endsWith("/"))
            pageData.setUrl(url + "/");

        PageIntrospect page = new PageIntrospect(url);
        return propertiesUtil.siteIsAvailableInConfig(page.getMainUrl());
    }
}
