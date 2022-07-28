package com.example.starlingui.controller;

import com.example.starlingui.model.StarlingUser;
import com.example.starlingui.security.JwtTokenUtil;
import com.example.starlingui.service.StarlingUserServiceImpl;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

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
            //authenticate user
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
            authenticationManager.authenticate(token);
            //generate tokens
            UserDetails userDetails = starlingUserService.loadUserByUsername(username);
            String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
            String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);
            //build response body
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
     * @Description New user registration logic
     * @param user User to be registered
     * @return 403 if user name is duplicated, 200 if success
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody StarlingUser user) {
        try {
            String password = user.getPassword();
            starlingUserService.save(user);
            JSONObject jsonObject = new JSONObject(user);
            jsonObject.put("password", password);
            return login(jsonObject.toString());
        } catch (DuplicateKeyException dke) {
            return new ResponseEntity<>(dke.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    /**
     * @Description Use valid refresh token to get new access token
     * @return new access token and old refresh token
     */
    @GetMapping("/refresh")
    public ResponseEntity<String> refresh(HttpServletRequest request) {
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
