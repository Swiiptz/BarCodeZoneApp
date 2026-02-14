// components/TopTabs.js
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { colors, fonts } from '../utils/theme';

const TABS = [
  { key: 'zone', label: 'Code Barre Zone', route: 'Code Barre Zone' },
  { key: 'prod', label: 'Code Barre Produit', route: 'Code Barre Produit' },
  { key: 'settings', label: 'Paramètres', route: 'Paramètres' },
];

export default function TopTabs({ navigation, current }) {
  const index = useMemo(() => Math.max(0, TABS.findIndex(t => t.route === current)), [current]);
  const go = (delta) => {
    const next = index + delta;
    if (next >= 0 && next < TABS.length) navigation.navigate(TABS[next].route);
  };

  return (
    <PanGestureHandler
      activeOffsetX={[-24, 24]}
      onEnded={(e) => {
        const dx = e.nativeEvent.translationX;
        if (dx <= -40) go(+1);
        else if (dx >= 40) go(-1);
      }}
    >
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {TABS.map((t, i) => {
            const sel = i === index;
            return (
              <Pressable key={t.key} onPress={() => navigation.navigate(t.route)} style={[styles.pill, sel && styles.pillActive]}>
                <Text style={[styles.pillText, sel && styles.pillTextActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.border} />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f3f4f6', borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  pillActive: { backgroundColor: colors.dark, borderColor: colors.dark },
  pillText: { fontFamily: fonts.heading, fontSize: 13, color: '#111827', fontWeight: '700' },
  pillTextActive: { color: '#fff' },
  border: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
