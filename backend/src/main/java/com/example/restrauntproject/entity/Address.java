package com.example.restrauntproject.entity;
import com.example.restrauntproject.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SoftDelete
@Entity(name = "address")
public class Address extends BaseEntity{
    private String streetLine1;
    private String streetLine2;
    private String country;
    private String pinCode;

    private Double latitude;
    private Double longitude;

    private String label;
    private boolean defaultAddress;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
