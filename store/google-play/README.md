# Google Play store assets

Regenerate the graphics with `python scripts/generate-store-assets.py` (needs Pillow and `npm install` for the fonts).

| Play Console field | File | Spec |
| --- | --- | --- |
| App icon | `icon-512.png` | 512×512 PNG, ≤ 1 MB |
| Feature graphic | `feature-graphic-en.png`, `feature-graphic-fr.png` | 1024×500 PNG/JPG, no transparency |
| Store listing text | `listing-en.md`, `listing-fr.md` | name ≤ 30, short ≤ 80, full ≤ 4000 chars |
| Phone screenshots | `screenshots/phone/{en,fr}-*.png` | 1080×1920 (9:16), 2–8 per language |
| 7-inch tablet screenshots | `screenshots/tablet-7/{en,fr}-*.png` | 1200×2132 |
| 10-inch tablet screenshots | `screenshots/tablet-10/{en,fr}-*.png` | 1620×2880 |

Each set has 4 screens: home, card, answer feedback, result.

### Regenerating screenshots

The screenshots come from the real app rendered with Expo web in headless Chrome:

1. `npm install --no-save react-dom@19.3.0 react-native-web @expo/metro-runtime puppeteer-core`
2. `npx expo export --platform web --output-dir <tmp>/web`
3. `node scripts/capture-screenshots.js <tmp>/web store/google-play/screenshots`

`--no-save` keeps `package.json` unchanged; `npm ci` removes these packages again.

The script hardcodes the Chrome path and the `valid` value of each card in `src/data/cards.ts`. Update both if they change.

## Still to do before submitting

- **Privacy policy URL**: required, even if the app collects no data. Host a page (e.g. on learntime.net) and paste its URL in the Play Console.
- **Data safety form**: fill in the Play Console. The app currently sends no data off the device.
- **Content rating**: answer the IARC questionnaire (Education / no sensitive content).
- **Target audience**: if under-13 users are selected, the app falls under the Families policy.
- **App bundle**: `eas build -p android --profile production`, then `eas submit -p android` (needs a Play service account key the first time).
