package com.educonnect.jobhub.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private Long userId;
    private String status; // "PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"
    private LocalDate appliedDate;

    @Column(length = 1500)
    private String coverLetter;
    
    private String resumeUrl;

    public Application() {
    }

    public Application(Long jobId, Long userId, String status, LocalDate appliedDate) {
        this.jobId = jobId;
        this.userId = userId;
        this.status = status;
        this.appliedDate = appliedDate;
    }

    public Application(Long jobId, Long userId, String status, LocalDate appliedDate, String coverLetter, String resumeUrl) {
        this.jobId = jobId;
        this.userId = userId;
        this.status = status;
        this.appliedDate = appliedDate;
        this.coverLetter = coverLetter;
        this.resumeUrl = resumeUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}