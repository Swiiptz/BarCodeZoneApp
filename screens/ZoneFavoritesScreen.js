import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import AppHeader from '../components/AppHeader';
import { loadArray, saveArray, ZONE_FAV_KEY } from '../utils/storage';
import BarcodeView from '../components/BarcodeView';
import { colors, text, card as cardStyle, fonts } from '../utils/theme';

export default function ZoneFavoritesScreen() {
  const [items, setItems] = useState([]);

  async function refresh() {
    const arr = await loadArray(ZONE_FAV_KEY);
    setItems(arr);
  }
  useEffect(() => { refresh(); }, []);

  async function remove(id) {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    await saveArray(ZONE_FAV_KEY, next);
  }

  const renderItem = ({ item }) => (
    <View style={[cardStyle, styles.card]}>
      <Text style={[text.body, styles.label]}>{item.label}</Text>
      <BarcodeView value={item.code} format="CODE128" />
      <View style={styles.row}>
        <Pressable onPress={() => remove(item.id)} style={styles.delBtn}><Text style={styles.delText}>Supprimer</Text></Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <AppHeader title="Favoris · Zones" />
      <View style={{ padding: 12, flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[text.hint, { textAlign: 'center', marginTop: 16 }]}>Aucun favori pour l’instant.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, alignItems: 'center' },
  label: { fontFamily: fonts.heading, fontWeight: '700', marginBottom: 8, color: colors.text },
  row: { flexDirection:'row', justifyContent:'flex-end', alignSelf: 'stretch', marginTop: 8 },
  delBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  delText: { color: '#991b1b', fontFamily: fonts.heading, fontWeight: '700' },
});
