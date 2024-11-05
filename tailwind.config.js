/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				'gilroyEB': ['"gilroyEB"', 'extraBold'],
				'albulaExtraLight': ['"albulaExtraLight"', 'extraLight'],
				'albulaLight': ['"albulaLight"', 'light'],
				'albulaRegular': ['"albulaRegular"', 'regular'],
				'albulaMedium': ['"albulaMedium"', 'medium'],
				'albulaBold': ['"albulaBold"', 'bold'],
				'albulaHeavy': ['"albulaHeavy"', 'heavy'],
				'albulaExtraBold': ['"albulaExtraBold"', 'extraBold'],
				'noirProLight': ['"noirProLight"', 'light'],
				'noirProRedular': ['"noirProRegular"', 'regular'],
				'noirProBold': ['"noirProBold"', 'bold'],
				'noirProHeavy': ['"noirProHeavy"', 'heavy'],
		  	},
			backdropBlur: {
                md: '12px',
            },
		},
	},
	variants: {
        extend: {
            backdropBlur: ['responsive'],
        },
    },
	plugins: [],
}