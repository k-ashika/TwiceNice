package com.twicenice.twicenice_backend.service;

import com.twicenice.twicenice_backend.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
        
    }
    public User getUser() {
        return this.user;
    }
    public Long getId() {
        return user.getId();
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        System.out.println("User role: " + role);
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }


    @Override public String getPassword() { return user.getPassword(); }

    @Override public String getUsername() { return user.getEmail(); }

    @Override public boolean isAccountNonExpired() { return true; }

    @Override public boolean isAccountNonLocked() { return true; }

    @Override public boolean isCredentialsNonExpired() { return true; }

    @Override public boolean isEnabled() { return true; }
}
