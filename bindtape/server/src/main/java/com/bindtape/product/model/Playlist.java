package com.bindtape.product.model;

import com.bindtape.product.model.types.LongArrayType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import javax.persistence.*;
import java.util.List;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
@Entity
@Table(name = "playlists")
@TypeDefs({
        @TypeDef(
                name = "long-array",
                typeClass = LongArrayType.class
        )
})
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "post_id", nullable = false, updatable = false)
    private Long postId;

    @Column(name = "store_id", nullable = false, updatable = false)
    private String storeId;

    @Column(name = "song_ids", columnDefinition = "bigint[]", nullable = false, updatable = false)
    @Type( type = "long-array" )
    private Long[] songIds;

    public Long getId() {
        return id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }


    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }

    public Long[] getSongIds() {
        return songIds;
    }

    public void setSongIds(Long[] songIds) {
        this.songIds = songIds;
    }
}
