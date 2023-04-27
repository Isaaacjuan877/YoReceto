import { StyleSheet, Text, View,Image ,ScrollView,FlatList,Button,TouchableOpacity,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import  firebase  from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import React,{useState,useEffect} from 'react'
import CategoriasBotones from '../components/categoriasBotones';
import FooterYR from '../components/footerYR';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const dataCategorias =[
  {
    id:"1",
    icon:"leaf",
    title:"Vegetarianas",
    screen: "RecetarioVegetariano"
  },
  {
    id:"2",
    icon:"tree",
    title:"Vegana",
    screen: "RecetarioVegano"
  },
  {
    id:"3",
    icon:"heartbeat",
    title:"Comida sana",
    screen: "RecetarioSano"
  },
  {
    id:"4",
    icon:"birthday-cake",
    title:"Postres",
    screen: "RecetarioPostres"
  },
  {
    id:"5",
    icon:"glass",
    title:"Bebidas",
    screen: "RecetarioBebidas"
  },
]


const Home = () => {

  const [recipes, setRecipes] = useState([]);
  const [topRecipes, setTopRecipes] = useState([]);

  useEffect(() => {
    const recipesRef = firestore().collection('recetario');
    const unsubscribe = recipesRef.orderBy('likes', 'desc').limit(5)
      .onSnapshot(querySnapshot => {
        const recipes = [];
        querySnapshot.forEach((documentSnapshot, index) => {
          recipes.push({
            id: documentSnapshot.id,
            posicion: index + 1,
            ...documentSnapshot.data(),
          });
        });
        setTopRecipes(recipes);
      }, error => console.log(error));
    
    // return the unsubscribe function to stop listening to updates when the component unmounts
    return () => unsubscribe();
  }, []);
  

 const navigation = useNavigation();
 /*const handleDB = ()=>{
  navigation.navigate('DB')
  <Button title='base de datos' onPress={handleDB}/>
   
 } */ 
 const handleCook = recipe => {
  navigation.navigate('Receta', { recipe });
};


 
 return (
    <View style={styles.container}>
      
        <View style={styles.SubContainer}>
          
          <View>
            <View style={styles.SecCat}>
              <Text style={styles.titleSecCat}>Categorias</Text>
              <Text>...</Text>
            </View>
            
            <FlatList horizontal
              data={dataCategorias}
              renderItem={({item})=> <CategoriasBotones title={item.title} icon={item.icon}  screen={item.screen}/>}
            /> 
          </View>
        
        
        </View>
        <Text style={{color:'black',fontSize:18,fontWeight:'bold', marginTop:20, marginBottom:20}}>Top 5 Recetas con mas likes</Text>
        <ScrollView style={{width:'95%'}}>  

        
         <View style={styles.topRec}>
                    
          {topRecipes.map((recipe, index) => (
            
            <View style={{ flexDirection: 'row', alignItems: 'center', padding:20}} key={recipe.id}>
               {(() => {
                  switch (index) {
                    case 0:
                      return <Icon name='numeric-1-circle' size={50} color='black' />;
                    case 1:
                      return <Icon name='numeric-2-circle' size={50} color='black' />;
                    case 2:
                      return <Icon name='numeric-3-circle' size={50} color='black' />;
                    case 3:
                      return <Icon name='numeric-4-circle' size={50} color='black' />;
                    case 4:
                      return <Icon name='numeric-5-circle' size={50} color='black' />;
                    default:
                      return null;
                  }
                })()}
              <View style={{ flex: 1 }}>
              
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, width:'80%', marginLeft:10}}>
                <Image source={{ uri: recipe.image }} style={{ width: 50, height: 50, marginRight: 10 }} />
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 , flexWrap:'wrap' }}>{recipe.label}</Text>
                </View>
                <Text style={{ color: 'black', marginBottom: 5, marginLeft:10 }}>Autor: {recipe.source}             likes {recipe.likes} </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ color: 'black' , marginLeft:10 }}>Calorías: {Math.round(recipe.calories)}</Text>
                  <Text style={{ color: 'black' }}>Proteína: {Math.round(recipe.totalNutrients.PROCNT.quantity)}g</Text>
                  
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                 
                  <Text style={{ color: 'black', marginLeft:10  }}>Grasa: {Math.round(recipe.totalNutrients.FAT.quantity)}g</Text>
                </View>
                <Button title="A cocinar" color="red" onPress={() => handleCook(recipe)} />
              </View>
            </View>
          ))} 
          
        </View>  
        <FooterYR/>
        </ScrollView>
        
      
      
    </View>
  );
};



export default Home

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    backgroundColor:'white',
  },
  SubContainer:{
    width:'90%',
    
    backgroundColor:'white',
    marginTop:20,
    marginLeft:10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
     
  },
  topRec:{
    
    width:'95%',
    
    backgroundColor:'white',
    marginTop:20,
    marginLeft:10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
     
  },
  SecCat: {
    
    justifyContent:'space-between',
    flexDirection:'row',
    marginBottom:10,
    padding:5,
    
  },
  titleSecCat: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'black',
    
    
  },
  buscadorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  inputBuscador: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  iconoBuscador: {
    padding: 10,
  },

})