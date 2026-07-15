package com.flowboard.service.impl;

import com.flowboard.dto.LabelDto;
import com.flowboard.dto.TaskDto;
import com.flowboard.entity.KanbanColumn;
import com.flowboard.entity.Label;
import com.flowboard.entity.Task;
import com.flowboard.exception.ResourceNotFoundException;
import com.flowboard.exception.UnauthorizedException;
import com.flowboard.repository.ColumnRepository;
import com.flowboard.repository.TaskRepository;
import com.flowboard.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Override
    @Transactional
    public TaskDto createTask(Long columnId, TaskDto taskDto, Long userId) {
        KanbanColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        if (!column.getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this column");
        }

        int position = column.getTasks().size();

        Task.Priority priorityEnum = Task.Priority.MEDIUM;
        if (taskDto.getPriority() != null) {
            try {
                priorityEnum = Task.Priority.valueOf(taskDto.getPriority().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .priority(priorityEnum)
                .dueDate(taskDto.getDueDate())
                .position(position)
                .assignee(taskDto.getAssignee())
                .column(column)
                .labels(new ArrayList<>())
                .build();

        if (taskDto.getLabels() != null) {
            for (LabelDto labelDto : taskDto.getLabels()) {
                task.getLabels().add(Label.builder()
                        .name(labelDto.getName())
                        .color(labelDto.getColor())
                        .task(task)
                        .build());
            }
        }

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getColumn().getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this task");
        }

        return convertToDto(task);
    }

    @Override
    @Transactional
    public TaskDto updateTask(Long taskId, TaskDto taskDto, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getColumn().getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this task");
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setAssignee(taskDto.getAssignee());
        task.setDueDate(taskDto.getDueDate());

        if (taskDto.getPriority() != null) {
            try {
                task.setPriority(Task.Priority.valueOf(taskDto.getPriority().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        if (taskDto.getPosition() != null) {
            task.setPosition(taskDto.getPosition());
        }

        // Handle dynamic label lists: clear and add to keep it simple and accurate
        task.getLabels().clear();
        if (taskDto.getLabels() != null) {
            for (LabelDto labelDto : taskDto.getLabels()) {
                task.getLabels().add(Label.builder()
                        .name(labelDto.getName())
                        .color(labelDto.getColor())
                        .task(task)
                        .build());
            }
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getColumn().getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this task");
        }

        taskRepository.delete(task);
    }

    @Override
    @Transactional
    public TaskDto moveTask(Long taskId, Long targetColumnId, Integer newPosition, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        KanbanColumn targetColumn = columnRepository.findById(targetColumnId)
                .orElseThrow(() -> new ResourceNotFoundException("Target column not found"));

        if (!task.getColumn().getBoard().getUser().getId().equals(userId) ||
            !targetColumn.getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to move this task");
        }

        // If shifting in the same column
        if (task.getColumn().getId().equals(targetColumnId)) {
            List<Task> siblingTasks = taskRepository.findByColumnIdOrderByPositionAsc(targetColumnId);
            siblingTasks.remove(task);
            int idx = Math.min(newPosition, siblingTasks.size());
            siblingTasks.add(idx, task);
            for (int i = 0; i < siblingTasks.size(); i++) {
                siblingTasks.get(i).setPosition(i);
            }
            taskRepository.saveAll(siblingTasks);
        } else {
            // If shifting to another column
            List<Task> sourceSiblings = taskRepository.findByColumnIdOrderByPositionAsc(task.getColumn().getId());
            sourceSiblings.remove(task);
            for (int i = 0; i < sourceSiblings.size(); i++) {
                sourceSiblings.get(i).setPosition(i);
            }
            taskRepository.saveAll(sourceSiblings);

            List<Task> targetSiblings = taskRepository.findByColumnIdOrderByPositionAsc(targetColumnId);
            int idx = Math.min(newPosition, targetSiblings.size());
            task.setColumn(targetColumn);
            targetSiblings.add(idx, task);
            for (int i = 0; i < targetSiblings.size(); i++) {
                targetSiblings.get(i).setPosition(i);
            }
            taskRepository.saveAll(targetSiblings);
        }

        return convertToDto(task);
    }

    private TaskDto convertToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .position(task.getPosition())
                .assignee(task.getAssignee())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .columnId(task.getColumn().getId())
                .labels(task.getLabels().stream()
                        .map(lbl -> LabelDto.builder()
                                .id(lbl.getId())
                                .name(lbl.getName())
                                .color(lbl.getColor())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
