import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.captura.app',
  appName: 'Captura',
  webDir: 'www',
  server: {
    // 10.0.2.2 = como o EMULADOR Android enxerga o localhost do seu PC
    url: 'http://10.0.2.2:3000',
    cleartext: true, // permite http (sem https) — só p/ teste local
  },
};

export default config;
