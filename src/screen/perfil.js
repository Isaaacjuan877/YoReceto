import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,Button,TouchableOpacity, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import FotoProv from '../prov/fotoprov.png';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
const Perfil = () => {
  
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState([]);
  const [dataRg, setDataRg] = useState([]);
  const [dataIng, setDataIng] = useState([]);
  // Obtener lodatos del la sesion
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
        setUser({ ...userDoc.data(), uid: user.uid });
        const userDocAdm = await firestore().collection('Usuarios').doc(user.uid).get();
          const isAdmin = userDocAdm.data().isAdmin;
          if (isAdmin) {
            setAdmin(true);
            
          } else {
           
            setAdmin(false);
          }
        
      } else {
        setUser(null);
       
      }
    });
  
    return unsubscribe;
  }, []);
  // Conocer si la sesion es admin o usuario final
  
    // cerrar sesion
      const handleSignOut = async () => {
        try {
          await auth().signOut();
          ToastAndroid.show('Cerrado correctamente', ToastAndroid.LONG);
          console.log('Cerrado correctamente');
          navigation.navigate('Inicio');
        } catch (error) {
          console.error(error);
        }
      };
      // recetas con mas likes
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
      

      if (!user) {
        return (
          <View style={styles.container}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>Por favor inicie sesión</Text>
          </View>
        );
      }
    
      return (
        <View style={styles.container}>
         
           {!admin ? (
              <>
              <Image style={styles.avatar} source={FotoProv} />
                <Text style={styles.name}>{user.nombre} {user.apellido}</Text>
                <Text style={styles.email}>{user.correo}</Text>
                <Button title="Cerrar sesión" onPress={handleSignOut} />
              
              </>
             ) : (
                <>
                   <ScrollView >
                    <View style={styles.admcontainer}>
                  <Image style={styles.avatar} source={{uri:'https://thumbs.dreamstime.com/b/el-grunge-texturiz%C3%B3-sello-del-admin-133645421.jpg'}} />
                  <Text style={styles.name}>{user.nombre} {user.apellido}</Text>
                  <Text style={styles.email}>{user.correo}</Text>
                  <Button title="Cerrar sesión" onPress={handleSignOut} />
                 
                  
                  {data.length > 0 ? (
                    <View style={styles.rctLikes}>
                      <Text style={styles.titleAnaliticas} >Analiticas</Text>
                      <Text style={styles.tlAnaliticas}>Top 3 recetas con mas likes </Text>
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
                      {dataRg.length > 0 ? (
                <View style={styles.rctLikes}>
                         <Text style={styles.tlAnaliticas}>Top 3 rcetas mas guardadas</Text>
                         
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
              </ScrollView>
             </>
             )}
             
        </View>


  );
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
      fontSize:17,
      fontWeight:'bold',
      textAlign:'center',
      color:'black',
      marginBottom:20,
    },

  });

export default Perfil;
