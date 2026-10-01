package com.educonnect.jobhub.repository;

import com.educonnect.jobhub.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserId(Long userId);
    
    List<Application> findByJobId(Long jobId);
    
    boolean existsByJobIdAndUserId(Long jobId, Long userId);
}