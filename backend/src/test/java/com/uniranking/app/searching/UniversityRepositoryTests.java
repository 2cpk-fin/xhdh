package com.uniranking.app.searching;

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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Set;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UniversityRepositoryTests {

    @Autowired
    private UniversityRepository universityRepository;

    private University university1;
    private University university2;
    private University university3;

    private final Tag engineeringTag = Tag.ENGINEERING;
    private final Tag technologyTag  = Tag.TECHNOLOGY;
    private final Tag medicalTag     = Tag.MEDICAL;

    private PageRequest pageRequest;

    @BeforeEach
    public void setUp() {
        university1 = University.builder()
                .name("University of Engineering and Technology")
                .abbreviation("UET")
                .tags(Set.of(engineeringTag, technologyTag))
                .build();
        university2 = University.builder()
                .name("Hanoi University of Science and Technology")
                .abbreviation("HUST")
                .tags(Set.of(engineeringTag, technologyTag))
                .build();
        university3 = University.builder()
                .name("Hanoi Medical University")
                .abbreviation("HMU")
                .tags(Set.of(medicalTag))
                .build();

        universityRepository.save(university1);
        universityRepository.save(university2);
        universityRepository.save(university3);

        pageRequest = PageRequest.of(0, 15);
    }

    @Test
    public void findByOneTag_ReturnPageOfUniversities() {
        List<Tag> searchList = List.of(medicalTag);

        Page<University> result = universityRepository.findByInput(pageRequest, null, searchList);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals("HMU", result.getContent().get(0).getAbbreviation());
    }

    @Test
    public void findByListOfTags_ReturnPageOfUniversities() {
        List<Tag> searchList = List.of(engineeringTag, technologyTag);

        Page<University> result = universityRepository.findByInput(pageRequest, null, searchList);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.getTotalElements());

        List<String> abbreviations = result.getContent().stream()
                .map(University::getAbbreviation).toList();
        Assertions.assertTrue(abbreviations.containsAll(List.of("UET", "HUST")));
    }

    @Test
    public void findByKeyword_ReturnPageOfUniversities() {
        Page<University> result = universityRepository.findByInput(pageRequest, "Hanoi", null);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.getTotalElements());

        List<String> abbreviations = result.getContent().stream()
                .map(University::getAbbreviation).toList();
        Assertions.assertTrue(abbreviations.containsAll(List.of("HUST", "HMU")));
    }

    @Test
    public void findByKeyword_CaseInsensitive_ReturnPageOfUniversities() {
        Page<University> lower = universityRepository.findByInput(pageRequest, "hanoi", null);
        Page<University> upper = universityRepository.findByInput(pageRequest, "HANOI", null);

        Assertions.assertEquals(2, lower.getTotalElements());
        Assertions.assertEquals(2, upper.getTotalElements());
    }

    @Test
    public void findByNonExistentKeyword_ReturnEmptyPage() {
        Page<University> result = universityRepository.findByInput(pageRequest, "phungthanhdo", null);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.getTotalElements());
    }

    @Test
    public void findByKeywordAndListOfTags_ReturnPageOfUniversities() {
        List<Tag> searchList = List.of(engineeringTag, technologyTag);

        Page<University> result = universityRepository.findByInput(pageRequest, "Hanoi", searchList);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals("HUST", result.getContent().get(0).getAbbreviation());
    }

    @Test
    public void findByNullKeywordAndNullTags_ReturnAllUniversities() {
        Page<University> result = universityRepository.findByInput(pageRequest, null, null);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(3, result.getTotalElements());

        List<String> abbreviations = result.getContent().stream()
                .map(University::getAbbreviation).toList();
        Assertions.assertTrue(abbreviations.containsAll(List.of("UET", "HUST", "HMU")));
    }

    @Test
    public void findByTagThatMatchesNoUniversity_ReturnEmptyPage() {
        List<Tag> searchList = List.of(Tag.LAW);

        Page<University> result = universityRepository.findByInput(pageRequest, null, searchList);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.getTotalElements());
    }

    @Test
    public void findTagsByUniversityId_ExistingUniversity_ReturnTagSet() {
        Set<Tag> tags = universityRepository.findTagsByUniversityId(university1.getId());

        Assertions.assertNotNull(tags);
        Assertions.assertEquals(2, tags.size());
        Assertions.assertTrue(tags.containsAll(Set.of(engineeringTag, technologyTag)));
    }

    @Test
    public void findTagsByUniversityId_SingleTag_ReturnTagSet() {
        Set<Tag> tags = universityRepository.findTagsByUniversityId(university3.getId());

        Assertions.assertNotNull(tags);
        Assertions.assertEquals(1, tags.size());
        Assertions.assertTrue(tags.contains(medicalTag));
    }

    @Test
    public void findTagsByUniversityId_NonExistingUniversity_ReturnEmptySet() {
        Set<Tag> tags = universityRepository.findTagsByUniversityId(999L);

        Assertions.assertNotNull(tags);
        Assertions.assertTrue(tags.isEmpty());
    }

    @Test
    public void findAllOpponentsWithSharedTag_SharedTagExists_ReturnOpponents() {
        // university1 (UET) shares ENGINEERING + TECHNOLOGY with university2 (HUST)
        List<University> opponents = universityRepository.findAllOpponentsWithSharedTag(university1.getId());

        Assertions.assertNotNull(opponents);
        Assertions.assertEquals(1, opponents.size());
        Assertions.assertEquals("HUST", opponents.get(0).getAbbreviation());
    }

    @Test
    public void findAllOpponentsWithSharedTag_NoSharedTag_ReturnEmptyList() {
        // university3 (HMU, MEDICAL) shares no tags with UET or HUST
        List<University> opponents = universityRepository.findAllOpponentsWithSharedTag(university3.getId());

        Assertions.assertNotNull(opponents);
        Assertions.assertTrue(opponents.isEmpty());
    }

    @Test
    public void findAllOpponentsWithSharedTag_DoesNotReturnSelf() {
        List<University> opponents = universityRepository.findAllOpponentsWithSharedTag(university1.getId());

        List<String> abbreviations = opponents.stream()
                .map(University::getAbbreviation).toList();
        Assertions.assertFalse(abbreviations.contains("UET"));
    }

    @AfterEach
    public void tearDown(){
        universityRepository.deleteAll();
    }
}