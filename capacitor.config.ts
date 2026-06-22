const config = {
  appId: 'com.cracklix.app',
  appName: 'Cracklix',
  webDir: 'www',

  server: {
    url: 'https://cracklix.vercel.app',
    androidScheme: 'https'
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0B1528",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    },

    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;