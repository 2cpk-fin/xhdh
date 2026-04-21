package com.uniranking.app.domains.scheduleMatch.comment;

import com.uniranking.app.domains.scheduleMatch.match.ScheduleMatchRepository;
import com.uniranking.app.domains.user.UserRepository;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class CommentMapper {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected ScheduleMatchRepository scheduleMatchRepository;

    @Autowired
    protected CommentRepository commentRepository;

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicCommentId", ignore = true)
    @Mapping(target = "commentDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "likes", constant = "0L")
    @Mapping(target = "replyCount", constant = "0L")
    @Mapping(target = "parent", ignore = true)       // Set in AfterMapping
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "user", ignore = true)        // Set in AfterMapping
    @Mapping(target = "scheduleMatch", ignore = true) // Set in AfterMapping
    public abstract Comment toComment(CommentRequest request);

    @AfterMapping
    protected void linkRelations(CommentRequest request, @MappingTarget Comment comment) {
        comment.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));

        comment.setScheduleMatch(scheduleMatchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found")));

        if (request.getParentId() != null) {
            comment.setParent(commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found")));
        }
    }

    // Entity -> Response
    @Mapping(source = "publicCommentId", target = "id")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "scheduleMatch.publicMatchId", target = "matchId")
    @Mapping(source = "parent.publicCommentId", target = "parentId")
    public abstract CommentResponse toCommentResponse(Comment comment);
}