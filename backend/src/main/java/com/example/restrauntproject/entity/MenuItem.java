package com.example.restrauntproject.entity;


import com.example.restrauntproject.type.MenuItemType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

import java.util.List;

@Data
@Entity(name = "dish")
@AllArgsConstructor
@NoArgsConstructor
@SoftDelete
public class MenuItem extends BaseEntity {
    private String name;

    private String description;

    private MenuItemType menuItemType;

    private Double rating;

    private String label;


    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuItemVariant> menuItemVariantList;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    public Long getId() {
        return id;
    }
}
