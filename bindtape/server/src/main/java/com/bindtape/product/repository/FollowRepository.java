package com.bindtape.product.repository;

import com.bindtape.product.model.Follow;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author fedorguryanov
 * @since 31.03.2018.
 */
@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByFollowerName(String username);

    List<Follow> findByFollowedName(String username);

    List<Follow> findByFollowerName(String username, Pageable pageable);

    List<Follow> findByFollowerNameAndFollowedNameStartingWithIgnoreCase(String username, String search, Pageable pageable);

    List<Follow> findByFollowedName(String username, Pageable pageable);

    List<Follow> findByFollowedNameAndFollowerNameStartingWithIgnoreCase(String username, String search, Pageable pageable);

    Follow findFirstByFollowerNameAndFollowedName(String followerName, String followedName);
}
