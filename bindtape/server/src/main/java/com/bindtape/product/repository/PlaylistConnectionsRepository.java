package com.bindtape.product.repository;

import com.bindtape.product.model.PlaylistConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author fedorguryanov
 * @since 25.02.2018.
 */
@Repository
public interface PlaylistConnectionsRepository extends JpaRepository<PlaylistConnection, Long> {
    PlaylistConnection findFirstByFromIdAndToStoreId(Long fromId, String toStoreId);
}
