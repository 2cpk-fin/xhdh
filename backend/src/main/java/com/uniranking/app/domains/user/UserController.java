package com.uniranking.app.domains.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/me")
    public ResponseEntity<?> getUserByRefreshToken(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            UserResponse response = userService.getUserByRefreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/username")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newUsername = body.get("newUsername");
        return new ResponseEntity<>(userService.updateUsername(id, newUsername), HttpStatus.OK);
    }

    @PatchMapping("/{id}/email")
    public ResponseEntity<UserResponse> updateEmail(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newEmail = body.get("newEmail");
        return new ResponseEntity<>(userService.updateEmail(id, newEmail), HttpStatus.OK);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<UserResponse> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        return new ResponseEntity<>(userService.updatePassword(id, newPassword), HttpStatus.OK);
    }

    @PatchMapping("/{id}/profile-image")
    public ResponseEntity<UserResponse> updateProfileImage(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String base64Image = body.get("imageProfile");
        if (base64Image == null)
            return ResponseEntity.badRequest().build();
        // Pass the Base64 string directly — no decoding needed
        return new ResponseEntity<>(userService.updateProfileImage(id, base64Image), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(userService.deleteUser(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<Page<UserResponse>> getUserByUsername(
            @RequestParam int pageNo,
            @RequestParam int size,
            @PathVariable String username
    ) {
        return new ResponseEntity<>(userService.getUserByUsername(pageNo, size, username), HttpStatus.OK);
    }

    @GetMapping("/admin/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(@RequestParam int pageNo, @RequestParam int size) {
        return ResponseEntity.ok(userService.getAllUsers(pageNo, size));
    }
}