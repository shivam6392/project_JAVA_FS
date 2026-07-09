package com.course.app.service;

import com.course.app.dto.CourseDto;
import com.course.app.exception.AlreadyEnrolledException;
import com.course.app.exception.CourseFullException;
import com.course.app.exception.ResourceNotFoundException;
import com.course.app.model.Course;
import com.course.app.model.Student;
import com.course.app.repository.CourseRepository;
import com.course.app.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final StudentService studentService;

    public CourseServiceImpl(CourseRepository courseRepository,
            StudentRepository studentRepository,
            StudentService studentService) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }

    private CourseDto convertToDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setInstructor(course.getInstructor());
        dto.setCapacity(course.getCapacity());
        dto.setEnrolledCount(course.getEnrolledStudents().size());
        return dto;
    }

    @Override
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto getCourseByCode(String code) {
        Course course = courseRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with code: " + code));
        return convertToDto(course);
    }

    @Override
    @Transactional
    public CourseDto createCourse(CourseDto courseDto) {
        if (courseRepository.existsByCode(courseDto.getCode())) {
            throw new IllegalArgumentException("Course code already exists: " + courseDto.getCode());
        }
        Course course = new Course();
        course.setCode(courseDto.getCode());
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setInstructor(courseDto.getInstructor());
        course.setCapacity(courseDto.getCapacity());

        Course saved = courseRepository.save(course);
        return convertToDto(saved);
    }

    @Override
    @Transactional
    public CourseDto updateCourse(Long id, CourseDto courseDto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));

        if (!course.getCode().equals(courseDto.getCode()) && courseRepository.existsByCode(courseDto.getCode())) {
            throw new IllegalArgumentException("Course code already exists: " + courseDto.getCode());
        }

        course.setCode(courseDto.getCode());
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setInstructor(courseDto.getInstructor());
        course.setCapacity(courseDto.getCapacity());

        Course updated = courseRepository.save(course);
        return convertToDto(updated);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with ID: " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void enrollStudent(Long courseId) {
        Student current = studentService.getCurrentStudent();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        if (current.getEnrolledCourses().contains(course)) {
            throw new AlreadyEnrolledException("You are already enrolled in this course: " + course.getTitle());
        }

        if (course.getEnrolledStudents().size() >= course.getCapacity()) {
            throw new CourseFullException("Cannot enroll. The course '" + course.getTitle()
                    + "' is at maximum capacity (" + course.getCapacity() + ").");
        }

        current.getEnrolledCourses().add(course);
        studentRepository.save(current);
    }

    @Override
    @Transactional
    public void unenrollStudent(Long courseId) {
        Student current = studentService.getCurrentStudent();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        if (!current.getEnrolledCourses().contains(course)) {
            throw new IllegalArgumentException("You are not enrolled in this course: " + course.getTitle());
        }

        current.getEnrolledCourses().remove(course);
        studentRepository.save(current);
    }

    @Override
    public List<CourseDto> getEnrolledCourses() {
        Student current = studentService.getCurrentStudent();
        return current.getEnrolledCourses().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
}
