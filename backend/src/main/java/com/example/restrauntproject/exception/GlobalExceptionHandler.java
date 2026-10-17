package com.example.restrauntproject.exception;


import com.example.restrauntproject.dto.ErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(exception = InvalidRequestException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDTO handleInvalidRequestException(InvalidRequestException e){
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setMsg(e.getMessage());
        return errorDTO;
    }


    @ExceptionHandler(exception = RestaurantAlreadyExistException.class)
    @ResponseStatus(value = HttpStatus.CONFLICT)
    public ErrorDTO restaurantAlreadyExistException(RestaurantAlreadyExistException e){
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setMsg(e.getMessage());
        return errorDTO;
    }


    @ExceptionHandler(exception = NoSuchRestaurantException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDTO noSuchRestaurantExistException(NoSuchRestaurantException.NoSuchRestaurantExistException e){
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setMsg(e.getMessage());
        return errorDTO;
    }

    @ExceptionHandler(exception = NoSuchUserExistException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorDTO noSuchUserExistException(NoSuchUserExistException e){
        ErrorDTO errorDTO = new ErrorDTO();
        errorDTO.setMsg(e.getMessage());
        return errorDTO;
    }


}
