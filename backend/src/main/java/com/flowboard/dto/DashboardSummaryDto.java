package com.flowboard.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDto {
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long overdueTasks;
    private Map<String, Long> taskStatusCounts; // "To Do", "In Progress", "Review", "Done"
    private Map<String, Long> taskPriorityCounts; // "LOW", "MEDIUM", "HIGH"
    private List<BoardDto> recentBoards;
}
