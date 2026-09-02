package com.example.restrauntproject.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequestDTO {
    private String name;
    private String phoneNumber;
    private String streetLine1;
    private String streetLine2;
    private String country;
    private String pinCode;

    private Double latitude;
    private Double longitude;

}
