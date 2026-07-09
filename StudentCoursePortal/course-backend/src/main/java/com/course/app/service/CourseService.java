package com.course.app.service;

import com.course.app.dto.CourseDto;
import java.util.List;

public interface CourseService {
    List<CourseDto> getAllCourses();

    CourseDto getCourseByCode(String code);

    CourseDto createCourse(CourseDto courseDto);

    CourseDto updateCourse(Long id, CourseDto courseDto);

    void deleteCourse(Long id);

    void enrollStudent(Long courseId);

    void unenrollStudent(Long courseId);

    List<CourseDto> getEnrolledCourses();
}
