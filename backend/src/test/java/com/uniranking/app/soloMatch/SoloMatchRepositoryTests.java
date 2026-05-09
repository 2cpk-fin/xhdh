package com.uniranking.app.soloMatch;

import com.uniranking.app.domains.searching.university.Tag;
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

import java.util.List;
import java.util.Set;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class SoloMatchRepositoryTests {

    @Autowired
    private UniversityRepository universityRepository;

    private University university1, university2, university3, university4;

    @BeforeEach
    public void setup() {
        Tag tag1 = Tag.TECHNOLOGY;
        Tag tag2 = Tag.MEDICAL;

        // uni1 and uni2 share tag1
        // uni3 shares tag2 with nobody relevant
        // uni4 shares tag1 with uni1
        university1 = University.builder().name("University of Engineering and Technology").abbreviation("UET")
                .tags(Set.of(tag1)).build();
        university2 = University.builder().name("Hanoi University of Science and Technology").abbreviation("HUST")
                .tags(Set.of(tag1)).build();
        university3 = University.builder().name("Hanoi Medical University").abbreviation("HMU").tags(Set.of(tag2))
                .build();
        university4 = University.builder().name("FPT University").abbreviation("FPT").tags(Set.of(tag1)).build();

        universityRepository.saveAll(List.of(university1, university2, university3, university4));
    }

    @Test
    public void UniversityRepository_FindRandom_ReturnOneUniversity() {
        University result = universityRepository.findRandom();

        Assertions.assertNotNull(result);
    }

    @Test
    void UniversityRepository_FindAllOpponentsWithSharedTag_ReturnOpponents() {
        // uni1 has tag1, so uni2 and uni4 should be returned (they also have tag1)
        List<University> result = universityRepository.findAllOpponentsWithSharedTag(university1.getId());

        Assertions.assertEquals(2, result.size());
        Assertions.assertTrue(result.stream().anyMatch(u -> u.getId() == university2.getId()));
        Assertions.assertTrue(result.stream().anyMatch(u -> u.getId() == university4.getId()));
    }

    @Test
    void UniversityRepository_FindAllOpponentsWithSharedTag_ShouldNotReturnSelf() {
        List<University> result = universityRepository.findAllOpponentsWithSharedTag(university1.getId());

        Assertions.assertTrue(result.stream().noneMatch(u -> u.getId() == university1.getId()));
    }

    @Test
    void UniversityRepository_FindAllOpponentsWithSharedTag_ReturnEmpty_WhenNoSharedTags() {
        // uni3 has tag2, nobody else has tag2
        List<University> result = universityRepository.findAllOpponentsWithSharedTag(university3.getId());

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    void UniversityRepository_FindAllOpponentsWithSharedTag_ReturnEmpty_WhenNonExistentId() {
        List<University> result = universityRepository.findAllOpponentsWithSharedTag(999L);

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    void UniversityRepository_FindAllOpponentsWithSharedTag_WhenNullId() {
        List<University> result = universityRepository.findAllOpponentsWithSharedTag(null);

        Assertions.assertTrue(result.isEmpty());
    }

    @AfterEach
    public void tearDown(){
        universityRepository.deleteAll();
    }
}
