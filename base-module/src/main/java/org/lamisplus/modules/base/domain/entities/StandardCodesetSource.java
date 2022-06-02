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
@Table(name = "standard_codeset_source")
public class StandardCodesetSource extends Audit<String> {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "standardCodesetSourceByStandardCodesetSourceId")
    @JsonIgnore
    @ToString.Exclude
    private List<StandardCodeset> standardCodesetsById;

    @Basic
    @Column(name = "archived")
    @JsonIgnore
    private Integer archived;
}
