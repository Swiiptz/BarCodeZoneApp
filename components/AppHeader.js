// components/AppHeader.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, text } from '../utils/theme';

export default function AppHeader({ title = 'Barcode Zone', subtitle }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.wrap}>
        <Image source={require('../assets/icon.png')} style={styles.icon} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.card, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  icon: { width: 28, height: 28, marginRight: 10, borderRadius: 6 },
  title: { ...text.h2 },
  sub: { ...text.hint, marginTop: 2 },
});
