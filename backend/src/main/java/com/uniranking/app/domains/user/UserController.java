package com.uniranking.app.domains.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // — refresh tokens must never travel as query params (they appear in server logs,
    //   browser history, and proxy logs). POST body keeps them out of the URL entirely.
    @PostMapping("/me")
    public ResponseEntity<UserResponse> getUserByRefreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        return ResponseEntity.ok(userService.getUserByRefreshToken(refreshToken));
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
    public ResponseEntity<UserResponse> updateProfileImage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String base64Image = body.get("imageProfile");
        String cleanBase64 = base64Image.substring(base64Image.indexOf(",") + 1);
        byte[] imageBytes = Base64.getDecoder().decode(cleanBase64);
        return new ResponseEntity<>(userService.updateProfileImage(id, imageBytes), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.deleteUser(id), HttpStatus.OK);
    }
}