package com.bindtape.product.repository;

import com.bindtape.product.model.Like;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author fedorguryanov
 * @since 04.04.2018.
 */
@Repository
public interface LikesRepository extends JpaRepository<Like, Long> {
    List<Like> findByUsernameAndPostIdIn(String username, List<Long> postId);

    Like findFirstByUsernameAndPostId(String username, Long postId);

    List<Like> findByPostId(Long postId, Pageable pageable);

    List<Like> findByPostIdAndUsernameStartingWithIgnoreCase(Long postId, String search, Pageable pageable);
}
