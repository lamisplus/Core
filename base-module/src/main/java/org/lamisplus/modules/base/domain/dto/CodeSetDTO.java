package org.lamisplus.modules.base.domain.dto;

public class CodeSetDTO {
    private Long id;
    private String code;
    private String display;

    public CodeSetDTO(Long id, String code, String display) {
        this.id = id;
        this.code = code;
        this.display = display;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }
}
