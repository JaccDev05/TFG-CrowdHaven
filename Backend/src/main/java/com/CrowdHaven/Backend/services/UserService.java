package com.CrowdHaven.Backend.services;


import com.CrowdHaven.Backend.DTOS.CheckTokenRequest;
import com.CrowdHaven.Backend.DTOS.LoginRequest;
import com.CrowdHaven.Backend.DTOS.LoginResponse;
import com.CrowdHaven.Backend.DTOS.RegisterRequest;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.UserRepository;
import com.CrowdHaven.Backend.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,

                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }


    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    public Optional<User> getUserById(long id) {
        return this.userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public void deleteUserById(long id) {
        this.userRepository.deleteById(id);
    }

    @Transactional
    public User createUser(RegisterRequest userFromFront) {

        if (this.userRepository.existsByUsername(userFromFront.getUsername())) {
            throw new IllegalArgumentException("User already exists");
        }

        else {

            User user = new User();
            user.setEmail(userFromFront.getEmail());
            user.setUsername(userFromFront.getUsername());
            user.setPassword(
                    this.passwordEncoder.encode(userFromFront.getPassword())
            );

            user = this.userRepository.save(user);

            return user;
        }

    }

    @Transactional
    public User updateUser(Long id, User userUp) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user no encontrado"));

        user.setEmail(userUp.getEmail());
        user.setUsername(userUp.getUsername());
        user.setAvatar(userUp.getAvatar());
        user.setCrowdCoin(userUp.getCrowdCoin());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);

    }

    public LoginResponse login(LoginRequest credentials) {
        // Comprobamos si el usuario existe
        User user = this.userRepository.findByUsername(credentials.getUsername()).orElseThrow(
                () -> new BadCredentialsException("User not found")
        );

        // Comprobamos si la contraseña no coincide con la que tenemos en la base de datos
        if (!this.passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        LoginResponse loginData = new LoginResponse();
        loginData.setUsername(credentials.getUsername());
        loginData.setToken(this.jwtUtil.generateToken(credentials.getUsername()));

        return loginData;
    }

    public boolean checkToken(CheckTokenRequest checkTokenRequest) {
        return this.jwtUtil.validateToken(
                checkTokenRequest.getToken(),
                checkTokenRequest.getUsername()
        );
    }

    @Transactional
    public User changePassword(Long id, String newPassword) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        user.setPassword(passwordEncoder.encode(newPassword)); // Codificamos la nueva contraseña
        return userRepository.save(user);

    }


}




