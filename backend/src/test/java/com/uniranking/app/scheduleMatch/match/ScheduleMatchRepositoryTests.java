package com.uniranking.app.scheduleMatch.match;

import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatch;
import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatchRepository;
import com.uniranking.app.domains.scheduleMatch.match.Status;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ScheduleMatchRepositoryTests {

    @Autowired
    private ScheduleMatchRepository scheduleMatchRepository;

    private ScheduleMatch notStartedMatch1;
    private ScheduleMatch notStartedMatch2;
    private ScheduleMatch pendingMatch;
    private ScheduleMatch finishedMatch;

    private UUID publicMatchId;

    @BeforeEach
    public void setup() {
        notStartedMatch1 = ScheduleMatch.builder().title("Not Started Match 1").status(Status.NOT_STARTED).build();
        notStartedMatch2 = ScheduleMatch.builder().title("Not Started Match 2").status(Status.NOT_STARTED).build();
        pendingMatch = ScheduleMatch.builder().title("Pending Match").status(Status.PENDING).build();
        finishedMatch = ScheduleMatch.builder().title("Finished Match").status(Status.FINISHED).build();

        scheduleMatchRepository.save(notStartedMatch1);
        scheduleMatchRepository.save(notStartedMatch2);
        scheduleMatchRepository.save(pendingMatch);
        scheduleMatchRepository.save(finishedMatch);

        publicMatchId = finishedMatch.getPublicMatchId();
        System.out.println(publicMatchId);
    }

    @Test
    public void findAllNotStartedMatch_ReturnNotStartedMatches() {
        List<ScheduleMatch> result = scheduleMatchRepository.findAllNotStartedMatch();

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.size());
        Assertions.assertTrue(result.stream().allMatch(m -> m.getStatus() == Status.NOT_STARTED));
        Assertions.assertTrue(result.stream().anyMatch(m -> m.getTitle().equals("Not Started Match 1")));
        Assertions.assertTrue(result.stream().anyMatch(m -> m.getTitle().equals("Not Started Match 2")));
    }

    @Test
    public void findAllPendingMatch_ReturnPendingMatches() {
        List<ScheduleMatch> result = scheduleMatchRepository.findAllPendingMatch();

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(Status.PENDING, result.get(0).getStatus());
        Assertions.assertEquals("Pending Match", result.get(0).getTitle());
    }

    @Test
    public void findAllFinishedMatch_ReturnFinishedMatches() {
        List<ScheduleMatch> result = scheduleMatchRepository.findAllFinishedMatch();

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(Status.FINISHED, result.get(0).getStatus());
        Assertions.assertEquals("Finished Match", result.get(0).getTitle());
    }

    @Test
    public void findByPublicMatchId_ReturnMatch() {
        ScheduleMatch result = scheduleMatchRepository.findByPublicMatchId(publicMatchId);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(publicMatchId, result.getPublicMatchId());
        Assertions.assertEquals("Finished Match", result.getTitle());
        Assertions.assertEquals(Status.FINISHED, result.getStatus());
    }

    @Test
    public void findByNonExistPublicMatchId_ReturnNull() {
        ScheduleMatch result = scheduleMatchRepository.findByPublicMatchId(UUID.randomUUID());

        Assertions.assertNull(result);
    }

    @Test
    public void findByNullPublicMatchId_ReturnNull() {
        ScheduleMatch result = scheduleMatchRepository.findByPublicMatchId(null);

        Assertions.assertNull(result);
    }

    @Test
    public void compareAndUpdateStatus_WithCorrectExpectedStatus_UpdateSuccessfully() {
        int updatedRows = scheduleMatchRepository.compareAndUpdateStatus(
                publicMatchId, Status.FINISHED, Status.NOT_STARTED
        );

        ScheduleMatch updated = scheduleMatchRepository.findByPublicMatchId(publicMatchId);

        Assertions.assertEquals(1, updatedRows);
        Assertions.assertNotNull(updated);
        Assertions.assertEquals(Status.NOT_STARTED, updated.getStatus());
    }

    @Test
    public void compareAndUpdateStatus_WithWrongExpectedStatus_NoUpdate() {
        int updatedRows = scheduleMatchRepository.compareAndUpdateStatus(
                publicMatchId, Status.PENDING, Status.NOT_STARTED
        );

        ScheduleMatch unchanged = scheduleMatchRepository.findByPublicMatchId(publicMatchId);

        Assertions.assertEquals(0, updatedRows);
        Assertions.assertNotNull(unchanged);
        Assertions.assertEquals(Status.FINISHED, unchanged.getStatus());
    }

    @Test
    public void compareAndUpdateStatus_WithNonExistPublicMatchId_NoUpdate() {
        int updatedRows = scheduleMatchRepository.compareAndUpdateStatus(
                UUID.randomUUID(), Status.FINISHED, Status.NOT_STARTED
        );

        Assertions.assertEquals(0, updatedRows);
    }

    @Test
    public void compareAndUpdateStatus_WithNullPublicMatchId_NoUpdate() {
        int updatedRows = scheduleMatchRepository.compareAndUpdateStatus(
                null, Status.FINISHED, Status.NOT_STARTED
        );

        Assertions.assertEquals(0, updatedRows);
    }

    @Test
    public void findAllNotStartedMatch_NoMatches_ReturnEmptyList() {
        scheduleMatchRepository.deleteAll();

        List<ScheduleMatch> result = scheduleMatchRepository.findAllNotStartedMatch();

        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void findAllPendingMatch_NoMatches_ReturnEmptyList() {
        scheduleMatchRepository.delete(pendingMatch);

        List<ScheduleMatch> result = scheduleMatchRepository.findAllPendingMatch();

        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void findAllFinishedMatch_NoMatches_ReturnEmptyList() {
        scheduleMatchRepository.delete(finishedMatch);

        List<ScheduleMatch> result = scheduleMatchRepository.findAllFinishedMatch();

        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.isEmpty());
    }
}
