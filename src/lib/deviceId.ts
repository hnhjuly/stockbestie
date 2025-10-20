// Generate or retrieve a unique device ID for this device
export const getDeviceId = (): string => {
  const DEVICE_ID_KEY = 'stock_bestie_device_id';
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate a unique ID for this device
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
};
