package com.course.app.service;

import com.course.app.dto.AuthResponseDto;
import com.course.app.dto.StudentLoginDto;
import com.course.app.dto.StudentRegisterDto;
import com.course.app.model.Student;
import com.course.app.repository.StudentRepository;
import com.course.app.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public StudentServiceImpl(StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public Student registerStudent(StudentRegisterDto registerDto) {
        if (studentRepository.existsByUsername(registerDto.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Student student = new Student();
        student.setUsername(registerDto.getUsername());
        student.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        student.setEmail(registerDto.getEmail());
        student.setName(registerDto.getName());
        student.setRole("ROLE_STUDENT"); // Default role

        return studentRepository.save(student);
    }

    @Override
    public AuthResponseDto loginStudent(StudentLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(userDetails);

        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new AuthResponseDto(jwt, userDetails.getUsername(), role);
    }

    @Override
    public Student getCurrentStudent() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        String username = authentication.getName();
        return studentRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Student not found for username: " + username));
    }
}
