package com.bindtape.product.model;

import javax.persistence.*;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "username", nullable = false, updatable = false)
    private String username;

    @Column(name = "picture_url")
    private String pictureUrl;

    @Column(name = "text")
    private String text;

    @Column(name = "likes_n")
    private Long likesN;

    @Column(name = "saves_n")
    private Long savesN;

    @Column(name = "post_time")
    private Long postTime;

    @Column(name = "original_playlist_id")
    private Long originalPlaylistId;

    @Column(name = "red")
    private Float red;

    @Column(name = "green")
    private Float green;

    @Column(name = "blue")
    private Float blue;

    @Column(name = "comments_n")
    private Long commentsN;

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getLikesN() {
        return likesN;
    }

    public void setLikesN(Long likesN) {
        this.likesN = likesN;
    }

    public Long getOriginalPlaylistId() {
        return originalPlaylistId;
    }

    public void setOriginalPlaylistId(Long originalPlaylistId) {
        this.originalPlaylistId = originalPlaylistId;
    }

    public Long getCommentsN() {
        return commentsN;
    }

    public void setCommentsN(Long commentsN) {
        this.commentsN = commentsN;
    }

    public Long getSavesN() {
        return savesN;
    }

    public void setSavesN(Long savesN) {
        this.savesN = savesN;
    }

    public Long getPostTime() {
        return postTime;
    }

    public void setPostTime(Long postTime) {
        this.postTime = postTime;
    }

    public Float getRed() {
        return red;
    }

    public void setRed(Float red) {
        this.red = red;
    }

    public Float getGreen() {
        return green;
    }

    public void setGreen(Float green) {
        this.green = green;
    }

    public Float getBlue() {
        return blue;
    }

    public void setBlue(Float blue) {
        this.blue = blue;
    }
}
