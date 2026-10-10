package ai_codebase_assistence.server.services;

import ai_codebase_assistence.server.entity.User;
import ai_codebase_assistence.server.exceptions.NotFoundException;
import ai_codebase_assistence.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TextEncryptor textEncryptor;

    @Transactional
    public User upsertFromGitHub(Map<String, Object> attributes, String accessToken, String scope) {
        if (attributes == null) {
            throw new IllegalArgumentException("GitHub profile attributes are required");
        }
        Long githubId = toLong(attributes.get("id"));
        String login = requiredString(attributes.get("login"), "GitHub login");
        String name = attributes.get("name") == null ? login : String.valueOf(attributes.get("name"));
        String avatarUrl = attributes.get("avatar_url") == null
                ? null
                : String.valueOf(attributes.get("avatar_url"));
        return saveOrUpdate(githubId, login, name, avatarUrl, accessToken, scope);
    }

    @Transactional(readOnly = true)
    public User requireById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public String decryptAccessToken(User user) {
        if (user == null || user.getAccessToken() == null) {
            return null;
        }
        return textEncryptor.decrypt(user.getAccessToken());
    }

    public static Long toLong(Object value) {
        if (value == null) {
            throw new IllegalArgumentException("GitHub profile is missing its numeric id");
        }
        try {
            return new BigDecimal(value.toString()).longValueExact();
        } catch (NumberFormatException | ArithmeticException exception) {
            throw new IllegalArgumentException("GitHub profile contains an invalid numeric id", exception);
        }
    }

    @Transactional
    public void createOrUpdateUser(Long githubId, String githubUsername, String displayName,
                                   String avatarUrl, String accessToken, String scope) {
        saveOrUpdate(githubId, githubUsername, displayName, avatarUrl, accessToken, scope);
    }

    private User saveOrUpdate(Long githubId, String githubUsername, String displayName,
                              String avatarUrl, String accessToken, String scope) {
        if (githubId == null || githubId <= 0) {
            throw new IllegalArgumentException("GitHub id must be a positive number");
        }
        String username = requiredString(githubUsername, "GitHub login");
        String name = displayName == null || displayName.isBlank() ? username : displayName;
        String token = requiredString(accessToken, "GitHub access token");

        User user = userRepository.findByGithubId(githubId).orElseGet(User::new);
        user.setGithubId(githubId);
        user.setGithubUsername(username);
        user.setDisplayName(name);
        user.setAvatarUrl(avatarUrl);
        user.setAccessToken(textEncryptor.encrypt(token));
        user.setTokenScope(scope);
        return userRepository.save(user);
    }

    private static String requiredString(Object value, String fieldName) {
        if (value == null || String.valueOf(value).isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
        return String.valueOf(value);
    }
}
