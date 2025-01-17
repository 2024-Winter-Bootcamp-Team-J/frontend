export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/styles/global.css'],
  theme: {
    extend: {
      colors: {
        customColor: '#282828',
        customColor2: '#444444',
        recordColor: '#3A3A3A',
        dateColor: '#737373',
        menuButton: '#6C6C6C',
        loading: '#464646', // 진한 회색
        loadingExpand: '#2C2C2E',
        login: '#1D1D1D',
        nodColor: '#1E1E1E',
        primary: {
          DEFAULT: '#2bca43',
        },
      },
    },
  },
  plugins: [],
}
