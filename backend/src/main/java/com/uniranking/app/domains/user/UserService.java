package com.uniranking.app.domains.user;

import com.uniranking.app.domains.auth.exceptions.UserNotFoundException;
import com.uniranking.app.domains.auth.refreshToken.RefreshTokenService;
import com.uniranking.app.domains.auth.exceptions.ExistedEmailException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RefreshTokenService refreshTokenService;

    @Transactional(readOnly = true)
    public UserResponse getUserByRefreshToken(String refreshToken) {
        String email = refreshTokenService.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return userMapper.userToResponse(user);
    }

    @Transactional
    public UserResponse updateUsername(Long id, String newUsername) {
        userRepository.updateUsername(id, newUsername);
        User updatedUser = findById(id);
        return userMapper.userToResponse(updatedUser);
    }

    @Transactional
    public UserResponse updateEmail(Long id, String newEmail) {
        if (userRepository.existsByEmail(newEmail)) {
            throw new ExistedEmailException("Email already in use");
        }
        userRepository.updateEmail(id, newEmail);
        User updatedUser = findById(id);
        return userMapper.userToResponse(updatedUser);
    }

    @Transactional
    public UserResponse updatePassword(Long id, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(id, encodedPassword);
        User updatedUser = findById(id);
        return userMapper.userToResponse(updatedUser);
    }

    @Transactional
    public UserResponse updateProfileImage(Long id, String base64Image) {
        userRepository.updateProfileImage(id, base64Image);
        User updatedUser = findById(id);
        return userMapper.userToResponse(updatedUser);
    }

    @Transactional
    public String deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Cannot delete: User not found with ID: " + id);
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
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }

    public Page<UserResponse> getAllUsers(int pageNo, int size) {
        return userRepository.findAll(PageRequest.of(pageNo, size)).map(userMapper::userToResponse);
    }

    public Page<UserResponse> getUserByUsername(int pageNo, int size, String username) {
        return userRepository.findByInput(PageRequest.of(pageNo, size), username).map(userMapper::userToResponse);
    }
}