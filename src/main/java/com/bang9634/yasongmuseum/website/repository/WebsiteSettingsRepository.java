package com.bang9634.yasongmuseum.website.repository;

import com.bang9634.yasongmuseum.website.entity.WebsiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebsiteSettingsRepository extends JpaRepository<WebsiteSettings, Long> {

    Optional<WebsiteSettings> findBySettingKey(String settingKey);
}
