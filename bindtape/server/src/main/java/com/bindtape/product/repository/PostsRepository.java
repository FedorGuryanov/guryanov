package com.bindtape.product.repository;

import com.bindtape.product.model.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
@Repository
public interface PostsRepository extends JpaRepository<Post, Long> {
    List<Post> findByUsernameInOrderByIdDesc(List<String> usernames, Pageable pageable);

    List<Post> findByIdInAndUsernameNot(List<Long> ids, String username);

    List<Post> findByIdInOrderByIdDesc(List<Long> ids);

    List<Post> findByUsernameNotIn(List<String> username, Pageable pageable);

    List<Post> findByUsernameNotInAndRedGreaterThanAndRedLessThanAndGreenGreaterThanAndGreenLessThanAndBlueGreaterThanAndBlueLessThan(List<String> username, Float redBottom, Float redTop, Float greenBottom, Float greenTop, Float blueBottom, Float blueTop, Pageable pageable);
}
