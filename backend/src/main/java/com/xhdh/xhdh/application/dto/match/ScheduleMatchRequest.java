package com.xhdh.xhdh.application.dto.match;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Getter
@Setter
public class ScheduleMatchRequest {
    @NotBlank(message = "The title cannot be empty!")
    @Size(max = 150, message = "Too long!")
    private String title;

    @NotBlank(message = "Tag cannot be empty!")
    private String tagName;

    @NotNull(message = "Participants list cannot be null")
    @Size(min = 2, message = "There must be at least 2 participants")
    private List<@NotBlank(message = "Participant name cannot be empty") String> participants;

    @Schema(
            description = "Match start time. Defaults to current hour if empty.",
            example = "2026-04-08T10:00:00"
    )
    private LocalDateTime startTime;

    @Schema(
            description = "Match end time. Defaults to 24 hours after start time.",
            example = "2026-04-09T10:00:00"
    )
    private LocalDateTime endTime;

    public ScheduleMatchRequest() {
        this.startTime = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS);
        this.endTime = this.startTime.plusDays(1);
    }
}
