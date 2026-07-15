package com.flowboard.service;

import com.flowboard.dto.TaskDto;

public interface TaskService {
    TaskDto createTask(Long columnId, TaskDto taskDto, Long userId);
    TaskDto getTaskById(Long taskId, Long userId);
    TaskDto updateTask(Long taskId, TaskDto taskDto, Long userId);
    void deleteTask(Long taskId, Long userId);
    TaskDto moveTask(Long taskId, Long targetColumnId, Integer newPosition, Long userId);
}
