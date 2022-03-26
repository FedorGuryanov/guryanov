package com.bindtape.product.repository;

import com.bindtape.product.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
@Repository
public interface SongsRepository extends JpaRepository<Song, Long> {
    Song findFirstBySongIdAndStoreId(String songId, String storeId);
}
