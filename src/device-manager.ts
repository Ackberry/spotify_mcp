export class DeviceManager {
  private defaultDeviceId: string | null = null;

  constructor(defaultDeviceId?: string) {
    if (defaultDeviceId) {
      this.defaultDeviceId = defaultDeviceId;
    }
  }

  setDefaultDevice(deviceId: string) {
    this.defaultDeviceId = deviceId;
  }

  getDefaultDevice(): string | null {
    return this.defaultDeviceId;
  }

  getDevice(providedDeviceId?: string): string | undefined {
    return providedDeviceId || this.defaultDeviceId || undefined;
  }
}

