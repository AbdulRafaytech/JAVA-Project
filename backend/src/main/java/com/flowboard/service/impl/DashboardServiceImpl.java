package com.flowboard.service.impl;

import com.flowboard.dto.BoardDto;
import com.flowboard.dto.DashboardSummaryDto;
import com.flowboard.entity.Board;
import com.flowboard.entity.Task;
import com.flowboard.repository.BoardRepository;
import com.flowboard.repository.TaskRepository;
import com.flowboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(Long userId) {
        // Fetch all user tasks across all boards
        List<Task> allTasks = taskRepository.findAllTasksByUserId(userId);
        LocalDate today = LocalDate.now();

        long totalTasks = allTasks.size();
        long completedTasks = allTasks.stream()
                .filter(t -> t.getColumn() != null && t.getColumn().getTitle().equalsIgnoreCase("Done"))
                .count();
        long inProgressTasks = allTasks.stream()
                .filter(t -> t.getColumn() != null && t.getColumn().getTitle().equalsIgnoreCase("In Progress"))
                .count();
        long overdueTasks = allTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(today) &&
                        (t.getColumn() == null || !t.getColumn().getTitle().equalsIgnoreCase("Done")))
                .count();

        // Calculate status counts
        Map<String, Long> statusCounts = new HashMap<>();
        // Set defaults
        statusCounts.put("To Do", 0L);
        statusCounts.put("In Progress", 0L);
        statusCounts.put("Review", 0L);
        statusCounts.put("Done", 0L);

        for (Task task : allTasks) {
            if (task.getColumn() != null) {
                String columnTitle = task.getColumn().getTitle();
                statusCounts.put(columnTitle, statusCounts.getOrDefault(columnTitle, 0L) + 1);
            }
        }

        // Calculate priority counts
        Map<String, Long> priorityCounts = new HashMap<>();
        priorityCounts.put("LOW", 0L);
        priorityCounts.put("MEDIUM", 0L);
        priorityCounts.put("HIGH", 0L);

        for (Task task : allTasks) {
            if (task.getPriority() != null) {
                String priorityName = task.getPriority().name();
                priorityCounts.put(priorityName, priorityCounts.getOrDefault(priorityName, 0L) + 1);
            }
        }

        // Fetch recent boards
        List<Board> recentBoardsList = boardRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        // Limit to 5
        List<BoardDto> recentBoards = recentBoardsList.stream()
                .limit(5)
                .map(board -> BoardDto.builder()
                        .id(board.getId())
                        .title(board.getTitle())
                        .description(board.getDescription())
                        .color(board.getColor())
                        .createdAt(board.getCreatedAt())
                        .updatedAt(board.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardSummaryDto.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .inProgressTasks(inProgressTasks)
                .overdueTasks(overdueTasks)
                .taskStatusCounts(statusCounts)
                .taskPriorityCounts(priorityCounts)
                .recentBoards(recentBoards)
                .build();
    }
}
