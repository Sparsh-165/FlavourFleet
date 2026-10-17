package com.example.restrauntproject.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;

    private String streetLine1;
    private String streetLine2;
    private String country;
    private String pinCode;
    private Double latitude;
    private Double longitude;
    private String label;
    private boolean defaultAddress;

}
