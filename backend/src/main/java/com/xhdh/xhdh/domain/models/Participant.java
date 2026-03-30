package com.xhdh.xhdh.domain.models;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@RedisHash("Leaderboard")
@Getter
@Setter
public class Participant implements Serializable {
    @Id
    private String id;

    private int rank;

    private String name;

    private long vote;
}
