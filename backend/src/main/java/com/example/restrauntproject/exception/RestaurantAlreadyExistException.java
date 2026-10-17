package com.example.restrauntproject.exception;

public class RestaurantAlreadyExistException extends RuntimeException {
    public RestaurantAlreadyExistException(String msg) {
        super(msg);
    }
}
