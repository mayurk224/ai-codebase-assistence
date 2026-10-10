package ai_codebase_assistence.server.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "github_id", unique = true, nullable = false)
    private Long githubId;

    @Column(name = "github_username", nullable = false, length = 50)
    private String githubUsername;

    @Column(name = "display_name", nullable = false, length = 50)
    private String displayName;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "access_token", nullable = false, columnDefinition = "TEXT")
    @JsonIgnore
    private String accessToken;

    @Column(name = "token_scope", length = 500)
    private String tokenScope;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate()
    {
        if(this.createdAt == null)
        {
            this.createdAt = Instant.now();
        }
    }
}
