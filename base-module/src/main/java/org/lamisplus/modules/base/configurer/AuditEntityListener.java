package org.lamisplus.modules.base.configurer;

import com.foreach.across.modules.hibernate.business.AuditableEntity;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.security.SecurityUtils;

import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import java.util.Date;

@Slf4j
public class AuditEntityListener {

    @PrePersist
    private void beforeAnyPersist(Object entity) {
        if (AuditableEntity.class.isAssignableFrom (entity.getClass ())) {
            AuditableEntity auditable = (AuditableEntity) entity;
            String currentUser = SecurityUtils.getCurrentUserLogin ().orElse ("");
            Date date = new Date ();
            auditable.setCreatedDate (date);
            auditable.setLastModifiedDate (date);
            auditable.setLastModifiedBy (currentUser);
            auditable.setCreatedBy (currentUser);
        }
    }

    @PreUpdate
    private void beforeAnyUpdate(Object entity) {
        if (AuditableEntity.class.isAssignableFrom (entity.getClass ())) {
            AuditableEntity auditable = (AuditableEntity) entity;
            String currentUser = SecurityUtils.getCurrentUserLogin ().orElse ("");
            auditable.setLastModifiedBy (currentUser);
            auditable.setLastModifiedDate (new Date ());
        }
    }

    @PreRemove
    private void beforeAnyRemove(Object entity) {
        if (AuditableEntity.class.isAssignableFrom (entity.getClass ())) {
            AuditableEntity auditable = (AuditableEntity) entity;
            String currentUser = SecurityUtils.getCurrentUserLogin ().orElse ("");
            auditable.setLastModifiedBy (currentUser);
        }
    }
}
