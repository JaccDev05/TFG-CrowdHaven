package com.CrowdHaven.Backend.config;


import com.CrowdHaven.Backend.repositories.UserRepository;
import com.CrowdHaven.Backend.security.JwtAuthenticationFilter;
import com.CrowdHaven.Backend.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public SecurityConfig(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> this.userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(UserDetailsService userDetailsService) {
        return new JwtAuthenticationFilter(this.jwtUtil, userDetailsService);
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/users/login",
                                "/users",
                                "/users/register",
                                "/users/check-token",
                                "/users/{id}",
                                "/users/name/{username}",

                                "/communities",
                                "/communities/{id}",
                                "/communities/update/{comId}",
                                "/communities/delete/{comId}",
                                "/communities/create",
                                "/communities/user/{userId}",
                                "/communities/add-member",
                                "/communities/{id}/create-roles",

                                "/roles",
                                "/roles/community/{communityId}",
                                "/roles/{id}",

                                "/members",
                                "/members/{userId}",
                                "/members/community/{communityId}",
                                "/members/user/{userId}",
                                "/members/{userId}/{comId}",
                                "/members/{userId}/{comId}/{roleId}",

                                "/rewards",
                                "/rewards/getRew/{rewId}",
                                "/rewards/{id}",

                                "/reward-purchases",
                                "/reward-purchases/user/{userId}",
                                "/reward-purchases/{id}",

                                "/posts",
                                "/posts/create",
                                "/posts/community/{communityId}",
                                "/posts/user/{userId}",
                                "/posts/{id}",
                                "/posts/{id}/reaction",

                                "/comments",
                                "/comments/post/{postId}",
                                "/comments/{commentId}/reaction",
                                "/comments/delete/{commentId}",

                                "/chat",
                                "/chat/send",
                                "/chat/history/{user1Id}/{user2Id}"





                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
