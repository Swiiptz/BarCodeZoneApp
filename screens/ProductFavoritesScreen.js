import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import AppHeader from '../components/AppHeader';
import { loadArray, saveArray, PROD_FAV_KEY } from '../utils/storage';
import { colors, text, card as cardStyle, fonts } from '../utils/theme';

export default function ProductFavoritesScreen({ navigation }) {
  const [items, setItems] = useState([]);

  async function refresh() {
    const arr = await loadArray(PROD_FAV_KEY);
    setItems(arr);
  }
  useEffect(() => {
    const unsub = navigation.addListener('focus', refresh);
    return unsub;
  }, [navigation]);

  async function remove(id) {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    await saveArray(PROD_FAV_KEY, next);
  }

  const renderItem = ({ item }) => (
    <Pressable style={[cardStyle, styles.card]} onPress={() => navigation.navigate('Détail Produit', { id: item.id })}>
      <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>…{String(item.ean13).slice(-4)}</Text>
      </View>
      <Pressable onPress={() => remove(item.id)} style={styles.delBtn}>
        <Text style={styles.delText}>Supprimer</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <AppHeader title="Favoris · Produits" />
      <View style={{ padding: 12, flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[text.hint, { textAlign:'center', marginTop: 16 }]}>Aucun favori produit.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  name: { fontFamily: fonts.heading, fontWeight: '700', color: colors.text },
  sub: { color: colors.muted, marginLeft: 8 },
  delBtn: { marginTop: 10, backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' },
  delText: { color: '#991b1b', fontFamily: fonts.heading, fontWeight: '700' },
});
