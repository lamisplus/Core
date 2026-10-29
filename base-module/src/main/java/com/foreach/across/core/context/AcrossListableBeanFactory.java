package com.foreach.across.core.context;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;

public class AcrossListableBeanFactory extends DefaultListableBeanFactory {
    public AcrossListableBeanFactory() {
        super();
    }

    public AcrossListableBeanFactory(BeanFactory parentBeanFactory) {
        super(parentBeanFactory);
    }
}
