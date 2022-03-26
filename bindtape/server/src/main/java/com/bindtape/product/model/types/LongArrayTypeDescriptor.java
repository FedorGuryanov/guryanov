package com.bindtape.product.model.types;

/**
 * @author fedorguryanov
 * @since 24.02.2018.
 */
public class LongArrayTypeDescriptor extends AbstractArrayTypeDescriptor<Long[]> {

    public static final LongArrayTypeDescriptor INSTANCE = new LongArrayTypeDescriptor();

    public LongArrayTypeDescriptor() {
        super(Long[].class);
    }

    @Override
    public String getSqlArrayType() {
        return "bigint";
    }
}