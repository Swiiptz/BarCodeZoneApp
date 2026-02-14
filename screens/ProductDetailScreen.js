import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ToastAndroid, Platform } from 'react-native';
import AppHeader from '../components/AppHeader';
import { loadArray, saveArray, PROD_FAV_KEY } from '../utils/storage';
import { normalizeEAN13 } from '../utils/ean';
import BarcodeView from '../components/BarcodeView';
import { colors, text, card as cardStyle, fonts } from '../utils/theme';

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [name, setName] = useState('');
  const [eanInput, setEanInput] = useState('');
  const [ean13, setEan13] = useState('');

  useEffect(() => {
    (async () => {
      const list = await loadArray(PROD_FAV_KEY);
      const item = list.find(x => x.id === id);
      if (item) {
        setName(item.name);
        setEanInput(item.ean13);
        setEan13(item.ean13);
      }
    })();
  }, [id]);

  const toast = (m) => Platform.OS === 'android' && ToastAndroid.show(m, ToastAndroid.SHORT);

  async function save() {
    const list = await loadArray(PROD_FAV_KEY);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      const norm = normalizeEAN13((eanInput || '').slice(0,13));
      if (!norm) { Alert.alert('EAN invalide'); return; }
      list[idx] = { ...list[idx], name, ean13: norm };
      await saveArray(PROD_FAV_KEY, list);
      toast('Enregistré');
      navigation.goBack();
    }
  }

  function handleEanChange(t) {
    const d = (t || '').replace(/\D/g, '');
    setEanInput(d);
    const norm = d.length >= 12 ? normalizeEAN13(d.slice(0,13)) : '';
    setEan13(norm || '');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader title="Détail produit" />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={[text.h1, { marginBottom: 12 }]}>Modifier</Text>

        <View style={[cardStyle, { marginBottom: 12 }]}>
          <Text style={text.label}>Nom</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Nom du produit" style={styles.input} placeholderTextColor={colors.muted} />
          <Text style={[text.label, { marginTop: 8 }]}>EAN-13</Text>
          <TextInput value={eanInput} onChangeText={handleEanChange} placeholder="EAN-13" keyboardType="number-pad" style={styles.input} maxLength={13} placeholderTextColor={colors.muted} />
        </View>

        {ean13 ? (
          <View style={[cardStyle, { alignItems: 'center' }]}>
            <BarcodeView value={ean13} format="EAN13" />
          </View>
        ) : (
          <Text style={text.hint}>Saisissez 12 ou 13 chiffres.</Text>
        )}

        <Pressable onPress={save} style={styles.saveBtn}><Text style={styles.saveText}>Enregistrer</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8,
    fontFamily: fonts.body, fontSize: 15, color: colors.text, marginTop: 4,
  },
  saveBtn: { marginTop: 12, backgroundColor: colors.dark, paddingVertical: 10, borderRadius: 10, alignItems:'center' },
  saveText: { color: '#fff', fontFamily: fonts.heading, fontWeight: '700' },
});
