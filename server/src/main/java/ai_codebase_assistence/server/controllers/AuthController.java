package ai_codebase_assistence.server.controllers;

import ai_codebase_assistence.server.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final CurrentUser currentUser;

    @GetMapping("/login-url")
    public Map<String,String> loginUrl(){
        return Map.of("url","/oauth2/authorization/github");
    }
}
