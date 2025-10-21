import { systemSettingsHelper } from "./SystemSettingsHelper";


export const fetchInstanceSetting = async () => {
    let instance = systemSettingsHelper.getSingleSystemSetting("instance");
    if (!instance) {
      await systemSettingsHelper.fetchAllSystemSettings();
      instance = systemSettingsHelper.getSingleSystemSetting("instance");
    }
    return instance;
  };