package com.flowboard.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String priority; // "LOW", "MEDIUM", "HIGH"
    private LocalDate dueDate;
    private Integer position;
    private String assignee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<LabelDto> labels;
    private Long columnId;
}
