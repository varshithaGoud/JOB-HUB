package com.educonnect.jobhub.controller;

import com.educonnect.jobhub.repository.ApplicationRepository;
import com.educonnect.jobhub.repository.JobRepository;
import com.educonnect.jobhub.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public StatsController(UserRepository userRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        long recruiters = userRepository.findAll().stream()
                .filter(u -> "RECRUITER".equalsIgnoreCase(u.getRole()))
                .count();

        long seekers = userRepository.findAll().stream()
                .filter(u -> "JOB_SEEKER".equalsIgnoreCase(u.getRole()))
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);
        stats.put("totalRecruiters", recruiters);
        stats.put("totalJobSeekers", seekers);

        return stats;
    }
}
