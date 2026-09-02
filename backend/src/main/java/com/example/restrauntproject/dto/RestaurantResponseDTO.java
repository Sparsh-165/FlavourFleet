package com.example.restrauntproject.dto;


import lombok.Data;

import java.util.List;

@Data
public class RestaurantResponseDTO {
    private Long id;
    private String name;
    private String phoneNumber;
    private String streetLine1;
    private String streetLine2;
    private String country;
    private String pinCode;
    List<MenuItemResponseDTO> menuItems;


}
