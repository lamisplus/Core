package org.lamisplus.modules.base.domain.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
@Data
public class ManagementDto implements Serializable
{
    private boolean isConfigured;
    private List users = new ArrayList<>();
}
