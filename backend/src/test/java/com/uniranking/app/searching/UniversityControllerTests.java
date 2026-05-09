package com.uniranking.app.searching;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uniranking.app.common.BaseControllerTest;
import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.searching.university.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = UniversityController.class, excludeAutoConfiguration = {SecurityAutoConfiguration.class})
public class UniversityControllerTests extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UniversityService universityService;

    @Autowired
    private ObjectMapper objectMapper;

    private UniversityResponse universityResponse1;
    private UniversityResponse universityResponse2;
    private UniversityRequest universityRequest;

    @BeforeEach
    public void setUp() {
        universityResponse1 = UniversityResponse.builder()
                .id(1L)
                .publicUniversityId(UUID.randomUUID())
                .name("University of Engineering and Technology")
                .abbreviation("UET")
                .elo(1200)
                .tags(Set.of(Tag.ENGINEERING, Tag.TECHNOLOGY))
                .build();

        universityResponse2 = UniversityResponse.builder()
                .id(2L)
                .publicUniversityId(UUID.randomUUID())
                .name("Hanoi University of Science and Technology")
                .abbreviation("HUST")
                .elo(1350)
                .tags(Set.of(Tag.ENGINEERING, Tag.TECHNOLOGY))
                .build();

        universityRequest = new UniversityRequest();
        universityRequest.setName("New University");
        universityRequest.setAbbreviation("NU");
        universityRequest.setElo(1200);
        universityRequest.setTags(Set.of(Tag.TECHNOLOGY));
    }

    @Test
    public void getAllTags_Return200AndTagList() throws Exception {
        List<String> tags = List.of("TECHNOLOGY", "ENGINEERING", "MEDICAL");
        when(universityService.getAllAvailableTags()).thenReturn(tags);

        mockMvc.perform(get("/api/universities/tags").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0]").value("TECHNOLOGY"));
    }

    @Test
    public void getUniversityTags_ExistingId_Return200AndTagSet() throws Exception {
        when(universityService.getTagsByUniversityId(1L))
                .thenReturn(Set.of(Tag.ENGINEERING, Tag.TECHNOLOGY));

        mockMvc.perform(get("/api/universities/1/tags").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void getUniversityTags_NonExistingId_Return404() throws Exception {
        when(universityService.getTagsByUniversityId(99L))
                .thenThrow(new UniversityNotFoundException("University not found with ID: 99"));

        mockMvc.perform(get("/api/universities/99/tags"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void getUniversities_NoFilter_Return200AndPage() throws Exception {
        Page<UniversityResponse> result = new PageImpl<>(List.of(universityResponse1, universityResponse2));
        when(universityService.getUniversityListByInput(any(), any(), any())).thenReturn(result);

        mockMvc.perform(get("/api/universities")
                        .param("page", "0")
                        .param("size", "15")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].name").value("University of Engineering and Technology"))
                .andExpect(jsonPath("$.content[1].name").value("Hanoi University of Science and Technology"));
    }

    @Test
    public void getUniversities_WithKeyword_Return200AndFilteredPage() throws Exception {
        Page<UniversityResponse> result = new PageImpl<>(List.of(universityResponse2));
        when(universityService.getUniversityListByInput(any(), eq("Hanoi"), any())).thenReturn(result);

        mockMvc.perform(get("/api/universities")
                        .param("page", "0")
                        .param("size", "15")
                        .param("input", "Hanoi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].abbreviation").value("HUST"));
    }

    @Test
    public void getUniversities_EmptyResult_Return200AndEmptyPage() throws Exception {
        Page<UniversityResponse> emptyPage = new PageImpl<>(List.of());
        when(universityService.getUniversityListByInput(any(), any(), any())).thenReturn(emptyPage);

        mockMvc.perform(get("/api/universities")
                        .param("page", "0")
                        .param("size", "15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    public void createUniversity_ValidRequest_Return201AndResponse() throws Exception {
        when(universityService.createUniversity(any())).thenReturn(universityResponse1);

        mockMvc.perform(post("/api/universities/admin/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(universityRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("University of Engineering and Technology"))
                .andExpect(jsonPath("$.abbreviation").value("UET"))
                .andExpect(jsonPath("$.elo").value(1200));
    }

    @Test
    public void updateUniversity_ExistingId_Return200AndUpdatedResponse() throws Exception {
        when(universityService.updateUniversityById(eq(1L), any())).thenReturn(universityResponse1);

        mockMvc.perform(patch("/api/universities/admin/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(universityRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("University of Engineering and Technology"));
    }

    @Test
    public void updateUniversity_NonExistingId_Return404() throws Exception {
        when(universityService.updateUniversityById(eq(99L), any()))
                .thenThrow(new UniversityNotFoundException("University not found with ID: 99"));

        mockMvc.perform(patch("/api/universities/admin/update/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(universityRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void deleteUniversity_ExistingId_Return200AndMessage() throws Exception {
        when(universityService.deleteUniversityById(1L)).thenReturn("Deleted successfully!");

        mockMvc.perform(delete("/api/universities/admin/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted successfully!"));
    }

    @Test
    public void deleteUniversity_NonExistingId_Return404() throws Exception {
        when(universityService.deleteUniversityById(99L))
                .thenThrow(new UniversityNotFoundException("University not found with ID: 99"));

        mockMvc.perform(delete("/api/universities/admin/delete/99"))
                .andExpect(status().isNotFound());
    }
}