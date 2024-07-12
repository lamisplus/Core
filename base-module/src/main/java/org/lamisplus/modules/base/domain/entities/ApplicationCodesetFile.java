//package org.lamisplus.modules.base.domain.entities;
//
//import lombok.EqualsAndHashCode;
//import lombok.Getter;
//import lombok.Setter;
//
//import javax.persistence.Basic;
//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
//import javax.persistence.Id;
//import javax.persistence.Table;
//
//@Entity
//@Getter
//@Setter
//@EqualsAndHashCode
//@Table(name = "base_application_codeset_file")
//public class ApplicationCodesetFile extends Audit<String> {
//    @Id
//    @Column(name = "id", updatable = false)
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Basic
//    @Column(name = "file_path")
//    private String filePath;
//
//    @Basic
//    @Column(name = "file_name")
//    private String fileName;
//
//    @Column(name = "version")
//    private String version;
//
//}
