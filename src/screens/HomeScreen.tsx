import type { Dispatch } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LanguageToggle } from '../components/LanguageToggle';
import type { GameAction, GameState, Mode } from '../game/gameReducer';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, fonts } from '../theme';

type Props = { state: GameState; dispatch: Dispatch<GameAction> };

export function HomeScreen({ state, dispatch }: Props) {
  const { t } = useLanguage();

  const modes: { id: Mode; title: string; desc: string; tag: string }[] = [
    { id: 'sprint', title: t.sprint, desc: t.sprintDesc, tag: '60s' },
    { id: 'survival', title: t.survival, desc: t.survivalDesc, tag: '♥ x3' },
    { id: 'daily', title: t.daily, desc: t.dailyDesc, tag: 'x2 XP' },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.streak}>
            <View style={styles.streakDot} />
            <Text style={styles.streakText}>{t.streak}</Text>
          </View>
          <LanguageToggle />
        </View>

        <View style={styles.hero}>
          <View style={styles.illustration} accessible={false}>
            <View style={[styles.illoCard, styles.illoBack]} />
            <View style={[styles.illoCard, styles.illoFront]}>
              <View style={[styles.illoLine, { width: '70%', backgroundColor: colors.accent }]} />
              <View style={[styles.illoLine, { width: '90%', backgroundColor: colors.borderStrong }]} />
              <View style={[styles.illoLine, { width: '55%', backgroundColor: colors.mint }]} />
              <View style={[styles.illoLine, { width: '80%', backgroundColor: colors.borderStrong }]} />
            </View>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            CODE{'\n'}
            <Text style={{ color: colors.accent }}>SWIPE</Text>
          </Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>

        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLevel}>{t.level}</Text>
            <Text style={styles.xpValue}>320 / 500 XP</Text>
          </View>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: '64%' }]} />
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={styles.sectionTitle}>{t.modesTitle}</Text>
          {modes.map((m) => {
            const active = state.mode === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => dispatch({ type: 'setMode', mode: m.id })}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={[styles.mode, active && styles.modeActive]}
              >
                <View style={{ gap: 2, flex: 1 }}>
                  <Text style={styles.modeTitle}>{m.title}</Text>
                  <Text style={styles.modeDesc}>{m.desc}</Text>
                </View>
                <Text style={[styles.modeTag, active && { color: colors.accent }]}>{m.tag}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => dispatch({ type: 'start' })}
        accessibilityRole="button"
        style={({ pressed }) => [styles.play, pressed && { transform: [{ translateY: 4 }], shadowOffset: { width: 0, height: 2 } }]}
      >
        <Text style={styles.playText}>{t.play} ▸</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22, paddingBottom: 20 },
  content: { paddingTop: 16, paddingBottom: 20, gap: 18 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  streakDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange },
  streakText: { fontFamily: fonts.bold, fontSize: 14, color: colors.orange },
  hero: { alignItems: 'center', gap: 12 },
  illustration: { width: 200, height: 112 },
  illoCard: { position: 'absolute', left: 40, top: 6, width: 120, height: 100, borderRadius: 18, borderWidth: 2 },
  illoBack: { backgroundColor: colors.surface2, borderColor: colors.borderStrong, transform: [{ rotate: '-10deg' }] },
  illoFront: { backgroundColor: colors.card, borderColor: colors.accent, transform: [{ rotate: '6deg' }], padding: 14, gap: 8 },
  illoLine: { height: 8, borderRadius: 4 },
  title: { fontFamily: fonts.bold, fontSize: 46, lineHeight: 46, letterSpacing: -1, textAlign: 'center', color: colors.text },
  tagline: { fontFamily: fonts.regular, fontSize: 16, color: colors.muted },
  xpCard: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLevel: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  xpValue: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted },
  xpTrack: { height: 10, backgroundColor: colors.bg, borderRadius: 999, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 999 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1.5, color: colors.muted, textTransform: 'uppercase' },
  mode: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeActive: { borderColor: colors.accent },
  modeTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  modeDesc: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  modeTag: { fontFamily: fonts.mono, fontSize: 13, color: colors.muted },
  play: {
    height: 60,
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
  playText: { fontFamily: fonts.bold, fontSize: 20, letterSpacing: 0.5, color: colors.bg },
});
