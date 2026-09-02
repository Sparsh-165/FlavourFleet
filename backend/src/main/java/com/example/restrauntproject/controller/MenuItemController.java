package com.example.restrauntproject.controller;


import com.example.restrauntproject.dto.MenuItemRequestDTO;
import com.example.restrauntproject.dto.MenuItemResponseDTO;
import com.example.restrauntproject.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/menuItem")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @PostMapping
    public ResponseEntity<String> addMenuItem(@RequestBody MenuItemRequestDTO menuItemRequestDTO){
        return menuItemService.addMenuItem(menuItemRequestDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editMenuItem(@PathVariable Long id, @RequestBody MenuItemRequestDTO menuItemRequestDTO){
        return menuItemService.updateMenuItem(id, menuItemRequestDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id){
        return menuItemService.deleteMenuItem(id);
    }

    @GetMapping("/{id}")
    public MenuItemResponseDTO getAllDetails(@PathVariable Long id){
        return menuItemService.getAllDetails(id);
    }
}
