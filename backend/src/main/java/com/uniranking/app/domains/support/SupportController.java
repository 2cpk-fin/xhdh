package com.uniranking.app.domains.support;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    // --- USER ENDPOINTS ---

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SupportResponse> createSupport(
            @Valid @RequestBody SupportRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(supportService.createSupport(request, authentication));
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Slice<SupportResponse>> getMySupports(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(supportService.getUserSupports(authentication.getName(), page, 20));
    }

    @PutMapping("/update/{supportId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SupportResponse> updateSupport(
            @PathVariable Long supportId,
            @Valid @RequestBody SupportRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(supportService.updateSupport(supportId, request, authentication.getName()));
    }

    @DeleteMapping("/delete/{supportId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteSupport(
            @PathVariable Long supportId,
            Authentication authentication) {
        supportService.deleteSupport(supportId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<SupportResponse>> getAllSupports(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(supportService.getAllSupportsAdmin(page, 30));
    }
}