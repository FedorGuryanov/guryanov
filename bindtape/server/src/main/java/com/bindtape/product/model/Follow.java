package com.bindtape.product.model;

import javax.persistence.*;

/**
 * @author fedorguryanov
 * @since 31.03.2018.
 */
@Entity
@Table(name = "follows")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "follower_name", nullable = false, updatable = false)
    private String followerName;

    @Column(name = "followed_name", nullable = false, updatable = false)
    private String followedName;

    public Long getId() {
        return id;
    }

    public String getFollowerName() {
        return followerName;
    }

    public void setFollowerName(String followerName) {
        this.followerName = followerName;
    }

    public String getFollowedName() {
        return followedName;
    }

    public void setFollowedName(String followedName) {
        this.followedName = followedName;
    }

}
