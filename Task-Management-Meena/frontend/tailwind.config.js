// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1368EC', // use your desired color
        blue: '#3B82F6'      // Tailwind already has 'blue', but if you want customization
      }
    }
  },
  plugins: []
};
