const { withFinalizedMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PURPLE = "#200020";

const TRANSPARENT_DRAWABLE = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@android:color/transparent" />
    <size android:width="1dp" android:height="1dp" />
</shape>
`;

const SPLASH_THEME_BLOCK = `<style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_transparent</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
    <item name="android:statusBarColor">${PURPLE}</item>
    <item name="android:navigationBarColor">${PURPLE}</item>
    <item name="android:windowLightNavigationBar" tools:targetApi="27">false</item>
    <item name="android:enforceNavigationBarContrast" tools:targetApi="29">false</item>
  </style>`;

function patchAndroidSplashResources(platformProjectRoot) {
	const resDir = path.join(platformProjectRoot, "app/src/main/res");
	const drawableDir = path.join(resDir, "drawable");
	const stylesPath = path.join(resDir, "values/styles.xml");

	fs.mkdirSync(drawableDir, { recursive: true });
	fs.writeFileSync(
		path.join(drawableDir, "splashscreen_transparent.xml"),
		TRANSPARENT_DRAWABLE,
	);
	fs.writeFileSync(
		path.join(drawableDir, "splashscreen_logo.xml"),
		TRANSPARENT_DRAWABLE,
	);

	const logoPng = path.join(drawableDir, "splashscreen_logo.png");
	if (fs.existsSync(logoPng)) {
		fs.unlinkSync(logoPng);
	}

	let styles = fs.readFileSync(stylesPath, "utf8");
	styles = styles.replace(
		/<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/,
		SPLASH_THEME_BLOCK,
	);
	styles = styles.replace(
		/name="android:enforceNavigationBarContrast"[^>]*>true/,
		'name="android:enforceNavigationBarContrast" tools:targetApi="29">false',
	);
	if (!styles.includes('name="android:windowBackground"')) {
		styles = styles.replace(
			/(<item name="android:navigationBarColor">[^<]+<\/item>)/,
			`$1\n    <item name="android:windowBackground">${PURPLE}</item>\n    <item name="android:windowLightNavigationBar" tools:targetApi="27">false</item>`,
		);
	}
	fs.writeFileSync(stylesPath, styles);
}

/** Splash morado puro sin icono; barras del sistema moradas durante arranque. */
const withAndroidPurpleSplash = (config) =>
	withFinalizedMod(config, [
		"android",
		async (config) => {
			patchAndroidSplashResources(config.modRequest.platformProjectRoot);
			return config;
		},
	]);

module.exports = withAndroidPurpleSplash;
