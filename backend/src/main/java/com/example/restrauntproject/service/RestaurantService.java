package com.example.restrauntproject.service;

import com.example.restrauntproject.dto.MenuItemResponseDTO;
import com.example.restrauntproject.dto.MenuItemVariantResponseDTO;
import com.example.restrauntproject.dto.RestaurantRequestDTO;
import com.example.restrauntproject.dto.RestaurantResponseDTO;
import com.example.restrauntproject.dto.RestaurantSummaryDTO;
import com.example.restrauntproject.entity.Address;
import com.example.restrauntproject.entity.MenuItem;
import com.example.restrauntproject.entity.MenuItemVariant;
import com.example.restrauntproject.entity.Restaurant;
import com.example.restrauntproject.repository.RestaurantRepository;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;


    public ResponseEntity<String> addRestaurant (RestaurantRequestDTO restaurantRequestDTO) {

        if (!validateRestaurant(restaurantRequestDTO)) {
            return new ResponseEntity<>("Validation failed. Check all required fields.", HttpStatusCode.valueOf(400));
        }

        Restaurant existingRestaurant =
                restaurantRepository.findByPhone(restaurantRequestDTO.getPhoneNumber());

        if (!ObjectUtils.isEmpty(existingRestaurant)) {
            return new ResponseEntity<>("A restaurant with this phone number already exists.", HttpStatusCode.valueOf(409));
        }

        Restaurant restaurant =
                convertRestaurantDTOEntity(restaurantRequestDTO);

        restaurantRepository.save(restaurant);

        return new ResponseEntity<>("Restaurant added successfully", HttpStatusCode.valueOf(201));
    }

    private boolean validateRestaurant(RestaurantRequestDTO restaurantRequestDTO) {

        // Check DTO itself
        if (ObjectUtils.isEmpty(restaurantRequestDTO)) {
            return false;
        }

        // Required fields
        if (ObjectUtils.isEmpty(restaurantRequestDTO.getName())) {
            return false;
        }

        if (ObjectUtils.isEmpty(restaurantRequestDTO.getCountry())) {
            return false;
        }

        if (ObjectUtils.isEmpty(restaurantRequestDTO.getPhoneNumber())) {
            return false;
        }

        if (ObjectUtils.isEmpty(restaurantRequestDTO.getStreetLine1())) {
            return false;
        }

        if (ObjectUtils.isEmpty(restaurantRequestDTO.getPinCode())) {
            return false;
        }

        if (ObjectUtils.isEmpty(restaurantRequestDTO.getLatitude())) {
            return false;
        }

        if (ObjectUtils.isEmpty(restaurantRequestDTO.getLongitude())) {
            return false;
        }

        // Phone number validation
        if (!restaurantRequestDTO.getPhoneNumber().matches("\\d{10}")) {
            return false;
        }

        // PIN code validation
        if (!restaurantRequestDTO.getPinCode().matches("^[1-9][0-9]{5}$")) {
            return false;
        }

        // Latitude validation
        if (restaurantRequestDTO.getLatitude() < -90 ||
                restaurantRequestDTO.getLatitude() > 90) {
            return false;
        }

        // Longitude validation
        if (restaurantRequestDTO.getLongitude() < -180 ||
                restaurantRequestDTO.getLongitude() > 180) {
            return false;
        }

        return true;
    }



    private Restaurant convertRestaurantDTOEntity(RestaurantRequestDTO restaurantRequestDTO){
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantRequestDTO.getName());
        restaurant.setPhone(restaurantRequestDTO.getPhoneNumber());

        Address address = new Address();

        address.setStreetLine1(restaurantRequestDTO.getStreetLine1());
        address.setStreetLine2(restaurantRequestDTO.getStreetLine2());
        address.setCountry(restaurantRequestDTO.getCountry());
        address.setPinCode(restaurantRequestDTO.getPinCode());
        address.setLatitude(restaurantRequestDTO.getLatitude());
        address.setLongitude(restaurantRequestDTO.getLongitude());
        restaurant.setAddress(address);

        return restaurant;
    }

    public RestaurantResponseDTO getRestaurant(Long id) {
        Restaurant restaurant =  restaurantRepository.findById(id).orElse(null);

        if(restaurant == null){
            return null;
        }
        return  convertRestaurantToRestaurantResponseDTO(restaurant);
    }


    public List<RestaurantSummaryDTO> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<RestaurantSummaryDTO> summaries = new ArrayList<>();

        for (Restaurant restaurant : restaurants) {
            RestaurantSummaryDTO summary = new RestaurantSummaryDTO();
            summary.setId(restaurant.getId());
            summary.setName(restaurant.getName());
            summary.setPhoneNumber(restaurant.getPhone());
            summary.setCountry(restaurant.getAddress() != null ? restaurant.getAddress().getCountry() : null);
            summary.setMenuItemCount(restaurant.getMenuItemList() != null ? restaurant.getMenuItemList().size() : 0);
            summaries.add(summary);
        }

        return summaries;
    }


    public RestaurantResponseDTO convertRestaurantToRestaurantResponseDTO(Restaurant restaurant) {
        RestaurantResponseDTO restaurantResponseDTO = new RestaurantResponseDTO();


        //Settings the parameters
        restaurantResponseDTO.setName(restaurant.getName());
        restaurantResponseDTO.setId(restaurant.getId());
        restaurantResponseDTO.setPhoneNumber(restaurant.getPhone());
        restaurantResponseDTO.setCountry(restaurant.getAddress().getCountry());
        restaurantResponseDTO.setStreetLine1(restaurant.getAddress().getStreetLine1());


        List<MenuItemResponseDTO> menuItemResponseDTOList = new ArrayList<>();
        List<MenuItem> menuItemList  = restaurant.getMenuItemList();

        for(MenuItem menuItem: menuItemList){
            //each object for each menu item list
            MenuItemResponseDTO menuItemResponseDTO = new MenuItemResponseDTO();


            menuItemResponseDTO.setId(menuItem.getId());
            menuItemResponseDTO.setName(menuItem.getName());
            menuItemResponseDTO.setDescription(menuItem.getDescription());
            menuItemResponseDTO.setLabel(menuItem.getLabel());
            menuItemResponseDTO.setMenuItemType(menuItem.getMenuItemType());

            List<MenuItemVariantResponseDTO> menuItemVariantResponseDTOS = new ArrayList<>();
            List<MenuItemVariant> menuItemVariantList = menuItem.getMenuItemVariantList();

            for(MenuItemVariant menuItemVariant: menuItemVariantList){

                //each object for each menu item variant
                MenuItemVariantResponseDTO menuItemVariantResponseDTO = new MenuItemVariantResponseDTO();

                menuItemVariantResponseDTO.setId(menuItemVariant.getId());
                menuItemVariantResponseDTO.setAvailable(menuItemVariant.isAvailable());
                menuItemVariantResponseDTO.setDishVariantName(menuItemVariant.getName());
                menuItemVariantResponseDTO.setPrice(menuItemVariant.getPrice());
                menuItemVariantResponseDTO.setInventoryManaged(menuItemVariant.isInventoryManaged());
                menuItemVariantResponseDTO.setCurrentAvailableInventoryCount(menuItemVariant.getCurrentAvailableInventoryCount());
                menuItemVariantResponseDTOS.add(menuItemVariantResponseDTO);

            }


            menuItemResponseDTO.setMenuItemVariants(menuItemVariantResponseDTOS);

            menuItemResponseDTOList.add(menuItemResponseDTO);
        }

        restaurantResponseDTO.setMenuItems(menuItemResponseDTOList);


        return restaurantResponseDTO;
    }
}
