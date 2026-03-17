package com.xhdh.xhdh.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteRequest {
    private long userId;
    private long universityId;
    private long tagId;
    private long matchId;
}
