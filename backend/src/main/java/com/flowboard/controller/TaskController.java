package com.flowboard.controller;

import com.flowboard.dto.TaskDto;
import com.flowboard.security.UserDetailsImpl;
import com.flowboard.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/columns/{columnId}/tasks")
    public ResponseEntity<TaskDto> createTask(
            @PathVariable Long columnId,
            @RequestBody TaskDto taskDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        TaskDto createdTask = taskService.createTask(columnId, taskDto, userDetails.getId());
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskDto> getTaskById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        TaskDto task = taskService.getTaskById(id, userDetails.getId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Long id,
            @RequestBody TaskDto taskDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        TaskDto updatedTask = taskService.updateTask(id, taskDto, userDetails.getId());
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        taskService.deleteTask(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/tasks/{id}/move")
    public ResponseEntity<TaskDto> moveTask(
            @PathVariable Long id,
            @RequestParam Long targetColumnId,
            @RequestParam Integer position,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        TaskDto movedTask = taskService.moveTask(id, targetColumnId, position, userDetails.getId());
        return ResponseEntity.ok(movedTask);
    }
}
