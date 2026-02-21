package com.fitness.activityservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {

    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId){
        try {
            log.info("Validating user with ID: {}", userId);
            
            Boolean result = userServiceWebClient
                    .get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
            
            log.info("Validation result for user {}: {}", userId, result);
            
            return result != null && result;
            
        } catch (WebClientResponseException e) {
            log.error("WebClient error while validating user {}: Status={}, Body={}", 
                    userId, e.getStatusCode(), e.getResponseBodyAsString());
            e.printStackTrace();
        } catch (Exception e) {
            log.error("Unexpected error while validating user {}: {}", userId, e.getMessage(), e);
        }
        return false;
    }
}
