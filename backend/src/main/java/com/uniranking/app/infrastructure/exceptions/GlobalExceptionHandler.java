package com.uniranking.app.infrastructure.exceptions;

import java.time.Instant;

import com.uniranking.app.domains.auth.exceptions.*;
import com.uniranking.app.domains.news.exceptions.ScrapingException;
import com.uniranking.app.domains.news.exceptions.ScrapingTimeoutException;
import com.uniranking.app.domains.news.exceptions.SiteUnavailableException;
import com.uniranking.app.domains.scheduleMatch.exceptions.*;
import com.uniranking.app.domains.searching.exceptions.UniversityNotFoundException;
import com.uniranking.app.domains.soloMatch.exceptions.InsufficientOpponentsException;
import com.uniranking.app.domains.soloMatch.exceptions.InvalidMatchParticipantException;
import com.uniranking.app.domains.soloMatch.exceptions.SoloMatchExpiredException;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // General exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleOther(Exception ex,HttpServletRequest request) {
        return buildErrorResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // Authentication exceptions
    @ExceptionHandler(ExistedEmailException.class)
    public ResponseEntity<ErrorResponse> handleExistingUser(ExistedEmailException ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(Exception ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler({
            RefreshTokenNotFoundException.class,
            RefreshTokenExpiredException.class,
            InvalidSessionException.class
    })
    public ResponseEntity<ErrorResponse> handleUnauthorized(Exception ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                "Invalid email or password",
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SuspiciousTokenUsageException.class)
    public ResponseEntity<ErrorResponse> handleSuspiciousActivity(SuspiciousTokenUsageException ex, HttpServletRequest request) {
        return buildErrorResponse(ex, HttpStatus.FORBIDDEN, request);
    }

    // Scraping exceptions
    @ExceptionHandler(ScrapingException.class)
    public ResponseEntity<ErrorResponse> handleScrapingException(ScrapingException ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(SiteUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleSiteUnavailableException(SiteUnavailableException ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.SERVICE_UNAVAILABLE, request);
    }

    @ExceptionHandler(ScrapingTimeoutException.class)
    public ResponseEntity<ErrorResponse> handleSocketTimeoutException(ScrapingTimeoutException ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.SERVICE_UNAVAILABLE, request);
    }

    // Solo match exceptions
    @ExceptionHandler(SoloMatchExpiredException.class)
    public ResponseEntity<ErrorResponse> handleSoloMatchExpired(SoloMatchExpiredException ex, HttpServletRequest request) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(InvalidMatchParticipantException.class)
    public ResponseEntity<ErrorResponse> handleInvalidParticipant(InvalidMatchParticipantException ex, HttpServletRequest request) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(InsufficientOpponentsException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientOpponents(InsufficientOpponentsException ex, HttpServletRequest request) {
        return buildErrorResponse(ex, HttpStatus.CONFLICT, request);
    }

    // Schedule match exceptions
    @ExceptionHandler({
            MatchNotFoundException.class,
            CommentNotFoundException.class,
            UniversityNotFoundException.class
    })
    public ResponseEntity<ErrorResponse> handleMatchNotFound(Exception ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler({
            MatchNotStartedException.class,
            InvalidMatchTimeException.class,
            InvalidParticipantCountException.class,
            MaxCommentDepthExceededException.class
    })
    public ResponseEntity<ErrorResponse> handleMatchNotStarted(Exception ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(DuplicateVoteException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateVote(DuplicateVoteException ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(UnauthorizedCommentAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedCommentAccess(UnauthorizedCommentAccessException ex, HttpServletRequest request){
        return buildErrorResponse(ex, HttpStatus.UNAUTHORIZED, request);
    }

    // Helper
    private ResponseEntity<ErrorResponse> buildErrorResponse(Exception ex, HttpStatus status, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, status);
    }
}
