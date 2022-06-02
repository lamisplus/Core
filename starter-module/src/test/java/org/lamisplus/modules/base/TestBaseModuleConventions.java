package org.lamisplus.modules.base;

import com.foreach.across.core.AcrossModule;
import com.foreach.across.test.AbstractAcrossModuleConventionsTest;
import org.lamisplus.modules.base.BaseModule;

public class TestBaseModuleConventions extends AbstractAcrossModuleConventionsTest
{
	@Override
	protected AcrossModule createModule() {
		return new BaseModule();
	}
}
