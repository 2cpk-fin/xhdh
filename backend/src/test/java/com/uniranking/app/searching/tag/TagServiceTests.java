package com.uniranking.app.searching.tag;

import com.uniranking.app.domains.searching.tag.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TagServiceTests {

    @Mock
    private TagRepository tagRepository;

    @Mock
    private TagMapper tagMapper;

    @InjectMocks
    private TagService tagService;

    private Tag technologyTag;
    private Tag engineeringTag;

    private TagResponse technologTagResponse;
    private TagResponse engineeringTagResponse;

    @BeforeEach
    public void setUp() {
        technologyTag = Tag.builder().id(1L).name("Technology").build();
        engineeringTag = Tag.builder().id(2L).name("Engineering").build();

        technologTagResponse = TagResponse.builder().id(1L).name("Technology").build();
        engineeringTagResponse = TagResponse.builder().id(2L).name("Engineering").build();
    }

    @Test
    public void TagService_FindAllTags_ReturnListOfTags() {
        List<Tag> tags = List.of(technologyTag, engineeringTag);

        when(tagRepository.findAll()).thenReturn(tags);
        when(tagMapper.toTagResponse(technologyTag)).thenReturn(technologTagResponse);
        when(tagMapper.toTagResponse(engineeringTag)).thenReturn(engineeringTagResponse);

        List<TagResponse> result = tagService.showAllTags();

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("Technology", result.get(0).getName());
        Assertions.assertEquals("Engineering", result.get(1).getName());

        verify(tagRepository, times(1)).findAll();
        verify(tagMapper, times(1)).toTagResponse(technologyTag);
        verify(tagMapper, times(1)).toTagResponse(engineeringTag);
    }

    @Test
    public void TagService_FindAllTagsInUniversity_ReturnListOfTags() {
        List<Tag> tags = List.of(technologyTag, engineeringTag);
        Long universityId = 1L;

        when(tagRepository.findAllById(universityId)).thenReturn(tags);
        when(tagMapper.toTagResponse(technologyTag)).thenReturn(technologTagResponse);
        when(tagMapper.toTagResponse(engineeringTag)).thenReturn(engineeringTagResponse);

        List<TagResponse> result = tagService.showAllTagsInUniversity(universityId);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(2, result.size());
        Assertions.assertEquals("Technology", result.get(0).getName());
        Assertions.assertEquals("Engineering", result.get(1).getName());

        verify(tagRepository, times(1)).findAllById(universityId);
        verify(tagMapper, times(1)).toTagResponse(technologyTag);
        verify(tagMapper, times(1)).toTagResponse(engineeringTag);
    }

    @Test
    public void TagService_FindAllTagsInNullUniversity_ReturnEmptyList() {
        List<Tag> tags = new ArrayList<>();
        Long universityId = null;

        when(tagRepository.findAllById(universityId)).thenReturn(tags);

        List<TagResponse> result = tagService.showAllTagsInUniversity(universityId);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(0, result.size());

        verify(tagRepository, times(1)).findAllById(universityId);
        verifyNoInteractions(tagMapper);
    }
}
