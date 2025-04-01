/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Georgia: ['Georgia'],
        GeorgiaBold: ['GeorgiaBold'],
        HiraginoMinchoPron: ['Hiragino Mincho ProN'],
        NotoSans: ['Noto Sans'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Remove Tailwind CSS's preflight style so it can use the antd's preflight instead (reset.css).
    preflight: false,
  },
};
