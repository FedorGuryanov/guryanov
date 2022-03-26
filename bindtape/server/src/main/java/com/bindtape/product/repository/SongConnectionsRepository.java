package com.bindtape.product.repository;

import com.bindtape.product.model.SongConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author fedorguryanov
 * @since 25.03.2018.
 */
@Repository
public interface SongConnectionsRepository extends JpaRepository<SongConnection, Long> {
    SongConnection findFirstByFromIdAndToStoreId(Long fromId, String toStoreId);
}
