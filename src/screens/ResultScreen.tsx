import type { Dispatch } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { GameAction, GameState } from '../game/gameReducer';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, fonts } from '../theme';

type Props = { state: GameState; dispatch: Dispatch<GameAction> };

export function ResultScreen({ state, dispatch }: Props) {
  const { t } = useLanguage();
  const xp = Math.round(state.score / 10);

  const stats = [
    { value: `${state.correct}/${state.answeredCount}`, label: t.accuracy, color: colors.mint },
    { value: `x${state.bestCombo}`, label: t.bestCombo, color: colors.orange },
    { value: `+${xp}`, label: t.xpGain, color: colors.gold },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeStar}>★</Text>
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {t.resultTitle}
        </Text>
        <Text style={styles.score}>{state.score}</Text>
        <Text style={styles.scoreLabel}>{t.score}</Text>
      </View>

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tip}>
        <Text style={styles.tipText}>{t.tip}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => dispatch({ type: 'start' })} accessibilityRole="button" style={styles.replay}>
          <Text style={styles.replayText}>{t.replay}</Text>
        </Pressable>
        <Pressable onPress={() => dispatch({ type: 'goHome' })} accessibilityRole="button" style={styles.home}>
          <Text style={styles.homeText}>{t.home}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22, paddingTop: 40, paddingBottom: 20, gap: 22 },
  hero: { alignItems: 'center', gap: 10 },
  badge: { width: 96, height: 96, borderRadius: 28, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  badgeStar: { fontSize: 48, color: colors.gold },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.text },
  score: { fontFamily: fonts.monoBold, fontSize: 54, color: colors.accent },
  scoreLabel: { fontFamily: fonts.regular, fontSize: 14, letterSpacing: 1.5, color: colors.muted, textTransform: 'uppercase' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: fonts.bold, fontSize: 22 },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center' },
  tip: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  tipText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.softText },
  actions: { marginTop: 'auto', gap: 12 },
  replay: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentShadow,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  replayText: { fontFamily: fonts.bold, fontSize: 18, color: colors.bg },
  home: { height: 52, borderRadius: 18, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  homeText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
});
