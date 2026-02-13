package org.lamisplus.modules.base.configurer;

import org.ehcache.config.CacheConfiguration;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ExpiryPolicyBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.config.units.MemoryUnit;
import org.ehcache.core.config.DefaultConfiguration;
import org.ehcache.expiry.ExpiryPolicy;
import org.ehcache.jsr107.EhcacheCachingProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.Caching;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableCaching
public class CacheConfig {
    @Value("${cache.names:core,module,server_sync,user,role_permissions}")
    private List<String> cacheNames;

    @Value("${cache.heap.size:100}")
    private int heapSize;

    @Value("${cache.offheap.size:50}")
    private int offheapSize;

    @Value("${cache.offheap.unit:MB}")
    private String offheapUnit;

    @Value("${cache.expiry.ttl.minutes:1}")
    private int ttlMinutes;

    @Value("${cache.expiry.idle.minutes:1}")
    private int idleMinutes;

    @Bean
    public CacheManager jCacheCacheManager() {
        Map<String, CacheConfiguration<?, ?>> cacheMap = new HashMap<>();

        // Configure each cache from properties (both explicit configs and names list)
        cacheNames.forEach(cacheName -> {
            ResourcePoolsBuilder resourcePoolsBuilder = ResourcePoolsBuilder
                    .heap(heapSize)
                    .offheap(offheapSize, MemoryUnit.valueOf(offheapUnit));

            ExpiryPolicy<Object, Object> expiryPolicy = createExpiryPolicy(
                    Duration.ofMinutes(ttlMinutes),
                    Duration.ofMinutes(idleMinutes)
            );

            CacheConfiguration<Object, Object> cacheConfiguration = CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, resourcePoolsBuilder)
                    .withExpiry(expiryPolicy)
                    .build();

            cacheMap.put(cacheName.trim(), cacheConfiguration);
        });

        EhcacheCachingProvider ehcacheCachingProvider =
                (EhcacheCachingProvider) Caching.getCachingProvider(EhcacheCachingProvider.class.getName());

        DefaultConfiguration defaultConfiguration =
                new DefaultConfiguration(cacheMap, ehcacheCachingProvider.getDefaultClassLoader());

        javax.cache.CacheManager cacheManager =
                ehcacheCachingProvider.getCacheManager(ehcacheCachingProvider.getDefaultURI(), defaultConfiguration);

        return new JCacheCacheManager(cacheManager);
    }

    private static ExpiryPolicy<Object, Object> createExpiryPolicy(Duration timeToLive, Duration timeToIdle) {
        return ExpiryPolicyBuilder
                .expiry()
                .create(timeToLive)
                .access(timeToIdle)
                .build();
    }
}