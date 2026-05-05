package com.uniranking.app.searching.university;

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

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UniversityServiceTests {

    @Mock
    private UniversityRepository universityRepository;

    @Mock
    private UniversityMapper universityMapper;

    @InjectMocks
    private UniversityService universityService;

    private University university;
    private UniversityResponse universityResponse;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        // We assume that the database already has this data,
        // and we also assume that the repo will give the correct result
        university = University.builder()
                .id(1L)
                .name("Hanoi Medical University")
                .build();

        // We expect that the service will return this response,
        // because we don't want to build the response, that would take time
        universityResponse = UniversityResponse.builder()
                .id(1L)
                .name("Hanoi Medical University")
                .build();

        pageable = PageRequest.of(0, 15);
    }

    @Test
    void getByInput_ReturnPageOfUniversities() {
        // Arrange
        String input = "Hanoi";
        List<Long> tagIds = List.of(1L, 2L);

        // We expect the repo would return the university page
        Page<University> universityPage = new PageImpl<>(List.of(university), pageable, 1);

        when(universityRepository.findByInput(pageable, input, tagIds)).thenReturn(universityPage);
        when(universityMapper.mapToResponseWithTags(university)).thenReturn(universityResponse);

        // Act
        Page<UniversityResponse> result = universityService.getUniversityListByInput(pageable, input, tagIds);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Hanoi Medical University", result.getContent().get(0).getName());

        verify(universityRepository, times(1)).findByInput(pageable, input, tagIds);
        verify(universityMapper, times(1)).mapToResponseWithTags(university);
    }

    @Test
    void getByNonexistInput_ReturnEmptyPage() {
        // Arrange
        String input = "nonexistent";
        List<Long> tagIds = List.of(99L);

        Page<University> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(universityRepository.findByInput(pageable, input, tagIds)).thenReturn(emptyPage);

        // Act
        Page<UniversityResponse> result = universityService.getUniversityListByInput(pageable, input, tagIds);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(universityRepository, times(1)).findByInput(pageable, input, tagIds);
        verify(universityMapper, times(0)).mapToResponseWithTags(university);
    }
}