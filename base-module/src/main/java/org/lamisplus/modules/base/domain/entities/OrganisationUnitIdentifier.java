package org.lamisplus.modules.base.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "base_organisation_unit_identifier")
public class OrganisationUnitIdentifier {
    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "organisation_unit_id")
    private Long organisationUnitId;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "name")
    private String name;
    @ManyToOne
    @ToString.Exclude
    @JsonIgnore
    @JoinColumn(name = "organisation_unit_id", referencedColumnName = "id", insertable = false, updatable = false)
    private OrganisationUnit organisationUnitByOrganisationUnitId;
}
