

import React, {Fragment, useState, useEffect } from 'react';
import { View, Text, Image,Button,FlatList,Alert, ScrollView,TouchableOpacity,SafeAreaView,StyleSheet } from 'react-native';
import  firestore  from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RecetarioSano from './recetarioSano';
import RecetarioVegetariano from './recetarioVegetariano';
import RecetarioVegano from './recetarioVegano';
import RecetarioPostres from './recetarioPostres';
import RecetarioBebidas from './recetarioBebidas';
import RecetarioCastellano from './recetarioCastellano';
export default function Recetario({onChange}) {
  const [recipes, setRecipes] = useState([]);
 
  const navigation = useNavigation();
   // Estado para controlar el componente que se muestra
  const [selectedComponent, setSelectedComponent] = useState(null); 
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const collectionRef = firestore().collection('recetario');
    const unsubscribe = collectionRef.onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setRecipes(data);
    }, error => {
      console.log('Error fetching data:', error);
    });
    return () => unsubscribe();
  }, []);
 
  
    const handleDesPress = () => {
      setOpen(!open);
    };
  const handleCook = recipe => {
    navigation.navigate('Receta', { recipe });
  };

  const handlePress = componentName => {
    // Actualiza el estado para mostrar el componente seleccionado
    setSelectedComponent(componentName);
    setOpen(!open);
  };

  return (
    <View style={styles.container}>
      <View style={{width:'100%'}}>
      <TouchableOpacity style={styles.headerCat} onPress={() => handleDesPress(null)}>
        <Text style={{ color: 'black' }}>Selecciona una categoría</Text>
        <Icon name="angle-down" size={20} color="#333" />
      </TouchableOpacity>
      </View>

      {selectedComponent === null && ( // Muestra la lista de recetas si no se ha seleccionado ninguna categoría
        <View style={{marginBottom:200, marginLeft:10}}>
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
      )}
      <Fragment >
          <View style={{ paddingBottom: 100}}> 
            {selectedComponent === 'RecetarioCastellano' && <RecetarioCastellano />} 
            {selectedComponent === 'RecetarioSano' && <RecetarioSano />} 
            {selectedComponent === 'RecetarioVegetariano' && <RecetarioVegetariano />} 
            {selectedComponent === 'RecetarioVegano' && <RecetarioVegano />} 
            {selectedComponent === 'RecetarioPostres' && <RecetarioPostres />} 
            {selectedComponent === 'RecetarioBebidas' && <RecetarioBebidas />} 
          </View>
       </Fragment>  
      

      <View style={styles.menuCategorias}>
          {open && (
            <View>
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('RecetarioCastellano')}>
                <Text style={styles.categoriasText}>Españolas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('RecetarioSano')} >
                <Text style={styles.categoriasText}>Sanas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('RecetarioVegetariano')}>
                <Text style={styles.categoriasText}>Vegetarianas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('RecetarioVegano')}>
                <Text style={styles.categoriasText}>Veganas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('RecetarioPostres')}>
                <Text style={styles.categoriasText}>Postres</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('RecetarioBebidas')}>
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
    position:'relative',
    display:'flex',
    
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