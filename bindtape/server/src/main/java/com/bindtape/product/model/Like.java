package com.bindtape.product.model;

import javax.persistence.*;

/**
 * @author fedorguryanov
 * @since 04.04.2018.
 */
@Entity
@Table(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "username", nullable = false, updatable = false)
    private String username;

    @Column(name = "post_id", nullable = false, updatable = false)
    private Long postId;

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }
}
