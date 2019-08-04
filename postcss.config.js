module.exports = {
	plugins: [
		require('postcss-import'),
		require('autoprefixer'),
		// require('cssnano'),
		require('postcss-custom-media')({
			preserve: false
		}),
		require('postcss-media-minmax')
	]
};
