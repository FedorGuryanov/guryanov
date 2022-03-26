package com.bindtape.product.controller;

/**
 * @author fedorguryanov
 * @since 03.02.2018.
 */

import com.bindtape.product.model.Follow;
import com.bindtape.product.model.User;
import com.bindtape.product.model.UserInfo;
import com.bindtape.product.repository.FollowRepository;
import com.bindtape.product.repository.UserInfoRepository;
import com.bindtape.product.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.search.IntegerComparisonTerm;
import javax.servlet.http.HttpServletRequest;

@RestController
@EnableTransactionManagement
@RequestMapping("/register")
public class RegistrationController {
    private static String OFFICIAL_NAME = "bindtape";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public JavaMailSender emailSender;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    @Qualifier("userDetailsService")
    private UserDetailsService userDetailsService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> addPeople(HttpServletRequest request) {
        String password = request.getParameter("password");
        String username = request.getParameter("username");
        String email = request.getParameter("email");

        User user = userRepository.findOneByUsername(username);
        if (username == null || password == null || email == null) {
            return new ResponseEntity<>("Null Data", HttpStatus.BAD_REQUEST);
        }
        if (user == null) {
            MimeMessage message = emailSender.createMimeMessage();
            try {
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setTo(email);
                helper.setSubject("Welcome to Bindtape");
                helper.setText("<html><body style='color: black; margin: 0; font-family: Helvetica Neue, Helvetica;'><div style='height: 70px; width: 100%; background: #F3918C; color: white; text-align: center; padding-top: 20px; font-size: 30pt;'><b>Hi, " +
                        username + "!</b></div><div style='color: black; margin: 10px;'><b>Welcome to Bindtape!</b><br><br>Check out <a href='https://www.bindtape.com'>www.bindtape.com</a> for additional information. If you have any questions, please feel free to contact us by <a href='mailto:info@bindtape.com'>info@bindtape.com</a>.<br><br>We are glad to see you on board!<br><br>Best regards,<br>Bindtape team</div></body></html>", true);
                emailSender.send(message);
            } catch (MessagingException e) {
                e.printStackTrace();
            }

            UserInfo userInfo = new UserInfo();
            userInfo.setUsername(username);
            userInfo.setDescription("");
            userInfo.setFollowersN(0L);
            userInfo.setFollowingN(0L);
            userInfoRepository.save(userInfo);
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(bCryptPasswordEncoder.encode(password));
            newUser.setEmail(email);
            newUser.setEnabled(true);
            newUser.setModerator(false);
            newUser.setSecure(false);
            userRepository.saveAndFlush(newUser);
            UserInfo official = userInfoRepository.findOneByUsername(OFFICIAL_NAME);
            if (official != null) {
                Follow follow = followRepository.findFirstByFollowerNameAndFollowedName(username, OFFICIAL_NAME);
                if (follow == null) {
                    follow = new Follow();
                    follow.setFollowerName(username);
                    follow.setFollowedName(OFFICIAL_NAME);
                    official.setFollowersN(official.getFollowersN() + 1);
                    userInfoRepository.save(official);
                    userInfo.setFollowingN(userInfo.getFollowingN() + 1);
                    userInfoRepository.save(userInfo);
                    followRepository.saveAndFlush(follow);
                }
            }
            userInfoRepository.flush();
            return new ResponseEntity<>("User Created", HttpStatus.OK);
        } else {
            //If the id doesn't exist.
            return new ResponseEntity<>("Existing Username", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @RequestMapping(value = "/mailRecover", method = RequestMethod.POST)
    public ResponseEntity<String> recoverPassMail(HttpServletRequest request) {
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        User user = userRepository.findOneByUsername(username);
        if (user != null && user.getEmail().equals(email)) {
            MimeMessage message = emailSender.createMimeMessage();
            try {
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setTo(email);
                helper.setSubject("Bindtape Password Recovery");
                String code = getCode(username, user.getPassword());
                helper.setText("<html><body style='color: black; margin: 0; font-family: Helvetica Neue, Helvetica;'><div style='height: 70px; width: 100%; background: #68C0EC; color: white; text-align: center; padding-top: 20px; font-size: 30pt;'><b>Hi, " +
                        username + "!</b></div><div style='color: black; margin: 10px;'> Your password recovery code is: <b>" + code + "</b></div></body></html>", true);
                emailSender.send(message);
            } catch (MessagingException e) {
                e.printStackTrace();
                return new ResponseEntity<>("Email Error", HttpStatus.NOT_ACCEPTABLE);
            }
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No Username", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @RequestMapping(value = "/recover", method = RequestMethod.POST)
    public ResponseEntity<String> recoverPass(HttpServletRequest request) {
        String password = request.getParameter("password");
        String username = request.getParameter("username");
        String code = request.getParameter("code");
        User user = userRepository.findOneByUsername(username);
        if (user != null) {
            if (code.equals(getCode(username, user.getPassword()))) {
                user.setPassword(bCryptPasswordEncoder.encode(password));
                userRepository.saveAndFlush(user);
                return new ResponseEntity<>("OK", HttpStatus.OK);
            } else {
                user.setPassword(bCryptPasswordEncoder.encode(getRandomPass(username, user.getPassword())));
                userRepository.saveAndFlush(user);
                return new ResponseEntity<>("Wrong Code", HttpStatus.NOT_ACCEPTABLE);
            }
        } else {
            return new ResponseEntity<>("No Username", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    private String getCode(String username, String password) {
        StringBuilder sb = new StringBuilder();
        sb.append(Integer.toString(username.charAt(0) % 10));
        int length = password.length();
        if (length > 10) sb.append(Integer.toString(password.charAt(10) % 10));
        if (length > 17) sb.append(Integer.toString(password.charAt(17) % 10));
        if (length > 13) sb.append(Integer.toString(password.charAt(13) % 10));
        if (length > 7) sb.append(Integer.toString(password.charAt(7) % 10));
        if (length > 2) sb.append(Integer.toString(password.charAt(2) % 10));
        if (length > 4) sb.append(Integer.toString(password.charAt(4) % 10));
        return sb.toString();
    }

    private String getRandomPass(String username, String password) {
        StringBuilder sb = new StringBuilder();
        int length = password.length();
        if (length > 10) sb.append(Integer.toString(password.charAt(10) % 10));
        if (length > 17) sb.append(Integer.toString(password.charAt(17) % 10));
        if (length > 13) sb.append(Integer.toString(password.charAt(13) % 10));
        if (length > 7) sb.append(password.charAt(7));
        sb.append(Integer.toString(username.charAt(0)));
        if (length > 2) sb.append(password.charAt(2));
        if (length > 4) sb.append(Integer.toString(password.charAt(4) % 10));
        return sb.toString();
    }
}
