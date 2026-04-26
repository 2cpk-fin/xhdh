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

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicCommentId", ignore = true)
    @Mapping(target = "commentDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "likes", constant = "0L")
    @Mapping(target = "replyCount", constant = "0L")
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "scheduleMatch", ignore = true)
    public abstract Comment toComment(CommentRequest request);

    @AfterMapping
    protected void linkRelations(CommentRequest request, @MappingTarget Comment comment) {
        comment.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));

        comment.setScheduleMatch(scheduleMatchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found")));

        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));

            // Prevent 3-layer nesting: the parent must be a top-level comment.
            // If the parent itself has a parent, the request is trying to reply to a reply.
            if (parent.getParent() != null) {
                throw new RuntimeException("Cannot reply to a reply — only one level of nesting is allowed");
            }

            comment.setParent(parent);
        }
    }

    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "parent", target = "parent")
    public abstract CommentResponse toCommentResponse(Comment comment);
}