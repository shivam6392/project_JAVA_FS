package com.course.app.controller;

import com.course.app.dto.AuthResponseDto;
import com.course.app.dto.StudentLoginDto;
import com.course.app.dto.StudentRegisterDto;
import com.course.app.model.Student;
import com.course.app.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final StudentService studentService;

    public AuthController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<Student> register(@Valid @RequestBody StudentRegisterDto registerDto) {
        Student registered = studentService.registerStudent(registerDto);
        return ResponseEntity.ok(registered);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody StudentLoginDto loginDto) {
        AuthResponseDto response = studentService.loginStudent(loginDto);
        return ResponseEntity.ok(response);
    }
}
