package com.course.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorDetails> handleResourceNotFoundException(ResourceNotFoundException ex,
                        WebRequest request) {
                ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
                                request.getDescription(false));
                return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(CourseFullException.class)
        public ResponseEntity<ErrorDetails> handleCourseFullException(CourseFullException ex, WebRequest request) {
                ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
                                request.getDescription(false));
                return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(AlreadyEnrolledException.class)
        public ResponseEntity<ErrorDetails> handleAlreadyEnrolledException(AlreadyEnrolledException ex,
                        WebRequest request) {
                ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
                                request.getDescription(false));
                return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorDetails> handleIllegalArgumentException(IllegalArgumentException ex,
                        WebRequest request) {
                ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
                                request.getDescription(false));
                return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorDetails> handleValidationException(MethodArgumentNotValidException ex,
                        WebRequest request) {
                String errors = ex.getBindingResult().getFieldErrors().stream()
                                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                                .collect(Collectors.joining(", "));
                ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), "Validation Failed: " + errors,
                                request.getDescription(false));
                return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
                ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(),
                                request.getDescription(false));
                return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
