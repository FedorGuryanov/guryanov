package com.bindtape.product.model;

import javax.persistence.*;

/**
 * @author fedorguryanov
 * @since 25.02.2018.
 */
@Entity
@Table(name = "playlistconnections")
public class PlaylistConnection {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "from_id", nullable = false, updatable = false)
    private Long fromId;

    @Column(name = "to_id", nullable = false, updatable = false)
    private Long toId;

    @Column(name = "from_store_id", nullable = false, updatable = false)
    private String fromStoreId;

    @Column(name = "to_store_id", nullable = false, updatable = false)
    private String toStoreId;

    public Long getId() {
        return id;
    }

    public Long getFromId() {
        return fromId;
    }

    public void setFromId(Long fromId) {
        this.fromId = fromId;
    }

    public Long getToId() {
        return toId;
    }

    public void setToId(Long toId) {
        this.toId = toId;
    }

    public String getFromStoreId() {
        return fromStoreId;
    }

    public void setFromStoreId(String fromStoreId) {
        this.fromStoreId = fromStoreId;
    }

    public String getToStoreId() {
        return toStoreId;
    }

    public void setToStoreId(String toStoreId) {
        this.toStoreId = toStoreId;
    }
}
