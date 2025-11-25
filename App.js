import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
// import { initDB } from './src/database/db'; 

import Diario from './src/screens/Diario';
import Frases from './src/screens/Frases';
import Home from './src/screens/Home';

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    try {
    } catch (e) {
      console.log('Banco já iniciado');
    }
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false, 
          
          tabBarActiveTintColor: '#FF69B4',
          tabBarInactiveTintColor: '#D1C4E9',

          tabBarStyle: {
            position: 'absolute',
            bottom: 30, 
            left: 20,
            right: 20,
            height: 65, 
            borderRadius: 35,
            backgroundColor: '#ffffff',
            
            shadowColor: '#FF69B4',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 5,
            
            borderTopWidth: 0, 
            paddingTop: 0, 
            paddingBottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          },

          tabBarItemStyle: {
            height: '100%', 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingVertical: 0, 
          },

          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Frases') {
              iconName = focused ? 'sparkles' : 'sparkles-outline'; 
            } else if (route.name === 'Diário') {
              iconName = focused ? 'heart' : 'heart-outline';
            }

            return (
              <View style={{
                backgroundColor: focused ? '#FFF0F5' : 'transparent', 
                width: 50, 
                height: 50, 
                borderRadius: 25, 
                alignItems: 'center', 
                justifyContent: 'center',
                top: Platform.OS === 'ios' ? 10 : 0 
              }}>
                <Ionicons name={iconName} size={28} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Início" component={Home} />
        <Tab.Screen name="Frases" component={Frases} />
        <Tab.Screen name="Diário" component={Diario} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}