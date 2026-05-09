package com.uniranking.app.searching.tag;

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

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class TagRepositoryTests {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private TagRepository tagRepository;

    private University university;

    @BeforeEach
    public void setUp() {
        Tag languageTag = Tag.builder().name("Language").build();
        Tag pedagogyTag = Tag.builder().name("Pedagogy").build();

        tagRepository.save(languageTag);
        tagRepository.save(pedagogyTag);

        university = University.builder()
                .name("University of Languages and International Studies")
                .abbreviation("ULIS")
                .tags(List.of(languageTag, pedagogyTag))
                .build();

        universityRepository.save(university);
    }

    @Test
    public void TagRepository_FindAllByUniversityId_ReturnTags() {
        Long universityId = university.getId();

        List<Tag> result = tagRepository.findAllById(universityId);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("Language", result.get(0).getName());
        Assertions.assertEquals("Pedagogy", result.get(1).getName());
    }

    @Test
    public void TagRepository_FindByNullId_ReturnNothing() {
        List<Tag> result = tagRepository.findAllById((Long) null);

        Assertions.assertEquals(0, result.size());
    }
}
