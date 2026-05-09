package com.uniranking.app.scheduleMatch.participant;

import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatch;
import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatchRepository;
import com.uniranking.app.domains.scheduleMatch.match.Status;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipant;
import com.uniranking.app.domains.scheduleMatch.participant.ScheduleParticipantRepository;
import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ScheduleParticipantRepositoryTests {

    @Autowired
    private ScheduleParticipantRepository scheduleParticipantRepository;

    @Autowired
    private ScheduleMatchRepository scheduleMatchRepository;

    @Autowired
    private UniversityRepository universityRepository;

    private ScheduleMatch match1;
    private ScheduleMatch match2;

    private University university1;
    private University university2;

    private ScheduleParticipant participant1;
    private ScheduleParticipant participant2;
    private ScheduleParticipant participant3;

    @BeforeEach
    public void setup() {
        match1 = ScheduleMatch.builder().title("Match 1").status(Status.NOT_STARTED).build();
        match2 = ScheduleMatch.builder().title("Match 2").status(Status.PENDING).build();

        scheduleMatchRepository.save(match1);
        scheduleMatchRepository.save(match2);

        university1 = University.builder().name("University of Engineering and Technology").abbreviation("UET").build();
        university2 = University.builder().name("Hanoi University of Science and Technology").abbreviation("HUST").build();

        universityRepository.save(university1);
        universityRepository.save(university2);

        // university1 and university2 in match1
        participant1 = ScheduleParticipant.builder().scheduleMatch(match1).university(university1).totalVotes(10).rank(1).build();
        participant2 = ScheduleParticipant.builder().scheduleMatch(match1).university(university2).totalVotes(5).rank(2).build();

        // university1 in match2
        participant3 = ScheduleParticipant.builder().scheduleMatch(match2).university(university1).totalVotes(0).rank(1).build();

        scheduleParticipantRepository.save(participant1);
        scheduleParticipantRepository.save(participant2);
        scheduleParticipantRepository.save(participant3);
    }

    @Test
    public void updateTotalVotes_WithValidIds_UpdateSuccessfully() {
        scheduleParticipantRepository.updateTotalVotes(university1.getId(), match1.getId(), 99L);

        ScheduleParticipant updated = scheduleParticipantRepository.findById(participant1.getId()).orElse(null);

        Assertions.assertNotNull(updated);
        Assertions.assertEquals(99L, updated.getTotalVotes());
    }

    @Test
    public void updateTotalVotes_ShouldOnlyAffectTargetParticipant() {
        scheduleParticipantRepository.updateTotalVotes(university1.getId(), match1.getId(), 99L);

        // participant2 and participant3 should be untouched
        ScheduleParticipant untouched1 = scheduleParticipantRepository.findById(participant2.getId()).orElse(null);
        ScheduleParticipant untouched2 = scheduleParticipantRepository.findById(participant3.getId()).orElse(null);

        Assertions.assertNotNull(untouched1);
        Assertions.assertNotNull(untouched2);
        Assertions.assertEquals(5L, untouched1.getTotalVotes());
        Assertions.assertEquals(0L, untouched2.getTotalVotes());
    }

    @Test
    public void updateTotalVotes_WithNonExistUniversityId_NoUpdate() {
        scheduleParticipantRepository.updateTotalVotes(999L, match1.getId(), 99L);

        ScheduleParticipant unchanged = scheduleParticipantRepository.findById(participant1.getId()).orElse(null);

        Assertions.assertNotNull(unchanged);
        Assertions.assertEquals(10L, unchanged.getTotalVotes());
    }

    @Test
    public void updateTotalVotes_WithNonExistMatchId_NoUpdate() {
        scheduleParticipantRepository.updateTotalVotes(university1.getId(), 999L, 99L);

        ScheduleParticipant unchanged = scheduleParticipantRepository.findById(participant1.getId()).orElse(null);

        Assertions.assertNotNull(unchanged);
        Assertions.assertEquals(10L, unchanged.getTotalVotes());
    }

    @Test
    public void updateRank_WithValidIds_UpdateSuccessfully() {
        scheduleParticipantRepository.updateRank(university2.getId(), match1.getId(), 1);

        ScheduleParticipant updated = scheduleParticipantRepository.findById(participant2.getId()).orElse(null);

        Assertions.assertNotNull(updated);
        Assertions.assertEquals(1, updated.getRank());
    }

    @Test
    public void updateRank_ShouldOnlyAffectTargetParticipant() {
        scheduleParticipantRepository.updateRank(university2.getId(), match1.getId(), 1);

        // participant1 and participant3 should be untouched
        ScheduleParticipant untouched1 = scheduleParticipantRepository.findById(participant1.getId()).orElse(null);
        ScheduleParticipant untouched2 = scheduleParticipantRepository.findById(participant3.getId()).orElse(null);

        Assertions.assertNotNull(untouched1);
        Assertions.assertNotNull(untouched2);
        Assertions.assertEquals(1, untouched1.getRank());
        Assertions.assertEquals(1, untouched2.getRank());
    }

    @Test
    public void updateRank_WithNonExistUniversityId_NoUpdate() {
        scheduleParticipantRepository.updateRank(999L, match1.getId(), 5);

        ScheduleParticipant unchanged = scheduleParticipantRepository.findById(participant2.getId()).orElse(null);

        Assertions.assertNotNull(unchanged);
        Assertions.assertEquals(2, unchanged.getRank());
    }

    @Test
    public void updateRank_WithNonExistMatchId_NoUpdate() {
        scheduleParticipantRepository.updateRank(university2.getId(), 999L, 5);

        ScheduleParticipant unchanged = scheduleParticipantRepository.findById(participant2.getId()).orElse(null);

        Assertions.assertNotNull(unchanged);
        Assertions.assertEquals(2, unchanged.getRank());
    }

    @AfterEach
    public void tearDown() {
        scheduleMatchRepository.deleteAll();
        scheduleParticipantRepository.deleteAll();
        universityRepository.deleteAll();
    }
}
