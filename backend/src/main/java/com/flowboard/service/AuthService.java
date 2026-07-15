package com.flowboard.service;

import com.flowboard.dto.JwtResponse;
import com.flowboard.dto.LoginRequest;
import com.flowboard.dto.RegisterRequest;
import com.flowboard.dto.UserDto;

public interface AuthService {
    UserDto registerUser(RegisterRequest registerRequest);
    JwtResponse authenticateUser(LoginRequest loginRequest);
}
