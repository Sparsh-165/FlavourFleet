package com.example.restrauntproject.exception;

public class NoSuchRestaurantException extends RuntimeException {

    public class NoSuchRestaurantExistException extends RuntimeException {
        public NoSuchRestaurantExistException(String msg) {
            super(msg);
        }
    }
}
