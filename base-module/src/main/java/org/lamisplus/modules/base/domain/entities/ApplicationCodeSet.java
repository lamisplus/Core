package org.lamisplus.modules.base.domain.entities;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@Table(name = "base_application_codeset")
public class ApplicationCodeSet extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "codeset_group")
    private String codesetGroup;

    @Basic
    @Column(name = "language")
    private String language;

    @Basic
    @Column(name = "display")
    private String display;

    @Basic
    @Column(name = "version")
    private String version="1.0";

    @Basic
    @Column(name = "code", updatable = false)
    private String code;

    @Basic
    @Column(name = "archived") //1 is archived, 0 is unarchived, 2 is deactivate
    private Integer archived=0;
}
