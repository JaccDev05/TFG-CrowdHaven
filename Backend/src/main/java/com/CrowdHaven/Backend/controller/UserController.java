package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.CheckTokenRequest;
import com.CrowdHaven.Backend.DTOS.LoginRequest;
import com.CrowdHaven.Backend.DTOS.LoginResponse;
import com.CrowdHaven.Backend.DTOS.RegisterRequest;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
@AllArgsConstructor
public class UserController {

    // http://localhost:8080/CrowdHaven/users
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(this.userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId).orElseThrow(
                () -> new IllegalArgumentException("user no encontrado")
        ));
    }

    @GetMapping("/name/{username}")
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.findByUsername(username).orElseThrow(
                ()-> new IllegalArgumentException("user no encontrado")
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest credentials) {
        try {
            LoginResponse loginResponse = this.userService.login(credentials);
            return ResponseEntity.ok(loginResponse);
        }
        catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = this.userService.createUser(registerRequest);
            return ResponseEntity.ok(user);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/check-token")
    public ResponseEntity<Boolean> checkToken(@RequestBody CheckTokenRequest checkTokenRequest) {
        return ResponseEntity.ok(this.userService.checkToken(checkTokenRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id , @RequestBody User userUp) {
        return ResponseEntity.ok(userService.updateUser(id, userUp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        this.userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }


}
