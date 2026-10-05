package com.example.jwtportal.jwtstudentportal.controller;
import com.example.jwtportal.jwtstudentportal.dto.LoginRequest;
import com.example.jwtportal.jwtstudentportal.dto.LoginResponse;
import com.example.jwtportal.jwtstudentportal.entity.User;
import com.example.jwtportal.jwtstudentportal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<String> tokenOpt = authService.login(request.getUsername(), request.getPassword());

        if (tokenOpt.isEmpty()) {
            // 401 = "I don't know who you are" (authentication failed)
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String token = tokenOpt.get();
        User user = authService.getByUsername(request.getUsername());

        LoginResponse response = new LoginResponse(
                token, user.getUsername(), user.getRole(), user.getName()
        );

        return ResponseEntity.ok(response);
    }
}