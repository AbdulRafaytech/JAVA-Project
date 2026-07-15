package com.flowboard.controller;

import com.flowboard.dto.DashboardSummaryDto;
import com.flowboard.security.UserDetailsImpl;
import com.flowboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(userDetails.getId());
        return ResponseEntity.ok(summary);
    }
}
