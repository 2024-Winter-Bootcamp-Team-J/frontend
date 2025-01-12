export default {

  
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",'./src/styles/global.css' ],
    theme: {
      extend: {
        blur:{
          xs: '2px',
        },
        colors: {
          customColor: '#282828',
          customColor2: '#444444',
          recordColor: '#3A3A3A',
          dateColor:'#737373',
          primary: {
            DEFAULT: "#2bca43",
          },
        },
      },
    },
    plugins: [],
  };