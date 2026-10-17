package com.example.restrauntproject.exception;

public class NoSuchUserExistException extends RuntimeException{
    public NoSuchUserExistException(String msg) {
        super(msg);
    }
}
