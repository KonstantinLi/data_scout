package searchengine.exceptions;

public class LuceneException extends RuntimeException {
    public LuceneException(String language) {
        super("Lucene " + language.toUpperCase() + " morphology not found");
    }
}
