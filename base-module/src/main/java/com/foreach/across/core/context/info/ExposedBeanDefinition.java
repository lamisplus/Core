package com.foreach.across.core.context.info;

public class ExposedBeanDefinition {
    private final String beanName;
    private final Class<?> beanClass;

    public ExposedBeanDefinition(String beanName, Class<?> beanClass) {
        this.beanName = beanName;
        this.beanClass = beanClass;
    }

    public String getBeanName() {
        return beanName;
    }

    public Class<?> getBeanClass() {
        return beanClass;
    }
}
