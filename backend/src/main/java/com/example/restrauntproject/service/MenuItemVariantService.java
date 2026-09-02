package com.example.restrauntproject.service;


import com.example.restrauntproject.dto.MenuItemVariantRequestDTO;
import com.example.restrauntproject.dto.MenuItemVariantResponseDTO;
import com.example.restrauntproject.entity.MenuItemVariant;
import com.example.restrauntproject.repository.MenuItemVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class MenuItemVariantService {

    @Autowired
    private MenuItemVariantRepository menuItemVariantRepository;

    public ResponseEntity<String> editDetails(Long id, MenuItemVariantRequestDTO menuItemVariantRequestDTO) {

        ResponseEntity<String> validation = validateMenuItemDTO(id, menuItemVariantRequestDTO);

        if (validation != null) {
            return validation;
        }

        Optional<MenuItemVariant> menuItemVariantOptional = menuItemVariantRepository.findById(id);

        if (menuItemVariantOptional.isEmpty()) {
            return new ResponseEntity<>(
                    "Menu Item Variant does not exist",
                    HttpStatusCode.valueOf(404)
            );
        }

        //getting the data that needs to be changed
        MenuItemVariant variant = menuItemVariantOptional.get();

        //Setting up the new data
        variant.setName(menuItemVariantRequestDTO.getDishVariantName());
        variant.setAvailable(menuItemVariantRequestDTO.isAvailable());
        variant.setPrice(menuItemVariantRequestDTO.getPrice());
        variant.setInventoryManaged(menuItemVariantRequestDTO.isInventoryManaged());
        variant.setCurrentAvailableInventoryCount(menuItemVariantRequestDTO.getCurrentAvailableInventoryCount());

        menuItemVariantRepository.save(variant);

        return new ResponseEntity<>(
                "Menu Item Variant updated successfully",
                HttpStatusCode.valueOf(200)
        );
    }

    private ResponseEntity<String> validateMenuItemDTO(
            Long id,
            MenuItemVariantRequestDTO menuItemVariantRequestDTO) {

        // Validate ID
        if (id == null) {
            return new ResponseEntity<>(
                    "Variant ID cannot be null",
                    HttpStatusCode.valueOf(400)
            );
        }

        if (id <= 0) {
            return new ResponseEntity<>(
                    "Variant ID must be greater than 0",
                    HttpStatusCode.valueOf(400)
            );
        }

        // Validate DTO
        if (menuItemVariantRequestDTO == null) {
            return new ResponseEntity<>(
                    "Menu item variant request cannot be null",
                    HttpStatusCode.valueOf(400)
            );
        }

        // Validate variant name
        if (menuItemVariantRequestDTO.getDishVariantName() == null ||
                menuItemVariantRequestDTO.getDishVariantName().trim().isEmpty()) {

            return new ResponseEntity<>(
                    "Dish variant name cannot be empty",
                    HttpStatusCode.valueOf(400)
            );
        }

        if (menuItemVariantRequestDTO.getDishVariantName().trim().length() > 100) {
            return new ResponseEntity<>(
                    "Dish variant name cannot exceed 100 characters",
                    HttpStatusCode.valueOf(400)
            );
        }

        // Validate price
        if (menuItemVariantRequestDTO.getPrice() == null) {
            return new ResponseEntity<>(
                    "Price cannot be null",
                    HttpStatusCode.valueOf(400)
            );
        }

        if (menuItemVariantRequestDTO.getPrice() < 0) {
            return new ResponseEntity<>(
                    "Price cannot be negative",
                    HttpStatusCode.valueOf(400)
            );
        }

        // Validate inventory count
        if (menuItemVariantRequestDTO.getCurrentAvailableInventoryCount() < 0) {
            return new ResponseEntity<>(
                    "Inventory count cannot be negative",
                    HttpStatusCode.valueOf(400)
            );
        }

        // Everything is valid
        return null;
    }


    public ResponseEntity<?> getMenuItemVariant(Long id) {
        ResponseEntity<String> validation = validateMenuItemVariantId(id);

        if(validation != null){
            return validation;
        }


        Optional<MenuItemVariant> result = menuItemVariantRepository.findById(id);

        if(result.isEmpty()){
            return new ResponseEntity<>("No entry exist",HttpStatusCode.valueOf(404));
        }

        MenuItemVariant variant = result.get();

        MenuItemVariantResponseDTO responseDTO = new MenuItemVariantResponseDTO();
        responseDTO.setId(variant.getId());
        responseDTO.setDishVariantName(variant.getName());
        responseDTO.setAvailable(variant.isAvailable());
        responseDTO.setPrice(variant.getPrice());
        responseDTO.setInventoryManaged(variant.isInventoryManaged());
        responseDTO.setCurrentAvailableInventoryCount(variant.getCurrentAvailableInventoryCount());

        return new ResponseEntity<>(
                responseDTO,
                HttpStatusCode.valueOf(200)
        );

    }

    private ResponseEntity<String> validateMenuItemVariantId(Long id) {

        // Validate ID
        if (id == null) {
            return new ResponseEntity<>(
                    "Variant ID cannot be null",
                    HttpStatusCode.valueOf(400)
            );
        }

        if (id <= 0) {
            return new ResponseEntity<>(
                    "Variant ID must be greater than 0",
                    HttpStatusCode.valueOf(400)
            );
        }

        // Everything is valid
        return null;
    }
}
