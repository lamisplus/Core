package org.lamisplus.modules.base.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "standard_codeset")
public class StandardCodeset extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "standard_codeset_source_id")
    private Long standardCodesetSourceId;

    @OneToMany(mappedBy = "standardCodesetByStandardCodesetId")
    @JsonIgnore
    @ToString.Exclude
    private List<ApplicationCodesetStandardCodeset> applicationCodesetStandardCodesetsById;

    @ManyToOne
    @JoinColumn(name = "standard_codeset_source_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ToString.Exclude
    private StandardCodesetSource standardCodesetSourceByStandardCodesetSourceId;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived = 0;
}
