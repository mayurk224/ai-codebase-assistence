package ai_codebase_assistence.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;

@Configuration
public class CryptoConfig {

    private static final int SALT_HEX_LENGTH = 16;

    @Bean
    TextEncryptor tokenEncryptor(
            @Value("${app.token-encryptor-password}") String password,
            @Value("${app.token-encryptor-salt}") String salt) {
        validatePassword(password);
        validateSalt(salt);
        return Encryptors.text(password, salt);
    }

    private static void validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalStateException(
                    "app.token-encryptor-password (TOKEN_ENCRYPTOR_PASSWORD) must be set to a non-blank value");
        }
    }

    private static void validateSalt(String salt) {
        if (salt == null || salt.isBlank()) {
            throw new IllegalStateException(
                    "app.token-encryptor-salt (TOKEN_ENCRYPTOR_SALT) must be set to a hexadecimal value");
        }
        if (!salt.matches("[0-9a-fA-F]+")) {
            throw new IllegalStateException(
                    "app.token-encryptor-salt (TOKEN_ENCRYPTOR_SALT) must be a hexadecimal string, but was \""
                            + salt + "\". Generate one with: openssl rand -hex 8");
        }
        if (salt.length() != SALT_HEX_LENGTH) {
            throw new IllegalStateException(
                    "app.token-encryptor-salt (TOKEN_ENCRYPTOR_SALT) must be exactly " + SALT_HEX_LENGTH
                            + " hex characters (8 bytes), but was " + salt.length() + ". Generate one with: openssl rand -hex 8");
        }
    }
}
