package org.lamisplus.modules.base.domain.dto;

import lombok.Builder;
import lombok.Data;
import org.jetbrains.annotations.NotNull;

import java.util.Comparator;

@Data
@Builder
public class Version implements Comparable<Version> {
    private Integer major;
    private Integer minor;
    private Integer patch;
    private Integer test;
    private static final Comparator<Version> COMP = Comparator
            .comparingInt(Version::getMajor)
            .thenComparingInt(Version::getMinor)
            .thenComparingInt(Version::getPatch)
            .thenComparingInt(v -> v.getTest() == 0 ? Integer.MAX_VALUE : v.getTest());
    @Override
    public int compareTo(@NotNull Version otherVersion) {
        return COMP.compare(this, otherVersion);
    }


    public static Version createVersion(String versionAsString) {
        String[] versionAsStringSplit = versionAsString != null ? versionAsString.split("\\.") : new String[0];
        int length = versionAsStringSplit.length;
        int major = length > 0 && versionAsStringSplit[0] != null ? Integer.parseInt(versionAsStringSplit[0]) : 0;
        int minor = length > 1 && versionAsStringSplit[1] != null ? Integer.parseInt(versionAsStringSplit[1]) : 0;
        int patch = length > 2 && versionAsStringSplit[2] != null ? Integer.parseInt(versionAsStringSplit[2]) : 0;
        int test = length > 3 && versionAsStringSplit[3] != null ? Integer.parseInt(versionAsStringSplit[3]) : 0;

        return Version.builder()
                .major(major)
                .minor(minor)
                .patch(patch)
                .test(test)
                .build();
    }


}

