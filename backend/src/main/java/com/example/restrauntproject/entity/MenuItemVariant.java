package com.example.restrauntproject.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

@Data
@Entity(name = "dish_variant")
@AllArgsConstructor
@NoArgsConstructor
@SoftDelete
public class MenuItemVariant extends BaseEntity{

    private String name;
    private Double price;
    private boolean available;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    private boolean inventoryManaged;

    private long currentAvailableInventoryCount;

    public Long getId() {
        return id;
    }
}
