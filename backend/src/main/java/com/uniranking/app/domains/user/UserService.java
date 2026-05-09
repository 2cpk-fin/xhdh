package com.uniranking.app.domains.user;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    UserResponse getUserByRefreshToken(String refreshToken);
    UserResponse updateUsername(Long id, String newUsername);
    UserResponse updateEmail(Long id, String newEmail);
    UserResponse updatePassword(Long id, String newPassword);
    UserResponse updateProfileImage(Long id, String base64Image);
    String deleteUser(Long id);
    Page<UserResponse> getAllUsers(int pageNo, int size);
    Page<UserResponse> getUserByUsername(int pageNo, int size, String username);
}