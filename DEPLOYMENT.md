# Business Learning deployment notes

The production build is written to `dist/` with `npm run build`. Publish the contents of that folder at the root of a static HTTPS site. This project uses root-relative URLs, so hosting it below a URL subfolder needs a separate base-path change.

The host needs to:

- Serve the app over HTTPS.
- Return `index.html` for app navigation URLs.
- Serve `manifest.webmanifest` with a manifest/JSON MIME type and `sw.js` as JavaScript.
- Support byte-range requests for the lesson WAV files so audio seeking works well.

The app shell, lesson text, and icons are cached for offline use after the first online visit. Lesson audio is streamed from the host and is not cached offline because the seven current uncompressed WAV files total about 322 MiB.

After the site is online, open it in Safari on the iPhone, use **Share → Add to Home Screen**, then launch the installed icon. Test listening with the screen locked on the target iPhone; background audio behavior can vary between iOS releases and standalone web apps.
