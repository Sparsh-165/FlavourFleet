package com.example.restrauntproject.repository;

import com.example.restrauntproject.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    Restaurant findByPhone(String phoneNumber);
}
