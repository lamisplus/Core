package org.lamisplus.modules.base;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.service.ModuleUpdateService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@Slf4j
@AllArgsConstructor
public class OtherStartupRunners {
    private final ModuleUpdateService moduleUpdateService;

    @PostConstruct
    public void checkForUpdates() {
        LOG.info("Calling Module Update Service");
        moduleUpdateService.checkForUpdates();
    }
}
