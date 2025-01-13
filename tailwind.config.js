export default {

  
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",'./src/styles/global.css' ],
    theme: {
      extend: {
        blur:{
          xs: '2px',
        },
        colors: {
          customColor: '#282828', // 진한 희색
          customColor2: '#444444', // 옅은 희색
          recordColor: '#3A3A3A', // 더 옅은 희색
          dateColor:'#737373', 
          menuButton:'#6C6C6C',
          primary: {
            DEFAULT: "#2bca43",
          },
        },
      },
    },
    plugins: [],
  };