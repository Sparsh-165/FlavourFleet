package com.example.restrauntproject.controller;


import com.example.restrauntproject.dto.RestaurantRequestDTO;
import com.example.restrauntproject.dto.RestaurantResponseDTO;
import com.example.restrauntproject.dto.RestaurantSummaryDTO;
import com.example.restrauntproject.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurant")
public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<String> addRestraunt(@RequestBody RestaurantRequestDTO restaurantRequestDTO){
        return restaurantService.addRestaurant(restaurantRequestDTO);
    }

    @GetMapping("/{id}")
    public RestaurantResponseDTO getRestaurant(@PathVariable Long id){
        return restaurantService.getRestaurant(id);
    }

    @GetMapping
    public List<RestaurantSummaryDTO> getAllRestaurants(){
        return restaurantService.getAllRestaurants();
    }
}
