package com.example.restrauntproject.controller;


import com.example.restrauntproject.dto.RestaurantResponseDTO;
import com.example.restrauntproject.dto.UserRequestDTO;
import com.example.restrauntproject.dto.UserResponseDTO;
import com.example.restrauntproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;


    //login user
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(@RequestBody Map<String, String> loginRequest){
        String email = loginRequest.get("email");
        String phoneNumber = loginRequest.get("phoneNumber");
        return userService.loginUser(email, phoneNumber);
    }

    //add user (register)
    @PostMapping
    public ResponseEntity<UserResponseDTO> addUser(@RequestBody UserRequestDTO userRequestDTO){
        return userService.addUser(userRequestDTO);
    }

    //find all user
    @GetMapping("/name")
    public List<UserResponseDTO> findAllUser(){
        return userService.findAll();
    }


    //Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.ok(userService.updateUser(userRequestDTO, id));
    }

    //Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponseDTO> deleteUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.deleteUser(id));
    }


    @GetMapping("/getNearbyRestaurants")
    public ResponseEntity<List<RestaurantResponseDTO>> getNearByRestaurant(@RequestParam Double lon, @RequestParam Double lat){
        return ResponseEntity.ok(userService.getNearByRestaurant(lon, lat));
    }

}
