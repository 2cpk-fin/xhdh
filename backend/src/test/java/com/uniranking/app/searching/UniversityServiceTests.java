package com.uniranking.app.searching;

import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UniversityServiceTests {

    @Mock
    private UniversityRepository universityRepository;

    @Mock
    private UniversityMapper universityMapper;

    @InjectMocks
    private UniversityServiceImpl universityServiceImpl;

    private University university;
    private UniversityResponse universityResponse;
    private UniversityRequest universityRequest;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        university = University.builder()
                .id(1L)
                .name("Hanoi Medical University")
                .abbreviation("HMU")
                .elo(1200)
                .tags(Set.of(Tag.MEDICAL))
                .build();

        universityResponse = UniversityResponse.builder()
                .id(1L)
                .publicUniversityId(UUID.randomUUID())
                .name("Hanoi Medical University")
                .abbreviation("HMU")
                .elo(1200)
                .tags(Set.of(Tag.MEDICAL))
                .build();

        universityRequest = new UniversityRequest();
        universityRequest.setName("Hanoi Medical University");
        universityRequest.setAbbreviation("HMU");
        universityRequest.setElo(1200);
        universityRequest.setTags(Set.of(Tag.MEDICAL));

        pageable = PageRequest.of(0, 15);
    }

    // ─── getAllAvailableTags ──────────────────────────────────────────────────

    @Test
    void getAllAvailableTags_ReturnAllTagNames() {
        List<String> tags = universityServiceImpl.getAllAvailableTags();

        assertThat(tags).isNotNull();
        assertThat(tags).hasSize(Tag.values().length);
        assertThat(tags).contains("TECHNOLOGY", "ENGINEERING", "MEDICAL", "LAW");
    }

    @Test
    void getAllAvailableTags_ReturnTagsAsStrings() {
        List<String> tags = universityServiceImpl.getAllAvailableTags();

        for (Tag tag : Tag.values()) {
            assertThat(tags).contains(tag.name());
        }
    }

    // ─── getTagsByUniversityId ────────────────────────────────────────────────

    @Test
    void getTagsByUniversityId_ExistingUniversity_ReturnTagSet() {
        when(universityRepository.existsById(1L)).thenReturn(true);
        when(universityRepository.findTagsByUniversityId(1L)).thenReturn(Set.of(Tag.MEDICAL));

        Set<Tag> result = universityServiceImpl.getTagsByUniversityId(1L);

        assertThat(result).isNotNull();
        assertThat(result).containsExactly(Tag.MEDICAL);
        verify(universityRepository).findTagsByUniversityId(1L);
    }

    @Test
    void getTagsByUniversityId_NonExistingUniversity_ThrowsException() {
        when(universityRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> universityServiceImpl.getTagsByUniversityId(99L))
                .isInstanceOf(UniversityNotFoundException.class)
                .hasMessageContaining("99");

        verify(universityRepository, never()).findTagsByUniversityId(anyLong());
    }

    // ─── getUniversityListByInput ─────────────────────────────────────────────

    @Test
    void getUniversityListByInput_WithInputAndTags_ReturnPage() {
        String input = "Hanoi";
        List<Tag> tags = List.of(Tag.ENGINEERING, Tag.TECHNOLOGY);
        Page<University> universityPage = new PageImpl<>(List.of(university), pageable, 1);

        when(universityRepository.findByInput(pageable, input, tags)).thenReturn(universityPage);
        when(universityMapper.toUniversityResponse(university)).thenReturn(universityResponse);

        Page<UniversityResponse> result = universityServiceImpl.getUniversityListByInput(pageable, input, tags);

        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Hanoi Medical University");
        verify(universityRepository).findByInput(pageable, input, tags);
        verify(universityMapper).toUniversityResponse(university);
    }

    @Test
    void getUniversityListByInput_NullInputNullTags_ReturnAllUniversities() {
        Page<University> universityPage = new PageImpl<>(List.of(university), pageable, 1);

        when(universityRepository.findByInput(pageable, null, null)).thenReturn(universityPage);
        when(universityMapper.toUniversityResponse(university)).thenReturn(universityResponse);

        Page<UniversityResponse> result = universityServiceImpl.getUniversityListByInput(pageable, null, null);

        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    void getUniversityListByInput_NonexistentInput_ReturnEmptyPage() {
        String input = "nonexistent";
        List<Tag> tags = List.of(Tag.LAW);
        Page<University> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(universityRepository.findByInput(pageable, input, tags)).thenReturn(emptyPage);

        Page<UniversityResponse> result = universityServiceImpl.getUniversityListByInput(pageable, input, tags);

        assertThat(result).isNotNull();
        assertThat(result.isEmpty()).isTrue();
        verify(universityMapper, never()).toUniversityResponse(any());
    }

    // ─── getUniversityById ────────────────────────────────────────────────────

    @Test
    void getUniversityById_ExistingId_ReturnUniversityResponse() {
        when(universityRepository.findById(1L)).thenReturn(Optional.of(university));
        when(universityMapper.toUniversityResponse(university)).thenReturn(universityResponse);

        UniversityResponse result = universityServiceImpl.getUniversityById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Hanoi Medical University");
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getUniversityById_NonExistingId_ThrowsException() {
        when(universityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> universityServiceImpl.getUniversityById(99L))
                .isInstanceOf(UniversityNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ─── createUniversity ─────────────────────────────────────────────────────

    @Test
    void createUniversity_ValidRequest_ReturnUniversityResponse() {
        when(universityMapper.toUniversity(universityRequest)).thenReturn(university);
        when(universityRepository.save(university)).thenReturn(university);
        when(universityMapper.toUniversityResponse(university)).thenReturn(universityResponse);

        UniversityResponse result = universityServiceImpl.createUniversity(universityRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Hanoi Medical University");
        assertThat(result.getAbbreviation()).isEqualTo("HMU");
        verify(universityRepository).save(university);
    }

    // ─── updateUniversityById ─────────────────────────────────────────────────

    @Test
    void updateUniversityById_ExistingId_ReturnUpdatedResponse() {
        UniversityRequest updateRequest = new UniversityRequest();
        updateRequest.setName("Updated University");
        updateRequest.setAbbreviation("UU");
        updateRequest.setElo(1400);
        updateRequest.setTags(Set.of(Tag.TECHNOLOGY));

        UniversityResponse updatedResponse = UniversityResponse.builder()
                .id(1L)
                .name("Updated University")
                .abbreviation("UU")
                .elo(1400)
                .build();

        when(universityRepository.findById(1L)).thenReturn(Optional.of(university));
        when(universityRepository.save(university)).thenReturn(university);
        when(universityMapper.toUniversityResponse(university)).thenReturn(updatedResponse);

        UniversityResponse result = universityServiceImpl.updateUniversityById(1L, updateRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Updated University");
        verify(universityMapper).updateUniversityFromRequest(updateRequest, university);
        verify(universityRepository).save(university);
    }

    @Test
    void updateUniversityById_NonExistingId_ThrowsException() {
        when(universityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> universityServiceImpl.updateUniversityById(99L, universityRequest))
                .isInstanceOf(UniversityNotFoundException.class)
                .hasMessageContaining("99");

        verify(universityRepository, never()).save(any());
    }

    // ─── deleteUniversityById ─────────────────────────────────────────────────

    @Test
    void deleteUniversityById_ExistingId_ReturnSuccessMessage() {
        when(universityRepository.existsById(1L)).thenReturn(true);
        doNothing().when(universityRepository).deleteById(1L);

        String result = universityServiceImpl.deleteUniversityById(1L);

        assertThat(result).isEqualTo("Deleted successfully!");
        verify(universityRepository).deleteById(1L);
    }

    @Test
    void deleteUniversityById_NonExistingId_ThrowsException() {
        when(universityRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> universityServiceImpl.deleteUniversityById(99L))
                .isInstanceOf(UniversityNotFoundException.class)
                .hasMessageContaining("99");

        verify(universityRepository, never()).deleteById(anyLong());
    }
}