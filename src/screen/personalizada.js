

import React, { useState, } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
export default function Personalizada() {
  
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  const searchRecipes = async () => {
    const includedIngredients = query.toLowerCase().split(',').map((ingredient) => ingredient.trim());
    
    // llamar las recetas de la colleccion "recetario" 
    const recipesCollection = firestore().collection('recetario');
    const snapshot = await recipesCollection.get();
    // filtro de recetas de acuerdo a los ingredientes ingresados
    const filteredRecipes = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((recipe) => {
        const recipeIngredients = recipe.ingredients.map((i) => i.food && i.food.toLowerCase());
        return includedIngredients.some((ingredient) => recipeIngredients.includes(ingredient));
      });
    
    setRecipes(filteredRecipes);
  };

  const handleSearch = () => {
    searchRecipes();
  };

  const handleDetails = (recipe) => {
    navigation.navigate('RecetaPersonalizada', { recipe });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* campo donde se digitan los ingredientes */}
      <TextInput
        placeholderTextColor="grey"
        placeholder="Ingresa tus ingredientes separados por comas"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, color: 'black' }}
      />
      <Button title="Buscar recetas" color={'red'} onPress={handleSearch} />
      {/* Se agregan los resultados de la busqueda */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDetails(item)}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: 100, height: 100, marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>{item.label}</Text>
                <Text style={{ color: 'black' }}>{item.source}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'black' }}>Calorías: {Math.round(item.calories)}</Text>
                  <Text style={{ color: 'black' }}>
                    Proteína: {Math.round(item.totalNutrients.PROCNT.quantity)}g
                  </Text>
                  <Text style={{ color: 'black' }}>Grasa: {Math.round(item.totalNutrients.FAT.quantity)}g</Text>
                </View>
                <Button title="A Cocinar" color={'red'} onPress={() => handleDetails(item)} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}