package com.flowboard.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabelDto {
    private Long id;
    private String name;
    private String color;
}
