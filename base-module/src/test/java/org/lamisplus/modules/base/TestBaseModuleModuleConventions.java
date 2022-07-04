package org.lamisplus.modules.base;

import com.foreach.across.core.AcrossModule;
import com.foreach.across.test.AbstractAcrossModuleConventionsTest;

public class TestBaseModuleModuleConventions extends AbstractAcrossModuleConventionsTest
{
	@Override
	protected AcrossModule createModule() {
		return new BaseModule();
	}
}
