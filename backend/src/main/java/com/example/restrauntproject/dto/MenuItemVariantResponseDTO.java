package com.example.restrauntproject.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemVariantResponseDTO {

    private Long id;
    private String dishVariantName;
    private boolean available;
    private Double price;
    private boolean inventoryManaged;
    private long currentAvailableInventoryCount;
}
