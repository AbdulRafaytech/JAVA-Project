package com.flowboard.repository;

import com.flowboard.entity.KanbanColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ColumnRepository extends JpaRepository<KanbanColumn, Long> {
    List<KanbanColumn> findByBoardIdOrderByPositionAsc(Long boardId);
}
