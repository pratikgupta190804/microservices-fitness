package com.fitness.gateway.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid Email")
    private String email;

    private String keycloakId;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Minimum length should be 6")
    private String password;
    private String firstName;
    private String lastName;
}
