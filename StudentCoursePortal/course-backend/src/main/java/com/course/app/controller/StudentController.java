package com.course.app.controller;

import com.course.app.dto.CourseDto;
import com.course.app.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students/courses")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final CourseService courseService;

    public StudentController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> getEnrolledCourses() {
        return ResponseEntity.ok(courseService.getEnrolledCourses());
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<Void> enrollInCourse(@PathVariable Long courseId) {
        courseService.enrollStudent(courseId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{courseId}/unenroll")
    public ResponseEntity<Void> unenrollFromCourse(@PathVariable Long courseId) {
        courseService.unenrollStudent(courseId);
        return ResponseEntity.ok().build();
    }
}
