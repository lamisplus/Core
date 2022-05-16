package org.lamisplus.modules.base.controller.apierror;

public class NoRecordFoundException extends RuntimeException {
    public NoRecordFoundException(String message) {
        super (message);
    }
}
