package searchengine.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import searchengine.model.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueryRepository extends JpaRepository<Query, Integer> {
    Optional<Query> findByText(String text);
    List<Query> findTop10ByTextStartingWithIgnoreCaseOrderByReachedAtDesc(String queryText);
}
