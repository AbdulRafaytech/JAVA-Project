package com.flowboard.service;

import com.flowboard.dto.DashboardSummaryDto;

public interface DashboardService {
    DashboardSummaryDto getDashboardSummary(Long userId);
}
