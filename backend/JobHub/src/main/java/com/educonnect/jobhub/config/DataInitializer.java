package com.educonnect.jobhub.config;

import com.educonnect.jobhub.model.Application;
import com.educonnect.jobhub.model.Job;
import com.educonnect.jobhub.model.User;
import com.educonnect.jobhub.repository.ApplicationRepository;
import com.educonnect.jobhub.repository.JobRepository;
import com.educonnect.jobhub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public DataInitializer(UserRepository userRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("Initializing JobHub sample database...");

        // 1. Create Users
        User admin = userRepository.save(new User(
                "System Administrator",
                "admin@jobhub.com",
                "admin123",
                "ADMIN",
                "Lead Administrator",
                "Platform Operations & Security Lead"
        ));

        User recruiter1 = userRepository.save(new User(
                "Sarah Jenkins",
                "techcorp@jobs.com",
                "recruiter123",
                "RECRUITER",
                "Talent Acquisition Lead",
                "Recruiting top tech talent at TechCorp Inc."
        ));

        User recruiter2 = userRepository.save(new User(
                "Marcus Vance",
                "nextgen@jobs.com",
                "recruiter123",
                "RECRUITER",
                "Head of Hiring",
                "Building next generation AI teams at NextGen AI."
        ));

        User seeker1 = userRepository.save(new User(
                "Alex Johnson",
                "alex@seeker.com",
                "seeker123",
                "JOB_SEEKER",
                "Full Stack Developer",
                "Passionate web developer with 4+ years of Java, Spring Boot, and React experience."
        ));

        User seeker2 = userRepository.save(new User(
                "Elena Rostova",
                "elena@seeker.com",
                "seeker123",
                "JOB_SEEKER",
                "UI/UX Product Designer",
                "Creating intuitive interfaces and sleek user experiences for modern web apps."
        ));

        // 2. Create Jobs
        Job job1 = jobRepository.save(new Job(
                "Senior Full-Stack Developer",
                "TechCorp Inc.",
                "Remote / San Francisco",
                "$140,000 - $165,000",
                "Full Time",
                "Engineering",
                "Senior Level",
                recruiter1.getId(),
                "We are looking for a Senior Full-Stack Developer to lead architectural decisions across our core cloud platforms. You will work closely with backend Java/Spring Boot microservices and modern reactive frontends."
        ));

        Job job2 = jobRepository.save(new Job(
                "UI/UX Product Designer",
                "NextGen AI",
                "San Francisco, CA",
                "$115,000 - $135,000",
                "Full Time",
                "Design",
                "Mid Level",
                recruiter2.getId(),
                "Join our design team to craft beautiful visual interfaces, design systems, and micro-interactions for our generative AI suite."
        ));

        Job job3 = jobRepository.save(new Job(
                "Machine Learning Researcher",
                "NextGen AI",
                "Remote",
                "$155,000 - $185,000",
                "Full Time",
                "Data & AI",
                "Senior Level",
                recruiter2.getId(),
                "Opportunity to train and fine-tune large language models and neural architectures for specialized enterprise applications."
        ));

        Job job4 = jobRepository.save(new Job(
                "DevOps & Cloud Engineer",
                "TechCorp Inc.",
                "New York, NY",
                "$130,000 - $150,000",
                "Full Time",
                "Engineering",
                "Mid Level",
                recruiter1.getId(),
                "Build scalable Kubernetes clusters, Automated CI/CD pipelines, and maintain high-availability cloud infrastructure on AWS."
        ));

        Job job5 = jobRepository.save(new Job(
                "Technical Product Manager",
                "InnovateLabs",
                "Hybrid (Chicago, IL)",
                "$120,000 - $140,000",
                "Full Time",
                "Product",
                "Senior Level",
                recruiter1.getId(),
                "Drive product vision, roadmap, and cross-functional team execution for enterprise SaaS platform solutions."
        ));

        Job job6 = jobRepository.save(new Job(
                "Frontend React Specialist",
                "CloudScale Technologies",
                "Remote",
                "$100,000 - $120,000",
                "Full Time",
                "Engineering",
                "Mid Level",
                recruiter2.getId(),
                "Create responsive, high-performance web dashboards and interactive visualizations using modern React & JavaScript ecosystem."
        ));

        // 3. Create Sample Applications
        applicationRepository.save(new Application(
                job1.getId(),
                seeker1.getId(),
                "UNDER_REVIEW",
                LocalDate.now().minusDays(3),
                "I have extensive experience building scalable Java Spring Boot backend services and responsive frontends.",
                "https://github.com/alex-johnson-dev"
        ));

        applicationRepository.save(new Application(
                job6.getId(),
                seeker1.getId(),
                "PENDING",
                LocalDate.now().minusDays(1),
                "Excited to submit my application for the Frontend React Specialist role.",
                "https://github.com/alex-johnson-dev"
        ));

        applicationRepository.save(new Application(
                job2.getId(),
                seeker2.getId(),
                "ACCEPTED",
                LocalDate.now().minusDays(5),
                "Enthusiastic about bringing human-centered product design principles to NextGen AI's suite.",
                "https://dribbble.com/elena-design"
        ));

        System.out.println("JobHub sample database initialized successfully!");
    }
}
