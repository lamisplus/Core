package org.lamisplus.modules.base.domain.entities;

import lombok.*;
import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "system_settings")
public class SystemSettings extends Audit {
    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
    @Column(unique = true, nullable = false)
    private String key;
    private String value;


}
