package com.flowboard.repository;

import com.flowboard.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByColumnIdOrderByPositionAsc(Long columnId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.column.board.user.id = :userId")
    long countTotalTasksByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.column.board.user.id = :userId AND LOWER(t.column.title) = 'done'")
    long countDoneTasksByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.column.board.user.id = :userId AND LOWER(t.column.title) = 'in progress'")
    long countInProgressTasksByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Task t WHERE t.column.board.user.id = :userId")
    List<Task> findAllTasksByUserId(@Param("userId") Long userId);
}
