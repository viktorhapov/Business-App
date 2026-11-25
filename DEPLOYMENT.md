# Business Learning deployment notes

The production build is written to `dist/` with `npm run build`. This repository is configured for GitHub Pages at `https://viktorhapov.github.io/Business-App/`; GitHub Pages must publish the built `dist/` artifact, not the repository root. The Vite base path, PWA manifest, public assets, and service worker use the `/Business-App/` scope.

The repository includes a GitHub Pages workflow at `.github/workflows/pages.yml`. In repository **Settings → Pages**, set the build and deployment source to **GitHub Actions** before pushing workflow changes. The workflow builds Vite, verifies `dist/index.html` is at the artifact root (and there is no nested `dist/dist`), then uploads `dist/`. It runs on pushes to `master` and can also be started from **Actions → Publish Business Learning to GitHub Pages → Run workflow**.

The host needs to:

- Serve the app over HTTPS.
- Return `index.html` for app navigation URLs.
- Serve `manifest.webmanifest` with a manifest/JSON MIME type and `sw.js` as JavaScript.
- Support byte-range requests for the lesson MP3 files so audio seeking works well.

The app shell, lesson text, and icons are cached for offline use after the first online visit. Lesson audio is streamed from the host and is not cached offline. The seven MP3 files total about 117 MiB; original WAV sources remain in `public/audio/` for local use and are excluded from the production output.

## GitHub Pages option

GitHub Pages is the simplest fit for the current Vite app if it is published at the site root (a user-site URL such as `https://<username>.github.io/`). The app uses root-relative URLs and its service worker needs root scope; a project URL under `/repository-name/` will need a base-path change first.

The original WAV files are excluded by `.gitignore`; the MP3 files under `public/audio/mp3/` are the assets used by the player and must be included in the deployment. The production build checks that all seven MP3 files exist before building. Configure deployment to publish the generated `dist/` folder so it contains the MP3 audio without the larger WAV sources.

After the site is online, open it in Safari on the iPhone, use **Share → Add to Home Screen**, then launch the installed icon. Test listening with the screen locked on the target iPhone; background audio behavior can vary between iOS releases and standalone web apps.
