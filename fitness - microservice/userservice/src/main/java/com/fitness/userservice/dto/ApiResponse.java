package com.fitness.userservice.dto;

import lombok.Getter;

@Getter
public class ApiResponse {

    private String message;
    private boolean success;

    public ApiResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

}
