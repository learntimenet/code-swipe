import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/strings';
import { colors, fonts } from '../theme';

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
];

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel={t.language}>
      {OPTIONS.map((o) => {
        const active = o.value === lang;
        return (
          <Pressable
            key={o.value}
            onPress={() => setLang(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            hitSlop={6}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 999, padding: 4, gap: 2 },
  pill: { minWidth: 44, height: 36, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  pillActive: { backgroundColor: colors.accent },
  label: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  labelActive: { color: colors.bg },
});
