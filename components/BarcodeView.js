// components/BarcodeView.js
import React from 'react';
import { View, Text } from 'react-native';
import Barcode from 'react-native-barcode-svg';

// format: 'CODE128' ou 'EAN13'
export default function BarcodeView({ value, format = 'CODE128', width = 2, height = 120 }) {
  if (!value) return null;
  try {
    return (
      <View style={{ alignItems: 'center' }}>
        <Barcode value={value} format={format} width={width} height={height} />
        <Text style={{ marginTop: 6, color: '#6b7280' }}>{value}</Text>
      </View>
    );
  } catch (e) {
    return <Text style={{ color: 'red' }}>Impossible d’afficher le code-barres.</Text>;
  }
}
