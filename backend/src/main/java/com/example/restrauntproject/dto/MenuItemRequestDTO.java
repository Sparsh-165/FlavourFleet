package com.example.restrauntproject.dto;

import com.example.restrauntproject.type.MenuItemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemRequestDTO {


    private String name;

    private String description;

    private MenuItemType menuItemType;

    private Long restaurantId;

    private String label;

    private List<MenuItemVariantRequestDTO> menuItemVariants;

}