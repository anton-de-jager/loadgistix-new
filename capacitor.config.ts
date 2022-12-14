import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.loadgistix.www',
  appName: 'loadgistix',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_logo_text_on_dark",
      iconColor: "#F43F5E",
      sound: "beep.wav"
    }
  }
};

export default config;
