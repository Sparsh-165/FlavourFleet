package com.example.restrauntproject;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.example.restrauntproject.service.UserService;
import com.example.restrauntproject.dto.UserResponseDTO;
import org.springframework.http.ResponseEntity;

@SpringBootTest
class RestrauntprojectApplicationTests {

	@Autowired
	private UserService userService;

	@Test
	void contextLoads() {
	}

	@Test
	void testLoginAlex() {
		ResponseEntity<UserResponseDTO> response = userService.loginUser("alex@flavourfleet.com", "9876543210");
		System.out.println("TEST_LOGIN_ALEX: status=" + response.getStatusCode() + ", body=" + response.getBody());
	}

	@Test
	void testLoginDev() {
		ResponseEntity<UserResponseDTO> response = userService.loginUser("dev@flavourfleet.com", "1234567890");
		System.out.println("TEST_LOGIN_DEV: status=" + response.getStatusCode() + ", body=" + response.getBody());
	}
}
