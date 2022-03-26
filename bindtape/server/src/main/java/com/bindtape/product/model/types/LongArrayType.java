package com.bindtape.product.model.types;

import org.hibernate.type.AbstractSingleColumnStandardBasicType;
import org.hibernate.usertype.DynamicParameterizedType;

import java.util.Properties;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
public class LongArrayType
        extends AbstractSingleColumnStandardBasicType<Long[]>
        implements DynamicParameterizedType {

    public LongArrayType() {
        super(
                ArraySqlTypeDescriptor.INSTANCE,
                LongArrayTypeDescriptor.INSTANCE
        );
    }

    public String getName() {
        return "long-array";
    }

    @Override
    protected boolean registerUnderJavaType() {
        return true;
    }

    @Override
    public void setParameterValues(Properties parameters) {
        ((LongArrayTypeDescriptor)
                getJavaTypeDescriptor())
                .setParameterValues(parameters);
    }
}