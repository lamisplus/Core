package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import org.lamisplus.modules.base.domain.entities.BlacklistedToken;
import org.lamisplus.modules.base.domain.repositories.BlacklistedTokenRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlacklistService {

    private final BlacklistedTokenRepository blackListedTokenRepository;

    public BlacklistedToken blacklistToken(String token) {

        BlacklistedToken blackListedToken = new BlacklistedToken();
        blackListedToken.setToken(token);

        return blackListedTokenRepository.save(blackListedToken);
    }


    public boolean tokenExist(String token){
        return blackListedTokenRepository.existsByToken(token);
    }
}

