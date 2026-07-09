package com.course.app.service;

import com.course.app.dto.AuthResponseDto;
import com.course.app.dto.StudentLoginDto;
import com.course.app.dto.StudentRegisterDto;
import com.course.app.model.Student;

public interface StudentService {
    Student registerStudent(StudentRegisterDto registerDto);

    AuthResponseDto loginStudent(StudentLoginDto loginDto);

    Student getCurrentStudent();
}
