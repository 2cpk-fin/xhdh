package com.uniranking.app.domains.support;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportRepository extends JpaRepository<Support, Long> {

    Slice<Support> findByUsername(String username, Pageable pageable);

    Page<Support> findAll(Pageable pageable);

}
