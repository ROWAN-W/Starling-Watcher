package com.example.starlingui.controller;

import com.auth0.jwt.JWT;
import com.example.starlingui.model.StarlingUser;
import com.example.starlingui.security.JwtTokenUtil;
import com.example.starlingui.service.StarlingUserServiceImpl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController
@CrossOrigin
public class JwtAuthenticationController {

    @Autowired
    private StarlingUserServiceImpl starlingUserService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * @Description User login logic
     * @param body User name and password
     * @return User id, name, access token and refresh token
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String body) {
        try {
            JSONObject jsonObject = new JSONObject(body);
            String username = jsonObject.get("name").toString();
            StarlingUser user = starlingUserService.getUserByName(username);
            String password = jsonObject.get("password").toString();
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
            authenticationManager.authenticate(token);
            UserDetails userDetails = starlingUserService.loadUserByUsername(username);
            String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
            String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);
            jsonObject.put("id", user.getId());
            jsonObject.remove("password");
            jsonObject.put("accessToken", accessToken);
            jsonObject.put("refreshToken", refreshToken);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(jsonObject.toString());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * @Description Use valid refresh token to get new access token
     * @return new access token and old refresh token
     */
    @GetMapping("/refresh")
    public ResponseEntity<String> refresh(HttpServletRequest request, HttpServletResponse response) {
        try {
            String authorizationHeader = request.getHeader(AUTHORIZATION);
            String username = jwtTokenUtil.getUsernameFromToken(authorizationHeader);
            UserDetails userDetails = starlingUserService.loadUserByUsername(username);
            String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
            String refreshToken = authorizationHeader.substring("Bearer ".length());
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("accessToken", accessToken);
            jsonObject.put("refreshToken", refreshToken);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(jsonObject.toString());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}
