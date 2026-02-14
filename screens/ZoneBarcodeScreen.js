import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ToastAndroid, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../components/AppHeader';
import TopTabs from '../components/TopTabs';
import BarcodeView from '../components/BarcodeView';
import { DEFAULT_SETTINGS, loadSettings, loadArray, saveArray, ZONE_FAV_KEY, pad2, makeId, getZoneAisles } from '../utils/storage';
import { colors, text, card as cardStyle, fonts } from '../utils/theme';

const ZONE_OPTIONS = ['1','2','3','4','8'];

export default function ZoneBarcodeScreen({ navigation }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [zone, setZone] = useState('1');
  const [aisle, setAisle] = useState('A');
  const [shelf, setShelf] = useState('01');
  const [location, setLocation] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { loadSettings().then(setSettings); }, []);
  useFocusEffect(useCallback(() => { loadSettings().then(setSettings); }, []));

  const aisleList = useMemo(() => {
    const cfg = settings.zones[zone] || settings.zones['1'];
    const list = getZoneAisles(cfg);
    if (!list.includes(aisle)) setAisle(list[0] || 'A');
    return list;
  }, [settings, zone, aisle]);

  const shelfList = useMemo(() => {
    const cfg = settings.zones[zone] || settings.zones['1'];
    const max = Math.max(1, parseInt(cfg.shelfMax || 1, 10));
    const arr = [];
    for (let i = 1; i <= max; i++) arr.push(pad2(i));
    if (!arr.includes(shelf)) setShelf(arr[0]);
    return arr;
  }, [settings, zone, shelf]);

  function buildCode() {
    const prefix = '902';
    const z = zone;
    const a = aisle;
    const s = shelf;
    const loc = (location || '').replace(/\D/g, '');
    if (!loc) return '';
    return prefix + z + a + s + loc;
  }
  useEffect(() => { setCode(buildCode()); }, [zone, aisle, shelf, location]);

  const toast = (m) => Platform.OS === 'android' && ToastAndroid.show(m, ToastAndroid.SHORT);

  async function addFavorite() {
    if (!code) return;
    const favs = await loadArray(ZONE_FAV_KEY);
    const entry = {
      id: makeId('zonefav'),
      zone, aisle, shelf, location: (location || '').replace(/\D/g, ''), code,
      label: `${settings?.zones?.[zone]?.name || zone} ${aisle}.${shelf}.${(location || '').replace(/\D/g, '')}`,
      createdAt: Date.now(),
    };
    await saveArray(ZONE_FAV_KEY, [entry, ...favs]);
    toast('Ajouté aux favoris');
  }

  const zoneName = settings?.zones?.[zone]?.name || zone;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Stock · Zones" subtitle="Générez et enregistrez vos emplacements" />
      <TopTabs navigation={navigation} current="Code Barre Zone" />
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={[text.h1, styles.title]}>Code barre zone</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={text.label}>Zone</Text>
            <Picker selectedValue={zone} onValueChange={setZone} style={styles.picker}>
              {ZONE_OPTIONS.map(z => {
                const label = settings?.zones?.[z]?.name || z;
                return <Picker.Item key={z} label={label} value={z} />;
              })}
            </Picker>
          </View>

          <View style={styles.row}>
            <Text style={text.label}>Allée</Text>
            <Picker selectedValue={aisle} onValueChange={setAisle} style={styles.picker}>
              {aisleList.map(ch => <Picker.Item key={ch} label={ch} value={ch} />)}
            </Picker>
          </View>

          <View style={styles.row}>
            <Text style={text.label}>Étagère</Text>
            <Picker selectedValue={shelf} onValueChange={setShelf} style={styles.picker}>
              {shelfList.map(n => <Picker.Item key={n} label={n} value={n} />)}
            </Picker>
          </View>

          <View style={styles.row}>
            <Text style={text.label}>Emplacement</Text>
            <TextInput
              value={location}
              onChangeText={t => setLocation((t || '').replace(/\D/g, ''))}
              keyboardType="number-pad"
              placeholder="ex: 101"
              style={styles.input}
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Bouton favoris zones : TOUJOURS visible */}
          <Pressable onPress={() => navigation.navigate('Favoris Zones')} style={styles.linkBtn}>
            <Text style={styles.linkText}>Voir les favoris zones</Text>
          </Pressable>
        </View>

        {code ? (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <BarcodeView value={code} format="CODE128" />
            <Text style={[text.hint, { marginTop: 8, textAlign: 'center' }]}>
              902 (fixe) • {zoneName} • Allée {aisle} • Étagère {shelf} • Emplacement {(location || '').replace(/\D/g, '')}
            </Text>
            <Pressable onPress={addFavorite} style={styles.favBtn}>
              <Text style={styles.favText}>Ajouter aux favoris</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={[text.hint, { marginTop: 8 }]}>Renseignez l’emplacement pour générer le code.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  title: { marginBottom: 12 },
  card: { ...cardStyle, marginBottom: 12 },
  row: { marginBottom: 12 },
  picker: { backgroundColor: '#f3f4f6', borderRadius: 8 },
  input: {
    backgroundColor: '#f3f4f6', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontFamily: fonts.mono, fontSize: 16, color: colors.text,
  },
  favBtn: { marginTop: 12, backgroundColor: colors.dark, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  favText: { color: '#fff', fontFamily: fonts.heading, fontWeight: '700' },
  linkBtn: { marginTop: 4, paddingVertical: 8, alignSelf: 'flex-start' },
  linkText: { color: colors.primary, fontFamily: fonts.heading, fontWeight: '700' },
});
