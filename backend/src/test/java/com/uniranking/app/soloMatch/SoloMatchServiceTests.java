package com.uniranking.app.soloMatch;

import com.uniranking.app.domains.searching.university.University;
import com.uniranking.app.domains.searching.university.UniversityMapper;
import com.uniranking.app.domains.searching.university.UniversityRepository;
import com.uniranking.app.domains.searching.university.UniversityResponse;
import com.uniranking.app.domains.soloMatch.SoloMatch;
import com.uniranking.app.domains.soloMatch.SoloMatchResponse;
import com.uniranking.app.domains.soloMatch.SoloMatchService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SoloMatchServiceTests {

    @Mock
    private UniversityRepository universityRepository;

    @Mock
    private UniversityMapper universityMapper;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private SoloMatchService soloMatchService;

    private University university1, university2, university3, university4;

    @BeforeEach
    public void setUp() {
        university1 = University.builder().id(1L).name("University of Engineering and Technology").abbreviation("UET")
                .elo(1000).build();
        university2 = University.builder().id(2L).name("Hanoi University of Science and Technology")
                .abbreviation("HUST").elo(1100).build();
        university3 = University.builder().id(3L).name("Hanoi Medical University").abbreviation("HMU").elo(900).build();
        university4 = University.builder().id(4L).name("FPT University").abbreviation("FPT").elo(1200).build();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    public void startNewDuel_shouldReturnNull_whenNoCandidatesFound() {
        when(universityRepository.findRandom()).thenReturn(university3);
        when(universityRepository.findAllOpponentsWithSharedTag(university3.getId()))
                .thenReturn(Collections.emptyList());

        SoloMatchResponse result = soloMatchService.startNewDuel();

        Assertions.assertNull(result);
        verifyNoInteractions(valueOperations); // Redis never touched
    }

    @Test
    public void startNewDuel_returnResponse_andSaveToRedis() {
        UniversityResponse res1 = new UniversityResponse();
        UniversityResponse res2 = new UniversityResponse();

        when(universityRepository.findRandom()).thenReturn(university1);
        when(universityRepository.findAllOpponentsWithSharedTag(university1.getId()))
                .thenReturn(List.of(university2, university4));
        when(universityMapper.mapToResponseWithTags(university1)).thenReturn(res1);
        when(universityMapper.mapToResponseWithTags(any())).thenReturn(res2);

        SoloMatchResponse result = soloMatchService.startNewDuel();

        Assertions.assertNotNull(result);
        Assertions.assertNotNull(result.getPublicMatchId());
        Assertions.assertEquals(res1, result.getUniversity1());
        Assertions.assertNotNull(result.getUniversity2());
        Assertions.assertEquals(res2, result.getUniversity2());

        verify(valueOperations).set(anyString(), any(SoloMatch.class), eq(3L), eq(TimeUnit.MINUTES));
    }

    @Test
    public void chooseWinner_throwException_whenMatchExpired() {

    }
}
