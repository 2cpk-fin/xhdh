package com.uniranking.app.user;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UserRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    private User user1;
    private User user2;

    @BeforeEach
    public void setup(){
        user1 = User.builder()
                .username("Tester1")
                .email("tester@gmail.com")
                .password("TesterIsTesting")
                .build();
        user2 = User.builder()
                .username("Tester2")
                .email("jester@gmail.com")
                .password("password")
                .build();

        userRepository.save(user1);
        userRepository.save(user2);
    }

    @Test
    public void UserRepository_CheckExistByEmail_ReturnBoolean() {
        boolean result1 = userRepository.existsByEmail("tester@gmail.com");
        boolean result2 = userRepository.existsByEmail("easter@gmail.com");

        Assertions.assertTrue(result1);
        Assertions.assertFalse(result2);
    }

    @Test
    public void UserRepository_FindByEmail_ReturnUser() {
        String email = "jester@gmail.com";
        User user = userRepository.findByEmail(email).get();

        Assertions.assertNotNull(user);
        Assertions.assertEquals(user2.getEmail(), user.getEmail());
        Assertions.assertEquals(user2.getDisplayUsername(), user.getDisplayUsername());
    }

    @Test
    public void UserRepository_UpdateUsernameWithExistingUser_ReturnInt() {
        String newUsername = "LKLD1909";
        int result = userRepository.updateUsername(1L, newUsername);

        Assertions.assertEquals(1, result);
        Assertions.assertEquals("LKLD1909", userRepository.findById(user1.getId()).get().getDisplayUsername());
        Assertions.assertNotEquals("Tester1", userRepository.findById(user1.getId()).get().getDisplayUsername());
    }

    @Test
    public void UserRepository_UpdateUsernameWithNonExistingUser_ReturnInt() {
        String newUsername = "LKLD1909";
        int result = userRepository.updateUsername(67L, newUsername);

        Assertions.assertEquals(0, result);
    }

    @Test
    public void UserRepository_UpdateEmailWithExistingUser_ReturnInt() {
        String newEmail = "newtester@gmail.com";
        int result = userRepository.updateEmail(user1.getId(), newEmail);

        Assertions.assertEquals(1, result);
        Assertions.assertEquals("newtester@gmail.com", userRepository.findById(user1.getId()).get().getEmail());
        Assertions.assertNotEquals("tester@gmail.com", userRepository.findById(user1.getId()).get().getEmail());
    }

    @Test
    public void UserRepository_UpdateEmailWithNonExistingUser_ReturnInt() {
        String newEmail = "newtester@gmail.com";
        int result = userRepository.updateEmail(67L, newEmail);

        Assertions.assertEquals(0, result);
    }

    @Test
    public void UserRepository_UpdatePasswordWithExistingUser_ReturnInt() {
        String newPassword = "NewSecurePassword123";
        int result = userRepository.updatePassword(user1.getId(), newPassword);

        Assertions.assertEquals(1, result);
        Assertions.assertEquals("NewSecurePassword123", userRepository.findById(user1.getId()).get().getPassword());
        Assertions.assertNotEquals("TesterIsTesting", userRepository.findById(user1.getId()).get().getPassword());
    }

    @Test
    public void UserRepository_UpdatePasswordWithNonExistingUser_ReturnInt() {
        String newPassword = "NewSecurePassword123";
        int result = userRepository.updatePassword(67L, newPassword);

        Assertions.assertEquals(0, result);
    }

    @Test
    public void UserRepository_UpdateProfileImageWithExistingUser_ReturnInt() {
        String newImage = "https://example.com/avatar.png";
        int result = userRepository.updateProfileImage(user1.getId(), newImage);

        Assertions.assertEquals(1, result);
        Assertions.assertEquals("https://example.com/avatar.png", userRepository.findById(user1.getId()).get().getProfileImage());
        Assertions.assertNotEquals(null, userRepository.findById(user1.getId()).get().getProfileImage());
    }

    @Test
    public void UserRepository_UpdateProfileImageWithNonExistingUser_ReturnInt() {
        String newImage = "https://example.com/avatar.png";
        int result = userRepository.updateProfileImage(67L, newImage);

        Assertions.assertEquals(0, result);
    }
}
