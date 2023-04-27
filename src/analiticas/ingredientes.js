/* import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,Button,TouchableOpacity, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import FotoProv from '../prov/fotoprov.png';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const Ingredientes = () => {
    const [dataIng, setDataIng] = useState([]);
    // ingredientes que mas se repiten
    useEffect(() => {
        const fetchData = async () => {
          const recipesSnapshot = await firestore()
            .collection('recetario')
            .get();
      
          // Crear un objeto con los ingredientes y su conteo
          const ingredientCount = {};
          recipesSnapshot.forEach((doc) => {
            doc.data().ingredients.forEach((ingredient) => {
              const ingredientName = ingredient.food && ingredient.food.toLowerCase(); // Obtener el nombre del ingrediente y convertirlo a minúsculas
              ingredientCount[ingredientName] = ingredientCount[ingredientName] ? ingredientCount[ingredientName] + 1 : 1;
            });
          });
      
          // Convertir el objeto en un array de objetos para poder ordenarlo
          const ingredientArray = Object.keys(ingredientCount).map((ingredient) => ({
            ingredient,
            count: ingredientCount[ingredient],
          }));
      
          // Ordenar el array por conteo descendente
          ingredientArray.sort((a, b) => b.count - a.count);
      
          // Tomar los primeros 3 ingredientes y crear un array de datos para la gráfica
          const chartDataIng = ingredientArray.slice(0, 3).map((ingredient) => ({
            label: ingredient.ingredient,
            data: [ingredient.count],
          }));
      
          setDataIng(chartDataIng);
        };
      
        fetchData();
      }, []);
      
      const chartDataIn = {
        labels: dataIng.map((item) => item.label),
        datasets: [
          {
            data: dataIng.map((item) => item.data),
          },
        ],
      }; 
  return (
    <View style={styles.container}>
     
      {dataIng.length > 0 ? (
                        <View style={styles.rctLikes}>
                         <Text style={styles.tlAnaliticas}>Top 3 ingredientes mas comunes en las recetas</Text>
                        
                         <LineChart
                             data={chartDataIn}
                             width={400}
                             height={220}
                             yAxisSuffix=" veces"
                             chartConfig={{
                               backgroundColor: '#e26a00',
                               backgroundGradientFrom: '#fb8c00',
                               backgroundGradientTo: '#ffa726',
                               decimalPlaces: 0,
                               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                               labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                               style: {
                                 borderRadius: 16,
                               },
                               propsForDots: {
                                 r: '6',
                                 strokeWidth: '2',
                                 stroke: '#ffa726',
                               },
                             }}
                             bezier
                             style={{
                               marginVertical: 8,
                               borderRadius: 16,
                             }}
                           />  
                     </View>
                      ) : (
                        <Text>Loading...</Text>
                      )}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        paddingTop:30,
      flex: 1,
      alignItems: 'center',
      
    },
    admcontainer: {
      width:'95%',
      alignItems: 'center',
     
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color:'black'
    },
    email: {
      fontSize: 16,
      marginBottom: 20,
      color:'black'
    },
    btnCerrar:{
        width:150,
        backgroundColor:'red',
        alignContent:'center',
        justifyContent:'center',
        height:50,
        borderRadius:20

    },
    txtCerrar:{
        textAlign:'center',
        color:'black',
        fontSize:16,
        fontWeight:'bold'
    },
    rctLikes:{
      marginTop:20,
      width:'90%',

    },
    titleAnaliticas:{
      fontSize:17,
      fontWeight:'bold',
      textAlign:'left',
      color:'black',
      marginBottom:20,
    },
    tlAnaliticas:{
    fontFamily: 'courier',
      fontSize:40,
      fontWeight:'bold',
      textAlign:'center',
      color:'black',
      marginBottom:20,
    },

  });
export default Ingredientes */