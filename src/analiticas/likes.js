/* import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,Button,TouchableOpacity, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import FotoProv from '../prov/fotoprov.png';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const Likes = () => {

    const [data, setData] = useState([]);

     
    useEffect(() => {
        const recetasRef = firestore().collection('recetario').orderBy('likes', 'desc').limit(3);
    
        const unsubscribe = recetasRef.onSnapshot((querySnapshot) => {
          const recetasData = querySnapshot.docs.slice(0, 3).map((doc) => doc.data());
          setData(recetasData);
        });
    
        // El return de useEffect es una función que se ejecuta cuando el componente se desmonta
        return () => unsubscribe();
      }, []);

      const chartData = {
        labels: data.map((receta) => receta.label.slice(0, 15)),
        datasets: [
          {
            data: data.map((receta) => receta.likes),
          },
        ],
      }; 
  return (
    <View style={styles.container}>
        <Text style={styles.tlAnaliticas}>Top 3 recetas con mas likes </Text>
        {data.length > 0 ? (
                    <View style={styles.rctLikes}>
                      <Text style={styles.titleAnaliticas} >Analiticas</Text>
                      
                        <LineChart
                            data={chartData}
                            width={400}
                            height={220}
                            yAxisSuffix=" likes"
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
                            propsForLabels: {
                                fontSize: 12,
                                
                                
                            },
                            }}
                            bezier
                        /> 
                      </View> 
                      ) : (
                        <Text>Loading...</Text>
                      )}
    </View>
  )
}

export default Likes

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

  }); */