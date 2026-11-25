import type { Dispatch } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwipeCard } from '../components/SwipeCard';
import { CARDS } from '../data/cards';
import { MAX_LIVES, isLastCard, multiplier, type GameAction, type GameState } from '../game/gameReducer';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, fonts } from '../theme';

type Props = { state: GameState; dispatch: Dispatch<GameAction> };

export function GameScreen({ state, dispatch }: Props) {
  const { t, lang } = useLanguage();
  const card = CARDS[state.index];
  const answeredCards = state.index + (state.answered ? 1 : 0);
  const progress = answeredCards / CARDS.length;
  const right = state.answered === 'right';
  const fbColor = right ? colors.mint : colors.orange;
  const answer = (saysValid: boolean) => dispatch({ type: 'answer', saysValid });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => dispatch({ type: 'goHome' })} accessibilityRole="button" accessibilityLabel={t.home} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.hearts} accessible accessibilityLabel={`${state.lives} ${t.lives}`}>
          {Array.from({ length: MAX_LIVES }, (_, k) => (
            <Text key={k} style={[styles.heart, { color: k < state.lives ? colors.pink : colors.border }]}>
              ♥
            </Text>
          ))}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.scoreLabel}>{t.score}</Text>
          <Text style={styles.score}>{state.score}</Text>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {t.card} {state.index + 1}/{CARDS.length}
          </Text>
          <Text style={[styles.progressText, styles.combo, state.combo >= 2 && { color: colors.orange }]}>
            {t.combo} x{multiplier(state.combo)}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` as const }]} />
        </View>
      </View>

      <View style={styles.cardArea}>
        <SwipeCard key={card.id} card={card} answered={state.answered} onDecide={answer} />
      </View>

      {!state.answered ? (
        <View style={{ gap: 12 }}>
          <Text style={styles.hint}>{t.hintSwipe}</Text>
          <View style={styles.buttons}>
            <Pressable onPress={() => answer(false)} accessibilityRole="button" style={[styles.choice, styles.choiceBug]}>
              <Text style={[styles.choiceText, { color: colors.orange }]}>✕ {t.bug}</Text>
            </Pressable>
            <Pressable onPress={() => answer(true)} accessibilityRole="button" style={[styles.choice, styles.choiceOk]}>
              <Text style={[styles.choiceText, { color: colors.mint }]}>✓ {t.works}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.feedback, { borderColor: fbColor, backgroundColor: right ? 'rgba(61,224,160,0.10)' : 'rgba(255,159,67,0.10)' }]}
        >
          <View style={styles.fbHeader}>
            <Text style={[styles.fbTitle, { color: fbColor }]}>{right ? t.right : t.wrong}</Text>
            <Text style={[styles.fbPoints, { color: fbColor }]}>{right ? `+${state.lastPoints}` : '−1 ♥'}</Text>
          </View>
          <Text style={styles.fbVerdict}>{card.valid ? t.itWorks : t.itCrashes}</Text>
          <Text style={styles.fbExplain}>{card.explanation[lang]}</Text>
          <Pressable onPress={() => dispatch({ type: 'next' })} accessibilityRole="button" style={[styles.next, { backgroundColor: fbColor }]}>
            <Text style={styles.nextText}>{isLastCard(state) ? t.finish : t.next} →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  close: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.text, fontSize: 18, fontFamily: fonts.bold },
  hearts: { flexDirection: 'row', gap: 4 },
  heart: { fontSize: 24 },
  scoreLabel: { fontFamily: fonts.regular, fontSize: 12, letterSpacing: 1, color: colors.muted, textTransform: 'uppercase' },
  score: { fontFamily: fonts.monoBold, fontSize: 22, color: colors.text },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  combo: { fontFamily: fonts.bold },
  track: { height: 8, backgroundColor: colors.surface, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 999 },
  cardArea: { flex: 1, justifyContent: 'center' },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 12 },
  choice: { flex: 1, height: 58, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  choiceBug: { borderColor: colors.orange, backgroundColor: 'rgba(255,159,67,0.12)' },
  choiceOk: { borderColor: colors.mint, backgroundColor: 'rgba(61,224,160,0.12)' },
  choiceText: { fontFamily: fonts.bold, fontSize: 17 },
  feedback: { borderRadius: 20, borderWidth: 2, padding: 16, gap: 8 },
  fbHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  fbTitle: { fontFamily: fonts.bold, fontSize: 22 },
  fbPoints: { fontFamily: fonts.monoBold, fontSize: 15 },
  fbVerdict: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  fbExplain: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.softText },
  next: { marginTop: 4, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nextText: { fontFamily: fonts.bold, fontSize: 16, color: colors.bg },
});
