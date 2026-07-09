package com.bank.app.controller;

import com.bank.app.dto.AuthResponseDto;
import com.bank.app.dto.UserLoginDto;
import com.bank.app.dto.UserRegisterDto;
import com.bank.app.model.User;
import com.bank.app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserRegisterDto registerDto) {
        User savedUser = userService.registerUser(registerDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody UserLoginDto loginDto) {
        AuthResponseDto response = userService.login(loginDto);
        return ResponseEntity.ok(response);
    }
}
