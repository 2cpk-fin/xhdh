package com.uniranking.app.domains.support;

import com.uniranking.app.domains.user.User;
import com.uniranking.app.domains.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportRepository supportRepository;
    private final SupportMapper supportMapper;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public SupportResponse createSupport(SupportRequest request, Authentication authentication) {
        User user = getUserByEmail(authentication.getName());

        Support support = supportMapper.toEntity(
                request,
                user.getDisplayUsername()
        );

        return supportMapper.toResponse(supportRepository.save(support));
    }

    public Slice<SupportResponse> getUserSupports(String email, int page, int size) {
        User user = getUserByEmail(email);

        Pageable pageable = PageRequest.of(page, Math.min(size, 20), Sort.by("createTime").descending());
        return supportRepository.findByUsername(user.getDisplayUsername(), pageable)
                .map(supportMapper::toResponse);
    }

    @Transactional
    public SupportResponse updateSupport(Long supportId, SupportRequest request, String email) {
        User user = getUserByEmail(email);

        Support support = supportRepository.findById(supportId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found"));

        if (!support.getUsername().equals(user.getDisplayUsername())) {
            throw new SecurityException("You do not have permission to update this support ticket.");
        }

        support.setContent(request.getContent());
        return supportMapper.toResponse(supportRepository.save(support));
    }

    @Transactional
    public void deleteSupport(Long supportId, String email) {
        User user = getUserByEmail(email);

        Support support = supportRepository.findById(supportId)
                .orElseThrow(() -> new RuntimeException("Support ticket not found"));

        if (!support.getUsername().equals(user.getDisplayUsername())) {
            throw new SecurityException("You do not have permission to delete this support ticket.");
        }

        supportRepository.delete(support);
    }

    public Page<SupportResponse> getAllSupportsAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 30), Sort.by("createTime").descending());
        return supportRepository.findAll(pageable)
                .map(supportMapper::toResponse);
    }
}