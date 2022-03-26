package com.bindtape.product.repository;

import com.bindtape.product.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author fedorguryanov
 * @since 31.03.2018.
 */
@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    UserInfo findOneByUsername(String username);

    List<UserInfo> findByUsernameStartingWithIgnoreCase(String username);
}
