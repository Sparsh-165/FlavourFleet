package com.example.restrauntproject.dto;


import com.example.restrauntproject.type.MenuItemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponseDTO {

    private Long id;
    private String name;
    private String description;
    private MenuItemType menuItemType;
    private String label;
    private List<MenuItemVariantResponseDTO> menuItemVariants;
}
