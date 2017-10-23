const { FuseBox, CSSResourcePlugin, CSSPlugin, ImageBase64Plugin, UglifyJSPlugin } = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "src",
    output: "public/$name.js",
	plugins: [
		[CSSResourcePlugin({inline: true}), CSSPlugin()],
		ImageBase64Plugin()
		// UglifyJSPlugin()
	]
});

fuse.bundle("app")
	.instructions(`> index.js`);

fuse.run();
