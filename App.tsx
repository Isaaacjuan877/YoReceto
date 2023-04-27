import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {DrawerNavigation} from './src/components/dawerNavigation';
/*
  **//* Librerias YoReceto *\\**
  yarn add react-native-vector-icons
  yarn add @react-navigation/native
  yarn add react-native-screens react-native-safe-area-context
  yarn add @react-navigation/native-stack
  yarn add @react-navigation/drawer
  yarn add react-native-gesture-handler react-native-reanimated
  yarn add @rneui/themed @rneui/base

  **//* Librerias de firebase *\\**

  yarn add @react-native-firebase/app
  yarn add @react-native-firebase/auth
  yarn add @react-native-firebase/firestore
  yarn add @react-native-firebase/storage
  yarn add @react-native-firebase/database
  yarn add @react-native-firebase/analytics

  **//* edamam *\\**
  
  yarn add axios
  yarn add react-native-dropdown-picker
*/

const App = () => {
  
  return (
    <NavigationContainer>
      
   <StatusBar
            backgroundColor={'red'}
          /> 

      <DrawerNavigation/>
      
  </NavigationContainer>
  );
}



export default App;
