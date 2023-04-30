/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				serif: [
					'"Merriweather"',
					"Merriweather",
					"Times New Roman",
					"Georgia",
					"serif",
				],
				sans: ['"DM Sans"', "DM Sans", "Roboto", "Arial", "sans-serif"],
			},
		},
	},
	plugins: [],
};
