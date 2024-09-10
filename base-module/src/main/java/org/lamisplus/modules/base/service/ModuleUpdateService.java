package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.entities.Module;
import org.lamisplus.modules.base.domain.repositories.ModuleRepository;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@EnableScheduling
public class ModuleUpdateService {
    private static final boolean ACTIVE = true;
    private static final String TAG_NAME = "tag_name";
    private static final String ASSETS = "assets";
    private static final String BROWSER_DOWNLOAD_URL = "browser_download_url";
    private static final String DOT_JAR = ".jar";
    private final ModuleRepository moduleRepository;
    private final InternetConnectivityService internetConnectivityService;

    /**
     * Checking for module updates
     */
//    @Scheduled(fixedRate = 10800000) //10800000 milliseconds = 3 hours
    public void checkForUpdates() {
        if (internetConnectivityService.isInternetAvailable()){
            LOG.info("checking for updates...");
            moduleRepository.findAllByActiveAndGitHubLinkIsNotNull()
                    .forEach(this::checkUpdates);
//                .collect(Collectors.toList());
        } else {
            LOG.info("Could not check for updates. No internet connection.");
        }
    }

    /**
     * Checks updates
     * @param module
     * @return Module
     */
    private void checkUpdates(Module module){
        ResponseEntity<String> responseEntity;
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String apiUrl = module.getGitHubLink();
        LOG.info("github url {}", apiUrl);
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        try {
            responseEntity = restTemplate.exchange(apiUrl, HttpMethod.GET, requestEntity, String.class);
            if (responseEntity.getStatusCode() == HttpStatus.OK) {

                try {
                    JSONObject json = new JSONObject(responseEntity.getBody());
                    String latestVersion = json.getString(TAG_NAME);
                    LOG.info("latestVersion is {}", latestVersion);
                    module.setLatestVersion(latestVersion);
                    JSONArray js = new JSONArray(json.getString(ASSETS));

                    for (int i = 0; i < js.length(); i++) {
                        JSONObject downloadUrl = js.getJSONObject(i);
                        String downloadLink = downloadUrl.getString(BROWSER_DOWNLOAD_URL);
                        LOG.info("downloadLink is {}", downloadLink);
                        if (downloadLink.contains(DOT_JAR)) {
                            module.setDownloadUrl(downloadLink);
                            module.setLastSuccessfulUpdateCheck(LocalDateTime.now());
                            break;
                        }
                    }
                } catch (JSONException e) {
//                    e.printStackTrace();
                    throw new RuntimeException(e);
                }

            }
            moduleRepository.save(module);
        } catch (Exception e) {
            LOG.warn("There was an error checking for updates");
//            throw new RuntimeException("Could not check for updates");
        }
    }
}
