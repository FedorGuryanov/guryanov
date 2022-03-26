package com.bindtape.product.controller;

import com.bindtape.product.model.Follow;
import com.bindtape.product.model.User;
import com.bindtape.product.model.UserInfo;
import com.bindtape.product.repository.FollowRepository;
import com.bindtape.product.repository.UserInfoRepository;
import com.bindtape.product.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * @author fedorguryanov
 * @since 31.03.2018.
 */
@RestController
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "/search/{username}", method = RequestMethod.GET)
    @ResponseBody
    public List<UserInfo> searchPeople(@PathVariable String username) {
        if (username != null && username.length() > 0) {
            return userInfoRepository.findByUsernameStartingWithIgnoreCase(username);
        } else {
            return Collections.emptyList();
        }
    }

    @RequestMapping(value = "/details/{username}", method = RequestMethod.GET)
    @ResponseBody
    public UserInfo getPeople(@PathVariable String username) {
        return getDetails(username);
    }

    private UserInfo getDetails(String username) {
        UserInfo user = userInfoRepository.findOneByUsername(username);
        if (user == null) {
            User loginInfo = userRepository.findOneByUsername(username);
            if (loginInfo != null) {
                List<Follow> following = followRepository.findByFollowerName(username);
                Long followingN = following == null ? 0L : following.size();
                List<Follow> followers = followRepository.findByFollowedName(username);
                Long followersN = followers == null ? 0L : followers.size();
                user = new UserInfo();
                user.setUsername(username);
                user.setDescription(username + "'s Bindtape account");
                user.setFollowersN(followersN);
                user.setFollowingN(followingN);
                userInfoRepository.saveAndFlush(user);
            }
        }
        return user;
    }

    @RequestMapping(value = "/followers/{username}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<UserInfo>> getFollowers(@PathVariable String username, HttpServletRequest request) {
        try {
            List<Follow> follows = followRepository.findByFollowedName(username, new PageRequest(0, 100, Sort.Direction.DESC, "id"));
            List<UserInfo> users = new ArrayList<>();
            if (follows != null) {
                follows.forEach(follow -> {
                    UserInfo info = new UserInfo();
                    info.setUsername(follow.getFollowerName());
                    users.add(info);
                });
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/followers/{username}/search/{search}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<UserInfo>> getSearchFollowers(@PathVariable String username, @PathVariable String search, HttpServletRequest request) {
        try {
            List<Follow> follows = followRepository.findByFollowedNameAndFollowerNameStartingWithIgnoreCase(username, search, new PageRequest(0, 100, Sort.Direction.DESC, "id"));
            List<UserInfo> users = new ArrayList<>();
            if (follows != null) {
                follows.forEach(follow -> {
                    UserInfo info = new UserInfo();
                    info.setUsername(follow.getFollowerName());
                    users.add(info);
                });
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/followings/{username}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<UserInfo>> getFollowings(@PathVariable String username, HttpServletRequest request) {
        try {
            List<Follow> follows = followRepository.findByFollowerName(username, new PageRequest(0, 100, Sort.Direction.DESC, "id"));
            List<UserInfo> users = new ArrayList<>();
            if (follows != null) {
                follows.forEach(follow -> {
                    UserInfo info = new UserInfo();
                    info.setUsername(follow.getFollowedName());
                    users.add(info);
                });
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/followings/{username}/search/{search}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<UserInfo>> getSearchFollowings(@PathVariable String username, @PathVariable String search, HttpServletRequest request) {
        try {
            List<Follow> follows = followRepository.findByFollowerNameAndFollowedNameStartingWithIgnoreCase(username, search, new PageRequest(0, 100, Sort.Direction.DESC, "id"));
            List<UserInfo> users = new ArrayList<>();
            if (follows != null) {
                follows.forEach(follow -> {
                    UserInfo info = new UserInfo();
                    info.setUsername(follow.getFollowedName());
                    users.add(info);
                });
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/follow/{username}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, String>> followUser(@PathVariable String username, Principal principal, HttpServletRequest request) {
        try {
            String name = principal.getName();

            Follow follow = followRepository.findFirstByFollowerNameAndFollowedName(name, username);
            if (follow == null) {
                UserInfo userToFollow = getDetails(username);
                UserInfo userFollowing = getDetails(name);
                follow = new Follow();
                follow.setFollowerName(name);
                follow.setFollowedName(username);
                userToFollow.setFollowersN(userToFollow.getFollowersN() + 1);
                userInfoRepository.save(userToFollow);
                userFollowing.setFollowingN(userFollowing.getFollowingN() + 1);
                userInfoRepository.save(userFollowing);
                userInfoRepository.flush();
                followRepository.saveAndFlush(follow);


            }
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/unfollow/{username}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, String>> unfollowUser(@PathVariable String username, Principal principal, HttpServletRequest request) {
        try {
            String name = principal.getName();
            Follow follow = followRepository.findFirstByFollowerNameAndFollowedName(name, username);
            if (follow != null) {
                UserInfo userToFollow = getDetails(username);
                UserInfo userFollowing = getDetails(name);
                userToFollow.setFollowersN(userToFollow.getFollowersN() - 1);
                userInfoRepository.save(userToFollow);
                userFollowing.setFollowingN(userFollowing.getFollowingN() - 1);
                userInfoRepository.save(userFollowing);
                userInfoRepository.flush();
                followRepository.delete(follow.getId());
                followRepository.flush();
            }
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/follow/{username}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Boolean>> isFollowUser(@PathVariable String username, Principal principal, HttpServletRequest request) {
        try {
            String name = principal.getName();
            Follow follow = followRepository.findFirstByFollowerNameAndFollowedName(name, username);
            return new ResponseEntity<>(Collections.singletonMap("follow", follow != null), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/description", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Map<String, String>> descriptionUpdate(Principal principal, HttpServletRequest request) {
        try {
            String name = principal.getName();
            UserInfo userInfo = userInfoRepository.findOneByUsername(name);
            String newDescription = request.getParameter("description");
            newDescription = newDescription == null ? "" : newDescription;
            userInfo.setDescription(newDescription);
            userInfoRepository.saveAndFlush(userInfo);
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/image", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> createPost(Principal principal, MultipartHttpServletRequest request) {
        String name = principal.getName();
        if (name != null) {
            MultiValueMap<String, MultipartFile> multiMap = request.getMultiFileMap();
            MultipartFile image = multiMap.getFirst("fileset");
            byte[] imageBytes;
            try {
                imageBytes = image.getBytes();
                int imageLength = imageBytes.length;
                if (imageLength > 100000) { //420110   226864   289581 max_value 1 000 000
                    return new ResponseEntity<>("Too big Image Size!", HttpStatus.NOT_ACCEPTABLE);
                }

                BufferedImage src = ImageIO.read(new ByteArrayInputStream(imageBytes));
                File destination = new File("users/user_" + name + ".jpg");
                ImageIO.write(src, "jpg", destination);
                return new ResponseEntity<>("Userpic Updated", HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Fail", HttpStatus.NOT_ACCEPTABLE);
            }
        } else {
            return new ResponseEntity<>("Not enough info", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @RequestMapping(value = "/image/{imageId}", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@PathVariable String imageId, HttpServletRequest request) {
        try {
            return new ResponseEntity<>(Files.readAllBytes(Paths.get("users/user_" + imageId + ".jpg")), HttpStatus.OK);
        } catch (IOException e) {
            //its ok
            return new ResponseEntity<>(new byte[0], HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
