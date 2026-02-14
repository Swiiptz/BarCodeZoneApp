import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import AppHeader from '../components/AppHeader';
import TopTabs from '../components/TopTabs';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../utils/storage';
import { colors, text, card as cardStyle, fonts } from '../utils/theme';

const ZONES_ORDER = ['1','2','3','4','8'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function SettingsScreen({ navigation }) {
  const [cfg, setCfg] = useState(DEFAULT_SETTINGS);

  useEffect(() => { loadSettings().then(setCfg); }, []);

  function toggleAisle(z, ch) {
    setCfg(prev => {
      const current = prev.zones[z].aisles || [];
      const exists = current.includes(ch);
      const next = exists ? current.filter(c => c !== ch) : [...current, ch].sort();
      return { ...prev, zones: { ...prev.zones, [z]: { ...prev.zones[z], aisles: next } } };
    });
  }

  function setShelf(z, val) {
    setCfg(prev => ({
      ...prev,
      zones: { ...prev.zones, [z]: { ...prev.zones[z], shelfMax: String(val).replace(/\D/g,'') } },
    }));
  }

  async function persist() {
    await saveSettings(cfg);
    // petit feedback discret – tu peux garder aussi un Toast Android si tu veux
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Paramètres" subtitle="Zones · Allées personnalisées · Étagères" />
      <TopTabs navigation={navigation} current="Paramètres" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[text.h1, { marginBottom: 6 }]}>Paramètres</Text>
        <Text style={[text.hint, { marginBottom: 12 }]}>
          Sélectionnez les lettres d’allée autorisées pour chaque zone, puis l’étagère max.
        </Text>

        {ZONES_ORDER.map(z => (
          <View key={z} style={[cardStyle, { marginBottom: 12 }]}>
            <Text style={[text.h2, { marginBottom: 8 }]}>{cfg.zones[z].name}</Text>

            {/* Sélecteur de lettres (pills) */}
            <Text style={text.label}>Allées autorisées</Text>
            <View style={styles.grid}>
              {LETTERS.map(ch => {
                const on = (cfg.zones[z].aisles || []).includes(ch);
                return (
                  <Pressable key={ch} onPress={() => toggleAisle(z, ch)} style={[styles.pill, on && styles.pillOn]}>
                    <Text style={[styles.pillText, on && styles.pillTextOn]}>{ch}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Boutons rapides */}
            <View style={{ flexDirection:'row', gap: 8, marginTop: 6 }}>
              <Pressable
                onPress={() => setCfg(prev => ({ ...prev, zones: { ...prev.zones, [z]: { ...prev.zones[z], aisles: LETTERS.slice() } } }))}
                style={styles.quickBtn}
              >
                <Text style={styles.quickTxt}>Tout</Text>
              </Pressable>
              <Pressable
                onPress={() => setCfg(prev => ({ ...prev, zones: { ...prev.zones, [z]: { ...prev.zones[z], aisles: [] } } }))}
                style={styles.quickBtn}
              >
                <Text style={styles.quickTxt}>Aucun</Text>
              </Pressable>
            </View>

            {/* Étagères max */}
            <View style={{ marginTop: 10 }}>
              <Text style={text.label}>Étagères max</Text>
              <TextInput
                value={String(cfg.zones[z].shelfMax)}
                onChangeText={(t) => setShelf(z, t)}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="09"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
        ))}

        <Pressable onPress={persist} style={styles.saveBtn}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  pillOn: { backgroundColor: colors.dark, borderColor: colors.dark },
  pillText: { fontFamily: fonts.heading, fontSize: 13, color: '#111827', fontWeight: '700' },
  pillTextOn: { color: '#fff' },
  quickBtn: { backgroundColor: '#eef2ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#c7d2fe' },
  quickTxt: { color: '#3730a3', fontFamily: fonts.heading, fontWeight: '700' },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    marginTop: 4,
  },
  saveBtn: { marginTop: 8, backgroundColor: '#1d4ed8', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontFamily: fonts.heading, fontWeight: '700' },
});
