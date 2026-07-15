package com.flowboard.service;

import com.flowboard.dto.BoardDto;
import java.util.List;

public interface BoardService {
    List<BoardDto> getAllBoardsForUser(Long userId);
    BoardDto createBoard(BoardDto boardDto, Long userId);
    BoardDto getBoardById(Long boardId, Long userId);
    BoardDto updateBoard(Long boardId, BoardDto boardDto, Long userId);
    void deleteBoard(Long boardId, Long userId);
}
