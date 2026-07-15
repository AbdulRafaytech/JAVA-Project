package com.flowboard.controller;

import com.flowboard.dto.BoardDto;
import com.flowboard.security.UserDetailsImpl;
import com.flowboard.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardDto>> getAllBoards(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<BoardDto> boards = boardService.getAllBoardsForUser(userDetails.getId());
        return ResponseEntity.ok(boards);
    }

    @PostMapping
    public ResponseEntity<BoardDto> createBoard(@RequestBody BoardDto boardDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        BoardDto createdBoard = boardService.createBoard(boardDto, userDetails.getId());
        return new ResponseEntity<>(createdBoard, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDto> getBoardById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        BoardDto board = boardService.getBoardById(id, userDetails.getId());
        return ResponseEntity.ok(board);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardDto> updateBoard(@PathVariable Long id, @RequestBody BoardDto boardDto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        BoardDto updatedBoard = boardService.updateBoard(id, boardDto, userDetails.getId());
        return ResponseEntity.ok(updatedBoard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        boardService.deleteBoard(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
