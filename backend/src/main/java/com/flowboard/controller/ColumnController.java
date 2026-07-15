package com.flowboard.controller;

import com.flowboard.dto.ColumnDto;
import com.flowboard.security.UserDetailsImpl;
import com.flowboard.service.ColumnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ColumnController {

    @Autowired
    private ColumnService columnService;

    @PostMapping("/boards/{boardId}/columns")
    public ResponseEntity<ColumnDto> createColumn(
            @PathVariable Long boardId,
            @RequestBody ColumnDto columnDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ColumnDto createdColumn = columnService.createColumn(boardId, columnDto, userDetails.getId());
        return new ResponseEntity<>(createdColumn, HttpStatus.CREATED);
    }

    @PutMapping("/columns/{id}")
    public ResponseEntity<ColumnDto> updateColumn(
            @PathVariable Long id,
            @RequestBody ColumnDto columnDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ColumnDto updatedColumn = columnService.updateColumn(id, columnDto, userDetails.getId());
        return ResponseEntity.ok(updatedColumn);
    }

    @DeleteMapping("/columns/{id}")
    public ResponseEntity<Void> deleteColumn(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        columnService.deleteColumn(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
