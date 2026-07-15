package com.flowboard.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColumnDto {
    private Long id;
    private String title;
    private Integer position;
    private List<TaskDto> tasks;
}
