package com.bindtape.product.repository;

import com.bindtape.product.model.Save;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author fedorguryanov
 * @since 24.04.2018.
 */
@Repository
public interface SavesRepository extends JpaRepository<Save, Long> {
    List<Save> findByUsernameAndPostIdIn(String username, List<Long> postId);

    List<Save> findByUsernameOrderByIdDesc(String username, Pageable pageable);

    Save findFirstByUsernameAndPostId(String username, Long postId);
}
