package com.example.restrauntproject.controller;

import com.example.restrauntproject.dto.MenuItemVariantRequestDTO;
import com.example.restrauntproject.service.MenuItemVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/menuItemVariant")
public class MenuItemVariantController {

    @Autowired
    private MenuItemVariantService menuItemVariantService;

    @PutMapping("/{id}")
    public ResponseEntity<String> editMenuItemVariant(@PathVariable Long id, @RequestBody MenuItemVariantRequestDTO menuItemVariantRequestDTO){
        return menuItemVariantService.editDetails(id, menuItemVariantRequestDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItemVariant(@PathVariable Long id){
        return menuItemVariantService.getMenuItemVariant(id);
    }

}
