package com.uniranking.app.scheduleMatch.comments;

import com.uniranking.app.domains.scheduleMatch.comment.Comment;
import com.uniranking.app.domains.scheduleMatch.comment.CommentRepository;
import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatch;
import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatchRepository;
import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class CommentRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScheduleMatchRepository scheduleMatchRepository;

    @Autowired
    private CommentRepository commentRepository;

    private User user1;
    private User user2;
    private User user3;

    private ScheduleMatch scheduleMatch1;
    private ScheduleMatch scheduleMatch2;

    private Comment comment1;
    private Comment comment2;
    private Comment comment3;

    private PageRequest pageRequest;

    @BeforeEach
    public void setup() {
        user1 = User.builder().username("LKLD1909").email("lk1909@gmail.com").build();
        user2 = User.builder().username("Tester").email("tester@gmail.com").build();
        user3 = User.builder().username("Phung Thanh Do").email("domixi@120yenlang.com").build();

        // Capture managed entities to prevent TransientObjectException
        user1 = userRepository.save(user1);
        user2 = userRepository.save(user2);
        user3 = userRepository.save(user3);

        scheduleMatch1 = ScheduleMatch.builder().title("Test Match").build();
        scheduleMatch2 = ScheduleMatch.builder().title("Best kho ga").build();

        scheduleMatch1 = scheduleMatchRepository.save(scheduleMatch1);
        scheduleMatch2 = scheduleMatchRepository.save(scheduleMatch2);

        comment1 = Comment.builder().user(user1).scheduleMatch(scheduleMatch1).content("LK is here").build();
        comment2 = Comment.builder().user(user2).parent(comment1).scheduleMatch(scheduleMatch1).content("Testing").build();
        comment1.setChildren(List.of(comment2));

        comment3 = Comment.builder().user(user3).scheduleMatch(scheduleMatch2).content("Ba mia").build();

        commentRepository.save(comment1);
        commentRepository.save(comment2);
        commentRepository.save(comment3);

        pageRequest = PageRequest.of(0, 15);
    }

    @Test
    public void findByMatchId_ReturnCommentAndSubcomment() {
        long matchId = scheduleMatch1.getId();

        Page<Comment> result = commentRepository.findByMatch(matchId, pageRequest);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.getTotalElements());

        // Test content
        Assertions.assertEquals("LK is here", result.getContent().get(0).getContent());
        Assertions.assertEquals("Testing", result.getContent().get(1).getContent());

        // Test user
        Assertions.assertEquals(user1, result.getContent().get(0).getUser());
        Assertions.assertEquals(user2, result.getContent().get(1).getUser());

        // Test match
        Assertions.assertEquals(scheduleMatch1, result.getContent().get(0).getScheduleMatch());
        Assertions.assertEquals(scheduleMatch1, result.getContent().get(1).getScheduleMatch());

        // Test parent
        Assertions.assertNull(result.getContent().get(0).getParent());
        Assertions.assertEquals(comment1, result.getContent().get(1).getParent());
        Assertions.assertEquals(List.of(comment2), result.getContent().get(0).getChildren());
    }

    @Test
    public void findByMatchId_ReturnComment() {
        long matchId = scheduleMatch2.getId();

        Page<Comment> result = commentRepository.findByMatch(matchId, pageRequest);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.getTotalElements());

        Assertions.assertEquals("Ba mia", result.getContent().get(0).getContent());
        Assertions.assertEquals(user3, result.getContent().get(0).getUser());
        Assertions.assertEquals(scheduleMatch2, result.getContent().get(0).getScheduleMatch());
        Assertions.assertNull(result.getContent().get(0).getParent());
    }

    @Test
    public void findByNonExistMatchId_ReturnEmptyPage() {
        long matchId = 67L;

        Page<Comment> result = commentRepository.findByMatch(matchId, pageRequest);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.getTotalElements());
    }

    @Test
    public void findByNull_ReturnEmptyPage() {
        Page<Comment> result = commentRepository.findByMatch(null, pageRequest);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.getTotalElements());
    }

    @AfterEach
    public void tearDown() {
        commentRepository.deleteAll();
        scheduleMatchRepository.deleteAll();
        userRepository.deleteAll();
    }
}