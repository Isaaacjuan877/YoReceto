/* import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,Button,TouchableOpacity, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import FotoProv from '../prov/fotoprov.png';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
const RecetasFavoritas = () => {
    const [dataRg, setDataRg] = useState([]);
    // recetas guardadas
       useEffect(() => {
        const recipeRef = firestore().collection('recetasGuardadas');
      
        const unsubscribe = recipeRef.onSnapshot((snapshot) => {
          const recipeCount = {};
          snapshot.forEach((doc) => {
            const recipeId = doc.data().recetaId;
            recipeCount[recipeId] = recipeCount[recipeId] ? recipeCount[recipeId] + 1 : 1;
          });
      
          const recipeArray = Object.keys(recipeCount).map(async (recipeId) => {
            const recipeDoc = await firestore().collection('recetario').doc(recipeId).get();
            const recipeName = recipeDoc.data().label;
            return {
              recipeId,
              label: recipeName,
              count: recipeCount[recipeId],
            };
          });
      
          Promise.all(recipeArray).then((results) => {
            const sortedRecipeArray = results.sort((a, b) => b.count - a.count);
            const chartDataRg = sortedRecipeArray.slice(0, 3).map((recipe) => ({
              label: recipe.label,
              count: recipe.count,
            }));
            setDataRg(chartDataRg);
          });
        });
      
        return () => unsubscribe();
      }, []);
      
      const chartDataRd = {
        labels: dataRg.map((item) => item.label.slice(0, 15)),
        datasets: [
          {
            data: dataRg.map((item) => item.count),
          },
        ],
      }; 
  return (
    <View style={styles.container}>
        <Text style={styles.tlAnaliticas}>Top 3 rcetas mas guardadas</Text>
             {dataRg.length > 0 ? (
                <View style={styles.rctLikes}>
                         
                         
                         <LineChart
                             data={chartDataRd}
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
export default RecetasFavoritas */