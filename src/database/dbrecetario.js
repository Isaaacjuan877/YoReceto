/*
import React, { useEffect,useState } from 'react';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import { View, Text, Image,Button,FlatList,Alert, ScrollView,TouchableOpacity,SafeAreaView } from 'react-native';
const DB = () => {
  const [recipes, setRecipes] = useState([]);
    const APP_ID = '93d655c7'; // Reemplaza con tu APP_ID de Edamam
    const APP_KEY = '1905f1f2ad640b9c8dfb932937d3b167	'; // Reemplaza con tu APP_KEY de Edamam
    const MYMEMORY_API_KEY = 'b9b42ee73ad2809c82a0';
    const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

    const translateWithMyMemory = async (text, sourceLang, targetLang) => {
      try {
        const response = await axios.get(MYMEMORY_API_URL, {
          params: {
            q: text,
            langpair: `${sourceLang}|${targetLang}`,
            key: MYMEMORY_API_KEY,
          },
        });
        return response.data.responseData.translatedText;
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      const searchRecipes = async () => {
        try {
        const response = await axios.get(
            //`https://api.edamam.com/api/recipes/v2?type=public&q=Spanish&app_id=${APP_ID}&app_key=${APP_KEY}&Accept-Language=es`
            //`https://api.edamam.com/api/recipes/v2?type=public&q=vegetarian&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegetarian`
            //`https://api.edamam.com/search?q=vegan&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegetarian`
            //`https://api.edamam.com/search?q=healthy&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegetarian`
            //`https://api.edamam.com/search?q=dessert&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegetarian`
            //`https://api.edamam.com/search?q=drinks&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegetarian`
            );
           
            const recipes = response.data.hits.map(recipe => {
             
              return {
                ...recipe.recipe,
                
                likes: 0,
                like_user: '',
              };
            });
            setRecipes(response.data.hits);
            //const recetasRef = firestore().collection('recetario');
            //const recetasRef = firestore().collection('recetasVegetarianas');
            //const recetasRef = firestore().collection('recetasVeganas');
            //const recetasRef = firestore().collection('recetasSanas');
            //const recetasRef = firestore().collection('postres');
            //const recetasRef = firestore().collection('bebidas');
            
            
        
            recipes.forEach(recipe => {
              const encodedUrl = encodeURIComponent(recipe.uri);
              recetasRef.doc(encodedUrl).set(recipe);
            });
          } catch (error) {
            console.error(error);
          }
        }

    searchRecipes();
    }, []);
    
      return (
        <View>
          <FlatList
          data={recipes}
          keyExtractor={item => item.uri}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCook(item)}>
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Image
                  source={{ uri: item.recipe.image }}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{color:'black', fontWeight: 'bold' }}>{item.recipe.label}</Text>
                  <Text style={{color:'black', fontWeight: 'bold' }}>{item.recipe.source}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{color:'black'}}>Calorías: {Math.round(item.recipe.calories)}</Text>
                    <Text style={{color:'black'}}>Proteína: {Math.round(item.recipe.totalNutrients.PROCNT.quantity)}g</Text>
                    <Text style={{color:'black'}}>Grasa: {Math.round(item.recipe.totalNutrients.FAT.quantity)}g</Text>
                  </View>
                  <Button title="A cocinar"  color= "red" onPress={() => handleCook(item)} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        </View>
      );
    }

export default DB */