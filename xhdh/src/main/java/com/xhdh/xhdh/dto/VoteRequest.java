package com.xhdh.xhdh.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteRequest {
    private long userId;
    private int universityId;
    private int tagId;
    private long matchId;
}
