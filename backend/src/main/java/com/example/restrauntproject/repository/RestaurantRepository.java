package com.example.restrauntproject.repository;

import com.example.restrauntproject.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    Restaurant findByPhone(String phoneNumber);



    @Query(value = "  select r.* from restaurant r inner join address " +
            "a on r.id = a.id where ST_Distance_Sphere(POINT(a.longitude,a.latitude)," +
            "POINT(:lon,:lat))  < 5000 And deleted = 0;",
            nativeQuery = true)
    List<Restaurant> findNearbyRestaurants(Double lon, Double lat);
}
