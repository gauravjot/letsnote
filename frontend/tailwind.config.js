/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				serif: ['"Merriweather"', "Merriweather", "Times New Roman", "Georgia", "serif"],
				sans: ['"DM Sans"', "DM Sans", "Roboto", "Arial", "sans-serif"],
			},
			colors: {
				primary: {
					50: "#eef7ff",
					100: "#d9ecff",
					200: "#bcdfff",
					300: "#8eccff",
					400: "#58afff",
					500: "#328dff",
					600: "#2372f5",
					700: "#1457e1",
					800: "#1746b6",
					900: "#193e8f",
					950: "#142757",
				},
			},
			fontSize: {
				bb: "0.925rem",
				md: "0.975rem",
			},
		},
	},
	plugins: [],
};
