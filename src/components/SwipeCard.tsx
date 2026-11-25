import { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import type { Card } from '../data/cards';
import type { Answer } from '../game/gameReducer';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, fonts } from '../theme';

const SWIPE_THRESHOLD = 90;

type Props = {
  card: Card;
  /** Result of the current card; null while the player hasn't answered. */
  answered: Answer;
  /** Called when the card is swiped past the threshold. right = "it works". */
  onDecide: (saysValid: boolean) => void;
};

/**
 * Draggable code card. The parent owns the game logic: the card only reports
 * a decision, then reacts to `answered` (flies away when right, shakes when wrong).
 * Give it a `key` per card so each card starts centred.
 */
export function SwipeCard({ card, answered, onDecide }: Props) {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const pan = useRef(new Animated.Value(0)).current;

  // Keep the latest values reachable from the PanResponder callbacks.
  const answeredRef = useRef(answered);
  answeredRef.current = answered;
  const onDecideRef = useRef(onDecide);
  onDecideRef.current = onDecide;

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => !answeredRef.current && Math.abs(g.dx) > 6,
        onPanResponderMove: (_, g) => pan.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) onDecideRef.current(true);
          else if (g.dx < -SWIPE_THRESHOLD) onDecideRef.current(false);
          else Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        },
        onPanResponderTerminate: () => Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start(),
      }),
    [pan],
  );

  useEffect(() => {
    if (answered === 'right') {
      // Valid code leaves to the right ("it works"), broken code to the left ("bug").
      Animated.timing(pan, { toValue: (card.valid ? 1 : -1) * width * 1.2, duration: 280, useNativeDriver: true }).start();
    } else if (answered === 'wrong') {
      Animated.sequence([
        Animated.timing(pan, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(pan, { toValue: -12, duration: 60, useNativeDriver: true }),
        Animated.timing(pan, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(pan, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(pan, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [answered, card.valid, pan, width]);

  const rotate = pan.interpolate({ inputRange: [-240, 0, 240], outputRange: ['-15deg', '0deg', '15deg'] });
  const bugOpacity = pan.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const okOpacity = pan.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp' });
  const langColor = card.lang === 'Python' ? colors.python : colors.javascript;

  return (
    <View style={styles.wrap}>
      <View style={styles.backCard} />
      <Animated.View
        {...responder.panHandlers}
        accessible
        accessibilityLabel={`${card.lang}. ${card.code}`}
        style={[styles.card, { transform: [{ translateX: pan }, { rotate }] }]}
      >
        <View style={styles.header}>
          <Text style={[styles.langTag, { backgroundColor: langColor }]}>{card.lang}</Text>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: colors.pink }]} />
            <View style={[styles.dot, { backgroundColor: colors.orange }]} />
            <View style={[styles.dot, { backgroundColor: colors.mint }]} />
          </View>
        </View>
        <Text style={styles.code}>{card.code}</Text>
        <Text style={styles.question}>{t.question}</Text>

        <Animated.View pointerEvents="none" style={[styles.stamp, styles.stampBug, { opacity: bugOpacity }]}>
          <Text style={[styles.stampText, { color: colors.orange }]}>BUG</Text>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.stamp, styles.stampOk, { opacity: okOpacity }]}>
          <Text style={[styles.stampText, { color: colors.mint }]}>OK</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 360, alignSelf: 'center', aspectRatio: 330 / 340 },
  backCard: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: 14,
    bottom: -14,
    backgroundColor: colors.surface,
    borderRadius: 24,
    transform: [{ scale: 0.96 }],
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langTag: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.bg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  code: { flex: 1, fontFamily: fonts.mono, fontSize: 15, lineHeight: 24, color: colors.code },
  question: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center' },
  stamp: { position: 'absolute', top: 22, borderWidth: 3, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  stampBug: { left: 18, borderColor: colors.orange, transform: [{ rotate: '-14deg' }] },
  stampOk: { right: 18, borderColor: colors.mint, transform: [{ rotate: '14deg' }] },
  stampText: { fontFamily: fonts.bold, fontSize: 26 },
});
