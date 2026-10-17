package com.example.restrauntproject.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
    private String name;
    private String email;
    private String phoneNumber;

    //Address fields
    private String streetLine1;
    private String streetLine2;
    private String country;
    private String pinCode;
    private Double latitude;
    private Double longitude;
    private String label;
    private boolean defaultAddress;


}
