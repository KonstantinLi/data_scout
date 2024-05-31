package searchengine.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "query")
@Getter
@Setter
public class Query {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    @Column(columnDefinition = "VARCHAR(255)", unique = true, nullable = false)
    private String text;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "reached_at", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime reachedAt;
}
