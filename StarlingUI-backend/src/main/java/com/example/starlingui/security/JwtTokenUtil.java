package com.example.starlingui.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenUtil {

    private final Algorithm algorithm;
    private final int accessAvailableTime;
    private final int refreshAvailableTime;

    public JwtTokenUtil() {
        algorithm = Algorithm.HMAC256("Starling".getBytes());
        accessAvailableTime = 15 * 60 * 1000;
        refreshAvailableTime = 30 * 60 * 1000;
    }

    public String generateAccessToken(UserDetails userDetails) {
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        List<String> authList = new ArrayList<>();
        for (GrantedAuthority authority : authorities) {
            authList.add(authority.getAuthority());
        }
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + accessAvailableTime))
                .withIssuer("Starling")
                .withClaim("roles", authList)
                .sign(algorithm);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshAvailableTime))
                .withIssuer("Starling").sign(algorithm);
    }

    /**
     * @Description check if an access token is valid
     * @param token Authorization value in the request header
     * @return UsernamePasswordAuthenticationToken
     */
    public Authentication verifyAccessToken(String token) throws Exception {
        DecodedJWT decodedJWT = decodeJwtToken(token);
        String username =decodedJWT.getSubject();
        String[] roles =  decodedJWT.getClaim("roles").asArray(String.class);
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        for (String role : roles) {
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }

    public String getUsernameFromToken(String token) throws Exception {
        DecodedJWT decodedJWT = decodeJwtToken(token);
        return decodedJWT.getSubject();
    }

    /**
     * @Description decode a jwt token
     * @param token jwt token to be decoded
     * @return decoded jwt token
     */
    private DecodedJWT decodeJwtToken(String token) throws Exception {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BadCredentialsException("Invalid Authorization Token!");
        }
        token = token.substring("Bearer ".length());
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public int getRefreshAvailableTime() {
        return refreshAvailableTime;
    }
}
