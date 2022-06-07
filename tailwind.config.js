module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins"],
      noto: ["Noto Sans"],
    },
    extend: {
      colors: {
        primary: "#2F80ED",
        secondary: "#828282",
      },
      backgroundImage: (theme) => ({
        banner: "url('/images/banner.jpg')",
        logo:"url('/images/logos/tweeter-small.svg')"
      }),
    },
  },
};
