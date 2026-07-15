package com.flowboard.service.impl;

import com.flowboard.dto.ColumnDto;
import com.flowboard.entity.Board;
import com.flowboard.entity.KanbanColumn;
import com.flowboard.exception.ResourceNotFoundException;
import com.flowboard.exception.UnauthorizedException;
import com.flowboard.repository.BoardRepository;
import com.flowboard.repository.ColumnRepository;
import com.flowboard.service.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;

@Service
public class ColumnServiceImpl implements ColumnService {

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Override
    @Transactional
    public ColumnDto createColumn(Long boardId, ColumnDto columnDto, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this board");
        }

        int position = board.getColumns().size();

        KanbanColumn column = KanbanColumn.builder()
                .title(columnDto.getTitle())
                .position(position)
                .board(board)
                .tasks(new ArrayList<>())
                .build();

        KanbanColumn savedColumn = columnRepository.save(column);

        return ColumnDto.builder()
                .id(savedColumn.getId())
                .title(savedColumn.getTitle())
                .position(savedColumn.getPosition())
                .tasks(new ArrayList<>())
                .build();
    }

    @Override
    @Transactional
    public ColumnDto updateColumn(Long columnId, ColumnDto columnDto, Long userId) {
        KanbanColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        if (!column.getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this column");
        }

        column.setTitle(columnDto.getTitle());
        if (columnDto.getPosition() != null) {
            column.setPosition(columnDto.getPosition());
        }

        KanbanColumn updatedColumn = columnRepository.save(column);

        return ColumnDto.builder()
                .id(updatedColumn.getId())
                .title(updatedColumn.getTitle())
                .position(updatedColumn.getPosition())
                .build();
    }

    @Override
    @Transactional
    public void deleteColumn(Long columnId, Long userId) {
        KanbanColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        if (!column.getBoard().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this column");
        }

        columnRepository.delete(column);
    }
}
