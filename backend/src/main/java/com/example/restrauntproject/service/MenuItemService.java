package com.example.restrauntproject.service;


import com.example.restrauntproject.dto.MenuItemRequestDTO;
import com.example.restrauntproject.dto.MenuItemResponseDTO;
import com.example.restrauntproject.dto.MenuItemVariantRequestDTO;
import com.example.restrauntproject.dto.MenuItemVariantResponseDTO;
import com.example.restrauntproject.entity.MenuItem;
import com.example.restrauntproject.entity.MenuItemVariant;
import com.example.restrauntproject.entity.Restaurant;
import com.example.restrauntproject.repository.MenuItemRepository;
import com.example.restrauntproject.repository.RestaurantRepository;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {


    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public ResponseEntity<String> addMenuItem(MenuItemRequestDTO menuItemRequestDTO) {

        ResponseEntity<String> validationResponse = validateMenuItem(menuItemRequestDTO);

        if (validationResponse != null) {
            return validationResponse;
        }

        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(menuItemRequestDTO.getRestaurantId());

        if (restaurantOptional.isEmpty()) {
            return new ResponseEntity<>("Restaurant id does not exist", HttpStatusCode.valueOf(400));
        }

        Restaurant restaurant = restaurantOptional.get();

        MenuItem menuItem = convertMenuItemRequestDTOToMenuItem(menuItemRequestDTO, restaurant);

        menuItemRepository.save(menuItem);

        return new ResponseEntity<>(
                "Menu Item Added",
                HttpStatusCode.valueOf(201)
        );
    }

    private ResponseEntity<String> validateMenuItem(MenuItemRequestDTO menuItemRequestDTO) {

        if (menuItemRequestDTO == null) {
            return new ResponseEntity<>("Menu item request cannot be null", HttpStatusCode.valueOf(400));
        }

        // Restaurant ID validation
        if (menuItemRequestDTO.getRestaurantId() == null) {
            return new ResponseEntity<>("Restaurant id cannot be null", HttpStatusCode.valueOf(400));
        }

        if (menuItemRequestDTO.getRestaurantId() <= 0) {
            return new ResponseEntity<>("Restaurant id must be greater than 0", HttpStatusCode.valueOf(400));
        }

        // Menu item name validation
        if (menuItemRequestDTO.getName() == null || menuItemRequestDTO.getName().trim().isEmpty()) {
            return new ResponseEntity<>("Menu item name cannot be empty", HttpStatusCode.valueOf(400));
        }

        // Description validation
        if (menuItemRequestDTO.getDescription() == null || menuItemRequestDTO.getDescription().trim().isEmpty()) {

            return new ResponseEntity<>("Description cannot be empty", HttpStatusCode.valueOf(400));
        }

        if (menuItemRequestDTO.getDescription().trim().length() > 1000) {
            return new ResponseEntity<>("Description cannot exceed 1000 characters", HttpStatusCode.valueOf(400));
        }

        // Menu item type validation
        if (menuItemRequestDTO.getMenuItemType() == null) {
            return new ResponseEntity<>("Menu item type cannot be null", HttpStatusCode.valueOf(400));
        }

        // Label validation
        if (menuItemRequestDTO.getLabel() != null && menuItemRequestDTO.getLabel().trim().length() > 50) {

            return new ResponseEntity<>("Label cannot exceed 50 characters", HttpStatusCode.valueOf(400));
        }

        // Variant validation
        if (menuItemRequestDTO.getMenuItemVariants() == null || menuItemRequestDTO.getMenuItemVariants().isEmpty()) {
            return new ResponseEntity<>("At least one menu item variant is required", HttpStatusCode.valueOf(400));
        }

        return null;
    }

    private MenuItem convertMenuItemRequestDTOToMenuItem(MenuItemRequestDTO menuItemRequestDTO,Restaurant restaurant){
        MenuItem menuItem = new MenuItem();

        menuItem.setName(menuItemRequestDTO.getName());
        menuItem.setLabel(menuItemRequestDTO.getLabel());
        menuItem.setDescription(menuItemRequestDTO.getDescription());
        menuItem.setMenuItemType(menuItemRequestDTO.getMenuItemType());
        menuItem.setRestaurant(restaurant);

        List<MenuItemVariant> menuItemVariantList = new ArrayList<>();

        List<MenuItemVariantRequestDTO> menuItemVariantRequestDTOS = menuItemRequestDTO.getMenuItemVariants();

        for(MenuItemVariantRequestDTO menuItemVariantRequestDTO : menuItemVariantRequestDTOS){
            //for each new addition in the menu item
            MenuItemVariant menuItemVariant = new MenuItemVariant();

            menuItemVariant.setName(menuItemVariantRequestDTO.getDishVariantName());
            menuItemVariant.setPrice(menuItemVariantRequestDTO.getPrice());
            menuItemVariant.setInventoryManaged(menuItemVariantRequestDTO.isInventoryManaged());
            menuItemVariant.setAvailable(menuItemVariantRequestDTO.isAvailable());
            menuItemVariant.setCurrentAvailableInventoryCount(menuItemVariantRequestDTO.getCurrentAvailableInventoryCount());
            menuItemVariant.setMenuItem(menuItem);
            menuItemVariantList.add(menuItemVariant);
        }

        menuItem.setMenuItemVariantList(menuItemVariantList);


        return menuItem;
    }

    public ResponseEntity<String> updateMenuItem(Long id, MenuItemRequestDTO menuItemRequestDTO) {

        if(id == null || id <= 0){
            return new ResponseEntity<>("ID Missing or invalid",HttpStatusCode.valueOf(400));
        }


        ResponseEntity<String> validation = validateMenuItemRequestDTO(menuItemRequestDTO);

        if(validation != null){
            return validation;
        }

        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(id);
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(menuItemRequestDTO.getRestaurantId());

        if(menuItemOptional.isEmpty()){
            return new ResponseEntity<>("Nothing of this ID ", HttpStatusCode.valueOf(400));
        }

        if(restaurantOptional.isEmpty()){
            return new ResponseEntity<>("No Restaurant for this ID", HttpStatusCode.valueOf(400));
        }

        Restaurant restaurant = restaurantOptional.get();
        MenuItem menuItem = menuItemOptional.get();

        menuItem.setName(menuItemRequestDTO.getName());
        menuItem.setDescription(menuItemRequestDTO.getDescription());
        menuItem.setLabel(menuItemRequestDTO.getLabel());
        menuItem.setMenuItemType(menuItemRequestDTO.getMenuItemType());
        menuItem.setRestaurant(restaurant);

        List<MenuItemVariant> updatedMenuItemVariant = new ArrayList<>();

        for(MenuItemVariantRequestDTO variantRequestDTO: menuItemRequestDTO.getMenuItemVariants()){
            MenuItemVariant variant = new MenuItemVariant();

            variant.setName(variantRequestDTO.getDishVariantName());
            variant.setAvailable(variantRequestDTO.isAvailable());
            variant.setPrice(variantRequestDTO.getPrice());
            variant.setInventoryManaged(variantRequestDTO.isInventoryManaged());
            variant.setCurrentAvailableInventoryCount(variantRequestDTO.getCurrentAvailableInventoryCount());
            variant.setMenuItem(menuItem);
            updatedMenuItemVariant.add(variant);
        }
        menuItem.getMenuItemVariantList().clear();
        menuItem.getMenuItemVariantList().addAll(updatedMenuItemVariant);
        menuItemRepository.save(menuItem);



        return new ResponseEntity<>("Menu Item Updated", HttpStatusCode.valueOf(200));
    }

    private ResponseEntity<String> validateMenuItemRequestDTO(MenuItemRequestDTO menuItemRequestDTO) {

        // DTO validation
        if (menuItemRequestDTO == null) {
            return new ResponseEntity<>("Menu item request cannot be null", HttpStatusCode.valueOf(400));
        }

        // Name validation
        if (menuItemRequestDTO.getName() == null || menuItemRequestDTO.getName().trim().isEmpty()) {
            return new ResponseEntity<>("Menu item name cannot be empty", HttpStatusCode.valueOf(400));
        }

        if (menuItemRequestDTO.getName().trim().length() > 100) {
            return new ResponseEntity<>("Menu item name cannot exceed 100 characters", HttpStatusCode.valueOf(400));
        }

        // Description validation
        if (menuItemRequestDTO.getDescription() == null || menuItemRequestDTO.getDescription().trim().isEmpty()) {
            return new ResponseEntity<>("Description cannot be empty", HttpStatusCode.valueOf(400));
        }

        if (menuItemRequestDTO.getDescription().trim().length() > 1000) {
            return new ResponseEntity<>("Description cannot exceed 1000 characters", HttpStatusCode.valueOf(400));
        }

        // Menu item type validation
        if (menuItemRequestDTO.getMenuItemType() == null) {
            return new ResponseEntity<>("Menu item type cannot be null", HttpStatusCode.valueOf(400));
        }

        // Restaurant ID validation
        if (menuItemRequestDTO.getRestaurantId() == null) {
            return new ResponseEntity<>("Restaurant ID cannot be null", HttpStatusCode.valueOf(400));
        }

        if (menuItemRequestDTO.getRestaurantId() <= 0) {
            return new ResponseEntity<>("Restaurant ID must be greater than 0", HttpStatusCode.valueOf(400));
        }

        // Label validation
        if (menuItemRequestDTO.getLabel() != null && menuItemRequestDTO.getLabel().trim().length() > 50) {

            return new ResponseEntity<>("Label cannot exceed 50 characters", HttpStatusCode.valueOf(400));
        }

        // Menu item variants validation
        if (menuItemRequestDTO.getMenuItemVariants() == null || menuItemRequestDTO.getMenuItemVariants().isEmpty()) {

            return new ResponseEntity<>("At least one menu item variant is required", HttpStatusCode.valueOf(400)
            );
        }

        // Validate each variant
        for (MenuItemVariantRequestDTO variant : menuItemRequestDTO.getMenuItemVariants()) {

            if (variant == null) {
                return new ResponseEntity<>("Menu item variant cannot be null", HttpStatusCode.valueOf(400));
            }

            // Variant name
            if (variant.getDishVariantName() == null || variant.getDishVariantName().trim().isEmpty()) {

                return new ResponseEntity<>("Dish variant name cannot be empty", HttpStatusCode.valueOf(400));
            }

            if (variant.getDishVariantName().trim().length() > 100) {
                return new ResponseEntity<>(
                        "Dish variant name cannot exceed 100 characters",
                        HttpStatusCode.valueOf(400)
                );
            }

            // Price
            if (variant.getPrice() == null) {
                return new ResponseEntity<>(
                        "Price cannot be null",
                        HttpStatusCode.valueOf(400)
                );
            }

            if (variant.getPrice() < 0) {
                return new ResponseEntity<>(
                        "Price cannot be negative",
                        HttpStatusCode.valueOf(400)
                );
            }

            // Inventory
            if (variant.getCurrentAvailableInventoryCount() < 0) {
                return new ResponseEntity<>(
                        "Inventory count cannot be negative",
                        HttpStatusCode.valueOf(400)
                );
            }

            // Inventory logic
            if (!variant.isInventoryManaged() &&
                    variant.getCurrentAvailableInventoryCount() != 0) {

                return new ResponseEntity<>(
                        "Inventory count must be 0 when inventory management is disabled",
                        HttpStatusCode.valueOf(400)
                );
            }
        }

        return null;
    }


    public ResponseEntity<String> deleteMenuItem(Long id) {
        ResponseEntity<String> validation =  validateDeleteMenuItem(id);

        if (validation != null) {
            return validation;
        }


        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(id);

        if (menuItemOptional.isEmpty()) {
            return new ResponseEntity<>("Menu Item does not exist",HttpStatusCode.valueOf(404));
        }

        menuItemRepository.deleteById(menuItemOptional.get().getId());

        return new ResponseEntity<>(
                "Menu Item deleted successfully",
                HttpStatusCode.valueOf(200)
        );
    }


    private ResponseEntity<String> validateDeleteMenuItem(Long id) {

        if (id == null) {
            return new ResponseEntity<>(
                    "ID cannot be null",
                    HttpStatusCode.valueOf(400)
            );
        }

        if (id <= 0) {
            return new ResponseEntity<>(
                    "ID must be greater than 0",
                    HttpStatusCode.valueOf(400)
            );
        }

        return null;
    }

    public MenuItemResponseDTO getAllDetails(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id).orElse(null);

        if(menuItem == null){
            return null;
        }

        return convertMenuItemToMenuItemResponseDTO(menuItem);

    }

    private MenuItemResponseDTO convertMenuItemToMenuItemResponseDTO(MenuItem menuItem) {

        MenuItemResponseDTO menuItemResponseDTO = new MenuItemResponseDTO();

        // getting MenuItem details
        menuItemResponseDTO.setId(menuItem.getId());
        menuItemResponseDTO.setName(menuItem.getName());
        menuItemResponseDTO.setDescription(menuItem.getDescription());
        menuItemResponseDTO.setMenuItemType(menuItem.getMenuItemType());
        menuItemResponseDTO.setLabel(menuItem.getLabel());

        // getting MenuItem Variants
        List<MenuItemVariantResponseDTO> variantResponseDTOList =new ArrayList<>();

        for (MenuItemVariant variant :menuItem.getMenuItemVariantList()) {

            MenuItemVariantResponseDTO variantResponseDTO =new MenuItemVariantResponseDTO();

            variantResponseDTO.setId(variant.getId());
            variantResponseDTO.setDishVariantName(variant.getName());
            variantResponseDTO.setAvailable(variant.isAvailable());
            variantResponseDTO.setPrice(variant.getPrice());
            variantResponseDTO.setInventoryManaged(variant.isInventoryManaged());
            variantResponseDTO.setCurrentAvailableInventoryCount(variant.getCurrentAvailableInventoryCount());

            variantResponseDTOList.add(variantResponseDTO);
        }

        menuItemResponseDTO.setMenuItemVariants(variantResponseDTOList);

        return menuItemResponseDTO;
    }

}
