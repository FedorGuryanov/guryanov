package com.bindtape.product.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author fedorguryanov
 * @since 31.03.2018.
 */
@Entity
@Table(name = "usersdetails")
public class UserInfo {
    @Id
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "description")
    private String description;

    @Column(name = "followers_n")
    private Long followersN;

    @Column(name = "following_n")
    private Long followingN;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getFollowersN() {
        return followersN;
    }

    public void setFollowersN(Long followersN) {
        this.followersN = followersN;
    }

    public Long getFollowingN() {
        return followingN;
    }

    public void setFollowingN(Long followingN) {
        this.followingN = followingN;
    }
}
