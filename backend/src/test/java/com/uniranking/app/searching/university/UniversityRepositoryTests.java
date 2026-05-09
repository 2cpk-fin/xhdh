package com.uniranking.app.searching.university;

import com.uniranking.app.domains.searching.tag.Tag;
import com.uniranking.app.domains.searching.tag.TagRepository;
import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityRepository;
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
public class UniversityRepositoryTests {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private TagRepository tagRepository;

    private Tag engineeringTag;
    private Tag technologyTag;
    private Tag medicalTag;

    PageRequest pageRequest;

    @BeforeEach // This method runs before tests
    public void setUp() {
        // Arrange tags
        engineeringTag = Tag.builder().name("Engineering").build();
        technologyTag = Tag.builder().name("Technology").build();
        medicalTag = Tag.builder().name("Medical").build();

        tagRepository.save(engineeringTag);
        tagRepository.save(technologyTag);
        tagRepository.save(medicalTag);

        // Arrange universities
        University university1 = University.builder()
                .name("University of Engineering and Technology")
                .abbreviation("UET")
                .tags(List.of(engineeringTag, technologyTag))
                .build();
        University university2 = University.builder()
                .name("Hanoi University of Science and Technology")
                .abbreviation("HUST")
                .tags(List.of(engineeringTag, technologyTag))
                .build();
        University university3 = University.builder()
                .name("Hanoi Medical University")
                .abbreviation("HMU")
                .tags(List.of(medicalTag))
                .build();

        universityRepository.save(university1);
        universityRepository.save(university2);
        universityRepository.save(university3);

        pageRequest = PageRequest.of(0, 15);
    }

    @Test
    public void findByOneTag_ReturnPageOfUniversities() {
        // Arrange
        List<Long> searchList = List.of(medicalTag.getId());

        // Act
        Page<University> result = universityRepository.findByInput(pageRequest, null, searchList);

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.getTotalElements());
        Assertions.assertEquals("HMU", result.getContent().get(0).getAbbreviation());
    }

    @Test
    public void findByListOfTags_ReturnPageOfUniversities() {
        List<Long> searchList = List.of(engineeringTag.getId(), technologyTag.getId());

        Page<University> result = universityRepository.findByInput(pageRequest, null, searchList);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.getTotalElements());
        Assertions.assertEquals("UET", result.getContent().get(0).getAbbreviation());
        Assertions.assertEquals("HUST", result.getContent().get(1).getAbbreviation());
    }

    @Test
    public void findByKeyword_ReturnPageOfUniversities() {
        Page<University> result = universityRepository.findByInput(pageRequest, "Hanoi", null);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.getTotalElements());
        Assertions.assertEquals("HUST", result.getContent().get(0).getAbbreviation());
        Assertions.assertEquals("HMU", result.getContent().get(1).getAbbreviation());
    }

    @Test
    public void findByNonExistentKeyword_ReturnEmptyPage() {
        Page<University> result = universityRepository.findByInput(pageRequest, "phungthanhdo", null);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.getTotalElements());
    }

    @Test
    public void findByKeywordAndListOfTags_ReturnPageOfUniversities() {
        List<Long> searchList = List.of(engineeringTag.getId(), technologyTag.getId());

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
        Assertions.assertEquals("UET", result.getContent().get(0).getAbbreviation());
        Assertions.assertEquals("HUST", result.getContent().get(1).getAbbreviation());
        Assertions.assertEquals("HMU", result.getContent().get(2).getAbbreviation());
    }
}
