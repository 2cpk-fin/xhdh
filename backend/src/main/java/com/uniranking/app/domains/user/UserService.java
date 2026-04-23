package com.uniranking.app.domains.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uniranking.app.infrastructure.exceptions.EmailAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return userMapper.userToResponse(user);
    }

    @Transactional
    public String updateEmail(Long id, String newEmail) {
        if (userRepository.existsByEmail(newEmail)) {
            throw new EmailAlreadyExistsException("Email already in use");
        }
        User user = findById(id);
        user.setEmail(newEmail);
        return "Update email successful!";
    }

    @Transactional
    public String updatePassword(Long id, String newPassword) {
        User user = findById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        return "Update password successful!";
    }

    @Transactional
    public String updateProfileImage(Long id, String imageUrl) {
        User user = findById(id);
        user.setProfileImageUrl(imageUrl);
        return "Update profile image successful!";
    }

    @Transactional
    public String deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: User not found with ID: " + id);
        }
        userRepository.deleteById(id);
        return "Delete user successful!";
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
}