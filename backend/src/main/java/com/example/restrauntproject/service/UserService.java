package com.example.restrauntproject.service;


import com.example.restrauntproject.dto.RestaurantResponseDTO;
import com.example.restrauntproject.dto.UserRequestDTO;
import com.example.restrauntproject.dto.UserResponseDTO;
import com.example.restrauntproject.entity.Address;
import com.example.restrauntproject.entity.Restaurant;
import com.example.restrauntproject.entity.User;
import com.example.restrauntproject.exception.InvalidRequestException;
import com.example.restrauntproject.exception.NoSuchUserExistException;
import com.example.restrauntproject.repository.RestaurantRepository;
import com.example.restrauntproject.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantService restaurantService;


    @Transactional(readOnly = true)
    public ResponseEntity<UserResponseDTO> loginUser(String email, String phoneNumber) {
        if (StringUtils.isBlank(email) || StringUtils.isBlank(phoneNumber)) {
            return ResponseEntity.badRequest().body(null);
        }

        email = email.trim();
        phoneNumber = phoneNumber.trim();

        User user = userRepository.findByEmailAndPhoneNumber(email, phoneNumber);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        return ResponseEntity.ok(convertEntityToResponseDTO(user));
    }


    public ResponseEntity<UserResponseDTO> addUser(UserRequestDTO userRequestDTO) {

        if (!validateUserRequest(userRequestDTO)){
            return ResponseEntity.badRequest().body(new UserResponseDTO());
        };

        User user = new User();

        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPhoneNumber(userRequestDTO.getPhoneNumber());

        Address address = new Address();

        address.setStreetLine1(userRequestDTO.getStreetLine1());
        address.setStreetLine2(userRequestDTO.getStreetLine2());
        address.setCountry(userRequestDTO.getCountry());
        address.setPinCode(userRequestDTO.getPinCode());
        address.setLatitude(userRequestDTO.getLatitude());
        address.setLongitude(userRequestDTO.getLongitude());
        address.setLabel(userRequestDTO.getLabel());
        address.setDefaultAddress(userRequestDTO.isDefaultAddress());
        address.setUser(user);

        List<Address> addressList = new ArrayList<>();
        addressList.add(address);
        user.setAddressList(addressList);

        userRepository.save(user);

        return ResponseEntity.ok(convertEntityToResponseDTO(user));
    }

    private boolean validateUserRequest(UserRequestDTO userRequestDTO) {

        if (userRequestDTO == null) {
            return false;
        }

        // Validate name
        if (StringUtils.isBlank(userRequestDTO.getName())) {
            return false;
        }

        // Validate email
        if (StringUtils.isBlank(userRequestDTO.getEmail())) {
            return false;
        }

        if (!userRequestDTO.getEmail()
                .matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return false;
        }

        // Validate phone number
        if (StringUtils.isBlank(userRequestDTO.getPhoneNumber())) {
            return false;
        }

        if (!userRequestDTO.getPhoneNumber().matches("\\d{10}")) {
            return false;
        }

        // Validate address
        if (StringUtils.isBlank(userRequestDTO.getStreetLine1())) {
            return false;
        }

        if (StringUtils.isBlank(userRequestDTO.getCountry())) {
            return false;
        }

        if (StringUtils.isBlank(userRequestDTO.getPinCode())) {
            return false;
        }

        if (!userRequestDTO.getPinCode().matches("\\d{6}")) {
            return false;
        }

        if (userRequestDTO.getLatitude() == null ||
                userRequestDTO.getLongitude() == null) {
            return false;
        }

        return true;
    }

    private UserResponseDTO convertEntityToResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();

        userResponseDTO.setId(user.getId());
        userResponseDTO.setName(user.getName());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setPhoneNumber(user.getPhoneNumber());

        List<Address> addressList = user.getAddressList();

        if (addressList != null) {
            for (Address address : addressList) {

                userResponseDTO.setStreetLine1(address.getStreetLine1());
                userResponseDTO.setStreetLine2(address.getStreetLine2());
                userResponseDTO.setCountry(address.getCountry());
                userResponseDTO.setPinCode(address.getPinCode());
                userResponseDTO.setLatitude(address.getLatitude());
                userResponseDTO.setLongitude(address.getLongitude());
                userResponseDTO.setLabel(address.getLabel());
                userResponseDTO.setDefaultAddress(address.isDefaultAddress());

            }
        }

        return userResponseDTO;
    }


    public List<UserResponseDTO> findAll() {

        List<User> userList = userRepository.findAll();

        List<UserResponseDTO> userResponseDTOList = new ArrayList<>();

        for(User user : userList){
            userResponseDTOList.add(convertEntityToResponseDTO(user));
        }

        return userResponseDTOList;


    }


    public UserResponseDTO updateUser(UserRequestDTO userRequestDTO, Long id) {
        if(!validateUserRequest(userRequestDTO)){
            return new UserResponseDTO();
        }

        User user = userRepository.findById(id).orElse(null);

        if(user == null){
            throw new NoSuchUserExistException("User with id " + id + " does not exist");
        }

        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPhoneNumber(userRequestDTO.getPhoneNumber());

        List<Address> addressList = user.getAddressList();

        if(addressList != null && !addressList.isEmpty()){
            Address address = addressList.get(0);

            address.setStreetLine1(userRequestDTO.getStreetLine1());
            address.setStreetLine2(userRequestDTO.getStreetLine2());
            address.setCountry(userRequestDTO.getCountry());
            address.setPinCode(userRequestDTO.getPinCode());
            address.setLatitude(userRequestDTO.getLatitude());
            address.setLongitude(userRequestDTO.getLongitude());
            address.setLabel(userRequestDTO.getLabel());
            address.setDefaultAddress(userRequestDTO.isDefaultAddress());
        }

        userRepository.save(user);
        return convertEntityToResponseDTO(user);

    }


    public UserResponseDTO deleteUser(Long id){
        if(id == null || id <= 0){
            throw new InvalidRequestException("invalid id");
        }

        User user = userRepository.findById(id).orElse(null);

        if(user == null){
            throw new NoSuchUserExistException("No User of "+id+" exists");
        }

        userRepository.deleteById(id);
        return convertEntityToResponseDTO(user);
    }

    public List<RestaurantResponseDTO> getNearByRestaurant(Double lon, Double lat) {
        List<Restaurant> restaurants = restaurantRepository.findNearbyRestaurants(lon,lat);
        List<RestaurantResponseDTO> restaurantResponseDTOList = new ArrayList<>();

        for(Restaurant restaurant : restaurants){
            RestaurantResponseDTO restaurantResponseDTO = restaurantService.convertRestaurantToRestaurantResponseDTO(restaurant);
            restaurantResponseDTOList.add(restaurantResponseDTO);
        }

        return restaurantResponseDTOList;
    }


}
