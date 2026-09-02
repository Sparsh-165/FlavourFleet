package com.example.restrauntproject.repository;



import com.example.restrauntproject.entity.MenuItemVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MenuItemVariantRepository extends JpaRepository<MenuItemVariant, Long> {


}
