package org.lamisplus.modules.base.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@EqualsAndHashCode
@Table(name = "base_program")
@AllArgsConstructor
@NoArgsConstructor
public class Program implements Serializable {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "module_name")
    private Long moduleName;

    @Basic
    @Column(name = "status")
    private Long status;
}
