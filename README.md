# Code Swipe

A swipe card game for [learntime.net](https://learntime.net): you get a snippet of code and decide whether it **runs** (swipe right) or **crashes** (swipe left). The app is in French and English.

This is version 1 of the design: a home screen with modes and XP, a game screen with a draggable code card, and a results screen.

## Getting started

Requires Node 20+.

```bash
npm install
npm run setup      # installs the Expo packages at the versions that match the SDK
npx expo install --fix
npm start
```

Then press `a` for an Android emulator or `i` for the iOS simulator, or scan the QR code.

> Expo Go for SDK 57 may not be in the stores yet. If your phone's Expo Go refuses the project, use an emulator or simulator, `eas go` on iOS, or a development build (`npx expo run:android` / `npx expo run:ios`).

## Project structure

```
App.tsx                      fonts, providers, screen switch
src/
  theme.ts                   colours and font names
  i18n/strings.ts            all UI text, French and English
  i18n/LanguageContext.tsx   current language (defaults to the device language)
  data/cards.ts              the code cards and their explanations
  game/gameReducer.ts        game rules: score, combo, lives, next card
  components/SwipeCard.tsx   draggable card (Animated + PanResponder)
  components/LanguageToggle.tsx
  screens/HomeScreen.tsx
  screens/GameScreen.tsx
  screens/ResultScreen.tsx
```

## Adding cards

Add an entry to `CARDS` in `src/data/cards.ts`:

```ts
{
  id: 'py-example',
  lang: 'Python',
  valid: false,
  code: 'print("hello"',
  explanation: { fr: '…', en: '…' },
}
```

## Adding text

Every string lives in `src/i18n/strings.ts`. Add the key to both `fr` and `en`.

## Not done yet

- The modes (Sprint, Survival, Daily challenge) can be selected but all play the Survival rules (3 lives). Sprint has no timer yet.
- The streak, level and XP on the home screen are placeholders; nothing is saved between sessions.
- The chosen language is not remembered after closing the app.
