// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ZoneBarcodeScreen from './screens/ZoneBarcodeScreen';
import ProductBarcodeScreen from './screens/ProductBarcodeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ZoneFavoritesScreen from './screens/ZoneFavoritesScreen';
import ProductFavoritesScreen from './screens/ProductFavoritesScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';

const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#ffffff' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Onglets (affichés via TopTabs dans chaque écran) */}
          <Stack.Screen name="Code Barre Zone" component={ZoneBarcodeScreen} />
          <Stack.Screen name="Code Barre Produit" component={ProductBarcodeScreen} />
          <Stack.Screen name="Paramètres" component={SettingsScreen} />

          {/* Favoris */}
          <Stack.Screen name="Favoris Zones" component={ZoneFavoritesScreen} />
          <Stack.Screen name="Favoris Produits" component={ProductFavoritesScreen} />

          {/* Détail produit */}
          <Stack.Screen name="Détail Produit" component={ProductDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
