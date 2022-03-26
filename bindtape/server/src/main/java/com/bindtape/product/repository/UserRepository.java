package com.bindtape.product.repository;

import com.bindtape.product.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author fedorguryanov
 * @since 28.01.2018.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findOneByUsername(String username);
}
