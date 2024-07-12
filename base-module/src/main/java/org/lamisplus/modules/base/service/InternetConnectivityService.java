package org.lamisplus.modules.base.service;

import org.springframework.stereotype.Service;
import java.net.*;

@Service
public class InternetConnectivityService {

    public boolean isInternetAvailable() {
        try {
            URL url = new URL("https://www.google.com");
            URLConnection connection = url.openConnection();
            connection.connect();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
