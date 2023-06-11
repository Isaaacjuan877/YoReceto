
import React, {Fragment, useState, useEffect } from 'react';
import { View, Text, Image,Button,FlatList,Alert, ScrollView,TouchableOpacity,SafeAreaView,StyleSheet } from 'react-native';
import  firestore  from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
const RecetarioVegetariano = () => {
    const [recipes, setRecipes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const collectionRef = firestore().collection('recetasVegetarianas');
        
          const unsubscribe = collectionRef.onSnapshot(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data());
            setRecipes(data);
          }, error => {
            console.log('Error fetching data:', error);
          });
          return () => unsubscribe();
        }, []);
     
      
        
      const handleCook = recipe => {
        navigation.navigate('RecetasVegetarianas', { recipe });
      };
  return (
    <View>
      <View style={{ paddingBottom: 10, marginLeft:10  }}>
          <FlatList
            data={recipes}
            keyExtractor={item => item.uri}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCook(item)}>
                <View style={{ flexDirection: 'row', marginVertical: 5, width:'97%'}}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                  <View style={{ flex:1,padding:5 }}>
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 , flexWrap:'wrap' }}>{item.label}</Text>
                    <Text style={{ color: 'black' }}>{item.source}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap:'wrap',padding:5 }}>
                      <Text style={{ color: 'black' }}>Calorías: {Math.round(item.calories)}</Text>
                      <Text style={{ color: 'black' }}>Proteína: {Math.round(item.totalNutrients.PROCNT.quantity)}g</Text>
                      
                    </View>
                    <Text style={{ color: 'black' }}>Grasa: {Math.round(item.totalNutrients.FAT.quantity)}g</Text>
                    <Button title="A cocinar" color="red" onPress={() => handleCook(item)} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
    </View>
  )
}

export default RecetarioVegetariano

const styles = StyleSheet.create({})