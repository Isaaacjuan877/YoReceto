

import React, {Fragment, useState, useEffect } from 'react';
import { View, Text, Image,Button,FlatList,Alert, ScrollView,TouchableOpacity,SafeAreaView,StyleSheet,ToastAndroid } from 'react-native';
import  firestore  from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RecetarioSano from '../screen/recetarioSano';
import RecetarioVegetariano from '../screen/recetarioVegetariano';
import RecetarioVegano from '../screen/recetarioVegano';
import RecetarioPostres from '../screen/recetarioPostres';
import RecetarioBebidas from '../screen/recetarioBebidas';
import RecetarioCastellano from '../screen/recetarioCastellano';
export default function PanelDeControl({onChange}) {
  const [recipes, setRecipes] = useState([]);
 
  const navigation = useNavigation();
   // Estado para controlar el componente que se muestra
  const [selectedComponent, setSelectedComponent] = useState(null); 
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let unsubscribe;
  
    if (selectedComponent === null) {
      const collectionRef = firestore().collection('recetario').orderBy('likes', 'desc');
      unsubscribe = collectionRef.onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setRecipes(data);
      }, error => {
        console.log('Error fetching data:', error);
      });
    } else {
      const collectionRef = firestore().collection(selectedComponent).orderBy('likes', 'desc');
      unsubscribe = collectionRef.onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setRecipes(data);
      }, error => {
        console.log('Error fetching data:', error);
      });
    }
  
    return () => {
      unsubscribe();
    };
  }, [selectedComponent]);


  const handleDelete = (recipe) => {
    Alert.alert(
      'Eliminar receta',
      `¿Estás seguro que deseas eliminar la receta "${recipe.label}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const encodedUrl = encodeURIComponent(recipe.uri);
            const collectionPath = selectedComponent ? String(selectedComponent) : 'recetario'; 
            const collectionRef = firestore().collection(collectionPath);
            collectionRef.doc(encodedUrl).delete().then(() => {
              ToastAndroid.show('Receta eliminada', ToastAndroid.SHORT);
              console.log('Receta eliminada');
              // Actualiza la lista de recetas después de eliminar la receta
              setRecipes((prevRecipes) => prevRecipes.filter((r) => r.uri !== recipe.uri));
            }).catch((error) => {
              console.log('Error eliminando la receta:', error);
            });
          },
        },
      ],
      { cancelable: false },
    );
  };
  
 
  const handleRecetario = () => {
      setOpen(!open);
    };
    const handleDesPress = () => {
      setOpen(!open);
    };
  const handleCook = recipe => {
    navigation.navigate('Receta', { recipe });
  };

  const handlePress = componentName => {
    // Actualiza el estado para mostrar el componente seleccionado
    if (typeof componentName === 'string' && componentName.trim() !== '') {
      setSelectedComponent(componentName);
    } else {
      setSelectedComponent(null);
    }
    
  };

  return (
    <View style={styles.container}>
      <View>
      <TouchableOpacity style={styles.headerCat} onPress={() => handleDesPress(null)}>
        <Text style={{ color: 'black' }}>Selecciona una categoría</Text>
        <Icon name="angle-down" size={20} color="#333" />
      </TouchableOpacity>
      </View>

      
        <View style={{ paddingBottom: 120 }}>
          <FlatList
            data={recipes}
            keyExtractor={item => item.uri}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                  <View style={{ flex:1,padding:5 }}>
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 , flexWrap:'wrap' }}>{item.label}</Text>
                    <Text style={{ color: 'black' }}>{item.source}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap:'wrap',padding:5 }}>
                      <Text style={{ color: 'black' }}> {item.likes}   Likes</Text>
                      <Text style={{ color: 'black' }}> # Comentarios </Text>
                      
                    </View>
                    
                    <Button title="Eliminar" color="red" onPress={() => handleDelete(item)}/>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      
       
      

      <View style={styles.menuCategorias}>
          {open && (
            <View>
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('recetario')}>
                <Text style={styles.categoriasText}>Españolas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('recetasSanas')} >
                <Text style={styles.categoriasText}>Sanas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('recetasVegetarianas')}>
                <Text style={styles.categoriasText}>Vegetarianas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('recetasVeganas')}>
                <Text style={styles.categoriasText}>Veganas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('postres')}>
                <Text style={styles.categoriasText}>Postres</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('bebidas')}>
                <Text style={styles.categoriasText}>Bebidas</Text>
              </TouchableOpacity>
    
              
            </View>
          )}
        </View>
    </View>
  );
};
const styles=StyleSheet.create({
  container:{
    position:'relative'
  },
  headerCat:{
    padding:5,
    margin:10,
    flexDirection:'row',
    justifyContent:'space-between',
    borderWidth:2,
    borderColor:'red',
   
   
  },
  menuCategorias:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginTop:5,
    margin:20,
    position: 'absolute',
    zIndex: 2,
    
  top: 40,
  right: 0,
    
  },
  categorias:{
    
    padding:5,
    backgroundColor:'red',
    borderWidth: 2,
    borderColor: 'white',
    
  },
  categoriasText:{
    color:'black',
    fontSize:16,
    fontWeight:'500'
  }
})