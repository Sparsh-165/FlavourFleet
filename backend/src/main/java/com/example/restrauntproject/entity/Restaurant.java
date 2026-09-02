package com.example.restrauntproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SoftDelete;

import java.util.List;





@Getter
@Setter
@Entity(name = "restaurant")
@AllArgsConstructor
@NoArgsConstructor
@SoftDelete

public class Restaurant extends BaseEntity {
    private String name;
    private String phone;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<MenuItem> menuItemList;

    public Long getId() {
        return id;
    }
}
