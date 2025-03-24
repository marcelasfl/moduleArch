module.exports = {
    corePlugins: {
        preflight: false, // Desativa o reset CSS do Tailwind
      },
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      // Adicione caminhos do Vuetify se necessário
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };