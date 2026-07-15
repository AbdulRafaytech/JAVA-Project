package com.flowboard.service.impl;

import com.flowboard.dto.BoardDto;
import com.flowboard.dto.ColumnDto;
import com.flowboard.dto.TaskDto;
import com.flowboard.dto.LabelDto;
import com.flowboard.entity.*;
import com.flowboard.exception.ResourceNotFoundException;
import com.flowboard.exception.UnauthorizedException;
import com.flowboard.repository.BoardRepository;
import com.flowboard.repository.UserRepository;
import com.flowboard.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BoardDto> getAllBoardsForUser(Long userId) {
        return boardRepository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(this::convertToDtoLight)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BoardDto createBoard(BoardDto boardDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Board board = Board.builder()
                .title(boardDto.getTitle())
                .description(boardDto.getDescription())
                .color(boardDto.getColor() != null ? boardDto.getColor() : "from-purple-500 to-indigo-500")
                .user(user)
                .build();

        // Create default columns: To Do, In Progress, Review, Done
        List<KanbanColumn> defaultColumns = new ArrayList<>();
        String[] titles = {"To Do", "In Progress", "Review", "Done"};
        for (int i = 0; i < titles.length; i++) {
            defaultColumns.add(KanbanColumn.builder()
                    .title(titles[i])
                    .position(i)
                    .board(board)
                    .build());
        }
        board.setColumns(defaultColumns);

        Board savedBoard = boardRepository.save(board);
        return convertToDtoFull(savedBoard);
    }

    @Override
    @Transactional(readOnly = true)
    public BoardDto getBoardById(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this board");
        }

        return convertToDtoFull(board);
    }

    @Override
    @Transactional
    public BoardDto updateBoard(Long boardId, BoardDto boardDto, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this board");
        }

        board.setTitle(boardDto.getTitle());
        board.setDescription(boardDto.getDescription());
        if (boardDto.getColor() != null) {
            board.setColor(boardDto.getColor());
        }

        Board updatedBoard = boardRepository.save(board);
        return convertToDtoFull(updatedBoard);
    }

    @Override
    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));

        if (!board.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this board");
        }

        boardRepository.delete(board);
    }

    private BoardDto convertToDtoLight(Board board) {
        return BoardDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .color(board.getColor())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }

    private BoardDto convertToDtoFull(Board board) {
        List<ColumnDto> columnDtos = board.getColumns().stream()
                .map(col -> ColumnDto.builder()
                        .id(col.getId())
                        .title(col.getTitle())
                        .position(col.getPosition())
                        .tasks(col.getTasks().stream()
                                .map(task -> TaskDto.builder()
                                        .id(task.getId())
                                        .title(task.getTitle())
                                        .description(task.getDescription())
                                        .priority(task.getPriority().name())
                                        .dueDate(task.getDueDate())
                                        .position(task.getPosition())
                                        .assignee(task.getAssignee())
                                        .createdAt(task.getCreatedAt())
                                        .updatedAt(task.getUpdatedAt())
                                        .columnId(col.getId())
                                        .labels(task.getLabels().stream()
                                                .map(label -> LabelDto.builder()
                                                        .id(label.getId())
                                                        .name(label.getName())
                                                        .color(label.getColor())
                                                        .build())
                                                .collect(Collectors.toList()))
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return BoardDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .description(board.getDescription())
                .color(board.getColor())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .columns(columnDtos)
                .build();
    }
}
