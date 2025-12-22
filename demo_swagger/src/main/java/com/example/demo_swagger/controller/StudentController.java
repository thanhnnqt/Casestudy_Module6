package com.example.demo_swagger.controller;

import com.example.demo_swagger.entity.Student;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api/students")

public class StudentController {
    private static final List<Student> DATA = new ArrayList<>();

    static {
        DATA.add(new Student(1L, "Nguyen Van A", "a@gmail.com"));
        DATA.add(new Student(2L, "Tran Van B", "b@gmail.com"));
    }

    @Operation(summary = "Lấy danh sách học viên",
            description = "Trả về toàn bộ học viên có trong danh sách")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping
    public ResponseEntity<?> getAll() {
        return new ResponseEntity<>(DATA, HttpStatus.OK);
    }

    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tạo mới thành công")
    })
    @PostMapping("/create")
    public ResponseEntity<?> creatStudent(@RequestBody Student student) {
        DATA.add(student);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
