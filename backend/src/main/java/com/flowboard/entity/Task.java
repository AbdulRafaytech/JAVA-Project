package com.flowboard.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(nullable = false)
    private Integer position;

    private String assignee;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    private KanbanColumn column;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Label> labels = new ArrayList<>();

    public Task() {}

    public Task(Long id, String title, String description, Priority priority, LocalDate dueDate, Integer position, String assignee, LocalDateTime createdAt, LocalDateTime updatedAt, KanbanColumn column, List<Label> labels) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.position = position;
        this.assignee = assignee;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.column = column;
        if (labels != null) {
            this.labels = labels;
        }
    }

    public static TaskBuilder builder() {
        return new TaskBuilder();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.priority == null) {
            this.priority = Priority.MEDIUM;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public String getAssignee() { return assignee; }
    public void setAssignee(String assignee) { this.assignee = assignee; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public KanbanColumn getColumn() { return column; }
    public void setColumn(KanbanColumn column) { this.column = column; }

    public List<Label> getLabels() { return labels; }
    public void setLabels(List<Label> labels) { this.labels = labels; }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    // Explicit Builder Class to support Lombok-style builder pattern cleanly
    public static class TaskBuilder {
        private Long id;
        private String title;
        private String description;
        private Priority priority;
        private LocalDate dueDate;
        private Integer position;
        private String assignee;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private KanbanColumn column;
        private List<Label> labels = new ArrayList<>();

        public TaskBuilder id(Long id) { this.id = id; return this; }
        public TaskBuilder title(String title) { this.title = title; return this; }
        public TaskBuilder description(String description) { this.description = description; return this; }
        public TaskBuilder priority(Priority priority) { this.priority = priority; return this; }
        public TaskBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public TaskBuilder position(Integer position) { this.position = position; return this; }
        public TaskBuilder assignee(String assignee) { this.assignee = assignee; return this; }
        public TaskBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TaskBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public TaskBuilder column(KanbanColumn column) { this.column = column; return this; }
        public TaskBuilder labels(List<Label> labels) { this.labels = labels; return this; }

        public Task build() {
            return new Task(id, title, description, priority, dueDate, position, assignee, createdAt, updatedAt, column, labels);
        }
    }
}
