import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
const Guardados = ({ route  }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        const unsubscribeFirestore = firestore()
        .collection('recetasGuardadas')
        .where("userId", "==", user.uid)
        .onSnapshot(querySnapshot => {
          const savedRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
          setSavedRecipes(savedRecipes);
        });
        return () => unsubscribeFirestore();
      }
    });
    return () => unsubscribeAuth();
  }, []);
  

  const handleRemove = async (id) => {
    const user = auth().currentUser;
    if (user) {
      // Remove the recipe from Firestore
      await firestore()
        .collection('recetasGuardadas')
        .doc(id)
        .delete();
    }
  };
  

  return (
    <View>
      <View style={{ paddingBottom: 100 }}>
        <FlatList
          data={savedRecipes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('RecetaGuardada', { recipe: item.data })}>
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Image
                  source={{ uri: item.data.image }}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{color:'black', fontWeight: 'bold' }}>{item.data.label}</Text>
                  <Text style={{color:'black'}}>{item.data.source}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{color:'black'}}>Calorías: {Math.round(item.data.calories)}</Text>
                    <Text style={{color:'black'}}>Proteína: {Math.round(item.data.totalNutrients.PROCNT.quantity)}g</Text>
                    <Text style={{color:'black'}}>Grasa: {Math.round(item.data.totalNutrients.FAT.quantity)}g</Text>
                  </View>
                  
                  <View style={{flexDirection:'row', justifyContent:'space-around',}}>
                    <Button title="A Cocinar" color={'red'} onPress={() => navigation.navigate('RecetaGuardada', { recipe: item.data })} />
                    <Button title="Eliminar" color={'red'} onPress={() => handleRemove(item.id)} />
                  </View>
                  
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};


export default Guardados;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calories: {
    fontSize: 16,
    marginBottom: 5,
  },
  protein: {
    fontSize: 16,
    marginBottom: 10,
  },
});