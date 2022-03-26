package com.bindtape.product.model;

import javax.persistence.*;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
@Entity
@Table(name = "songs")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "store_id", updatable = false)
    private String storeId;

    @Column(name = "song_id", updatable = false)
    private String songId;

    @Column(name = "author")
    private String author;

    @Column(name = "name")
    private String name;

    @Column(name = "album")
    private String album;

    @Column(name = "year")
    private String year;

    public Long getId() {
        return id;
    }

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }

    public String getSongId() {
        return songId;
    }

    public void setSongId(String songId) {
        this.songId = songId;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
