package com.bang9634.yasongmuseum.souvenir.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bang9634.yasongmuseum.souvenir.entity.Souvenir;

@Repository
public interface SouvenirRepository extends JpaRepository<Souvenir, Long> {
    
    List<Souvenir> findAllByOrderByCreatedAtDesc();
}
