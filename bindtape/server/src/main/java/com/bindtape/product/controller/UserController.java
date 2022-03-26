package com.bindtape.product.controller;

import com.bindtape.product.model.User;
import com.bindtape.product.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.provider.token.ConsumerTokenServices;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.security.Principal;

/**
 * @author fedorguryanov
 * @since 28.01.2018.
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource(name = "tokenServices")
    ConsumerTokenServices tokenServices;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public User getPeople(Principal principal) {
        String name = principal.getName();
        User user = userRepository.findOneByUsername(name);
        user.setPassword(null);
        return user;
    }

    @RequestMapping("/revoke")
    @ResponseBody
    public String revokeToken(@RequestParam(name = "access_token") String accessToken) {
        tokenServices.revokeToken(accessToken);
        return accessToken;
    }
}
