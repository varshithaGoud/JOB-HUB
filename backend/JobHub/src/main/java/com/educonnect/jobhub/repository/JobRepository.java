package com.educonnect.jobhub.repository;

import com.educonnect.jobhub.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterId(Long recruiterId);
    List<Job> findByCategoryIgnoreCase(String category);
}