package com.flowboard.service;

import com.flowboard.dto.ColumnDto;

public interface ColumnService {
    ColumnDto createColumn(Long boardId, ColumnDto columnDto, Long userId);
    ColumnDto updateColumn(Long columnId, ColumnDto columnDto, Long userId);
    void deleteColumn(Long columnId, Long userId);
}
