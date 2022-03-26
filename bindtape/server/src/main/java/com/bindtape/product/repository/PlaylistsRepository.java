package com.bindtape.product.repository;

import com.bindtape.product.model.Playlist;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
@Repository
public interface PlaylistsRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByStoreIdOrderByIdDesc(String storeId, Pageable pageable);
}
