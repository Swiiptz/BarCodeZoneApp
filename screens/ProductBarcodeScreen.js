import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ToastAndroid, Platform } from 'react-native';
import AppHeader from '../components/AppHeader';
import TopTabs from '../components/TopTabs';
import BarcodeView from '../components/BarcodeView';
import { normalizeEAN13 } from '../utils/ean';
import { loadArray, saveArray, PROD_FAV_KEY, makeId } from '../utils/storage';
import { colors, text, card as cardStyle, fonts } from '../utils/theme';

export default function ProductBarcodeScreen({ navigation }) {
  const [eanInput, setEanInput] = useState('');
  const [ean13, setEan13] = useState('');

  function handleChange(t) {
    const digits = (t || '').replace(/\D/g, '');
    setEanInput(digits);
    if (digits.length >= 12) {
      const norm = normalizeEAN13(digits.slice(0,13));
      setEan13(norm || '');
    } else {
      setEan13('');
    }
  }

  const toast = (m) => Platform.OS === 'android' && ToastAndroid.show(m, ToastAndroid.SHORT);

  async function addFavorite() {
    if (!ean13) { Alert.alert('EAN invalide'); return; }
    const name = 'Produit ' + ean13.slice(-4);
    const arr = await loadArray(PROD_FAV_KEY);
    const entry = { id: makeId('prodfav'), name, ean13, createdAt: Date.now() };
    await saveArray(PROD_FAV_KEY, [entry, ...arr]);
    toast('Ajouté aux favoris');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Produits" subtitle="EAN-13 • Génération & favoris" />
      <TopTabs navigation={navigation} current="Code Barre Produit" />

      <View style={{ padding: 16, flex: 1 }}>
        <Text style={[text.h1, { marginBottom: 12 }]}>Code barre produit (EAN-13)</Text>

        <View style={[cardStyle, { marginBottom: 12 }]}>
          <Text style={text.label}>Entrez 12 ou 13 chiffres</Text>
          <TextInput
            value={eanInput}
            onChangeText={handleChange}
            keyboardType="number-pad"
            placeholder="ex: 761234567890"
            style={styles.input}
            maxLength={13}
            placeholderTextColor={colors.muted}
          />
        </View>

        {ean13 ? (
          <View style={[cardStyle, { alignItems: 'center' }]}>
            <BarcodeView value={ean13} format="EAN13" />
            <Pressable onPress={addFavorite} style={styles.favBtn}>
              <Text style={styles.favText}>Ajouter aux favoris</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={text.hint}>Après 12 chiffres, la clé est calculée automatiquement.</Text>
        )}

        <Pressable onPress={() => navigation.navigate('Favoris Produits')} style={styles.linkBtn}>
          <Text style={styles.linkText}>Voir les favoris produits</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 8, fontFamily: fonts.mono, fontSize: 16, color: colors.text, marginTop: 6,
  },
  favBtn: { marginTop: 12, backgroundColor: colors.dark, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  favText: { color: '#fff', fontFamily: fonts.heading, fontWeight: '700' },
  linkBtn: { marginTop: 16, padding: 10, alignItems:'center' },
  linkText: { color: colors.primary, fontFamily: fonts.heading, fontWeight: '700' },
});
