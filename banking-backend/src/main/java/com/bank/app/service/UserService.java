package com.bank.app.service;

import com.bank.app.dto.AuthResponseDto;
import com.bank.app.dto.UserLoginDto;
import com.bank.app.dto.UserRegisterDto;
import com.bank.app.model.User;

public interface UserService {
    User registerUser(UserRegisterDto registerDto);

    AuthResponseDto login(UserLoginDto loginDto);

    User getLoggedInUser();
}
