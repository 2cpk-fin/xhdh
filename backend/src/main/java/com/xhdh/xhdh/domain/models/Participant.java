package com.xhdh.xhdh.domain.models;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("Leaderboard")
@Getter
@Setter
public class Participant {
    @Id
    private String id;

    private int rank;

    private String name;

    private long vote;
}
