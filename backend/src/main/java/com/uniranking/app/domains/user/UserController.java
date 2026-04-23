package com.uniranking.app.domains.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PatchMapping("/{id}/email")
    public ResponseEntity<String> updateEmail(@PathVariable Long id, @RequestParam String newEmail) {
        return new ResponseEntity<>(userService.updateEmail(id, newEmail), HttpStatus.OK);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody String newPassword) {
        return new ResponseEntity<>(userService.updatePassword(id, newPassword), HttpStatus.OK);
    }

    @PatchMapping("/{id}/profile-image")
    public ResponseEntity<String> updateProfileImage(@PathVariable Long id, @RequestParam String imageUrl) {
        return new ResponseEntity<>(userService.updateProfileImage(id, imageUrl), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.deleteUser(id), HttpStatus.OK);
    }
}