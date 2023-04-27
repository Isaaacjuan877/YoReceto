
import React , {useEffect, useState}from 'react';
import { View, Text, Image, ScrollView,Button, Modal, SafeAreaView,TextInput ,FlatList,TouchableOpacity,StyleSheet,StatusBar,Linking, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import arrowleft from '../icons/left-arrow.png'
import FotoProv from '../prov/fotoprov.png';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database'
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import WebView from 'react-native-webview';
import axios from 'axios';

const RecetasBebidas = ({ route }) => {
    const { recipe } = route.params;
    const navigation = useNavigation();
    const [isSaved, setIsSaved] = useState(false);
    
    
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [showPanel, setShowPanel] = useState(false);
    const [showPanelComent, setShowPanelComent] = useState(false);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [reportedComments, setReportedComments] = useState([]);
    const handleGoBack = () => {
      navigation.navigate('Recetario');
    };
    
    
  
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    //http://www.edamam.com/ontologies/edamam.owl#recipe_0550004eb9c4a55fcfb64271d984eb09
    //http://www.edamam.com/ontologies/edamam.owl#recipe_6e2166a21a489a3eaaa2ee904920a3e1
    // Consulta la colección de comentarios y actualiza el estado con los comentarios existentes
    
    useEffect(() => {
      const encodedUrl = encodeURIComponent(recipe.uri);
      const unsubscribe = firestore()
        .collection('comentarios')
        .where('recetaId', '==', encodedUrl)
        .onSnapshot((querySnapshot) => {
          const commentsList = [];
          querySnapshot.forEach((documentSnapshot) => {
            const commentData = documentSnapshot.data();
            commentsList.push({
              id: documentSnapshot.id,
              text: commentData.text,
              userId: commentData.userId,
              userName: commentData.userName,
              fecha: commentData.fecha,
            });
          });
          setComments(commentsList);
        }, (error) => {
          console.log('Error al cargar los comentarios:', error);
        });
      return unsubscribe;
    }, [recipe.uri]);
  
    const handleSend = async () => {
      const user = auth().currentUser;
      const encodedUrl = encodeURIComponent(recipe.uri);
      if (!user) {
        console.log('Usuario no autenticado');
        return;
      }
    
      const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
      const userData = userDoc.data();
    
      firestore()
        .collection('comentarios')
        .add({
          text: text,
          recetaId: encodedUrl,
          userId: user.uid,
          userName: userData.nombre,
          fecha: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
          console.log('Comentario enviado');
          setText('');
        })
        .catch((error) => {
          console.log('Error al enviar comentario:', error);
        });
    };
    const checkIfSaved = async () => {
      const user = auth().currentUser;
      if (user) {
        const savedRecipesRef = firestore()
          .collection('recetasGuardadas')
          .where('userId', '==', user.uid)
          .where('uri', '==', recipe.uri);
        const savedRecipesSnapshot = await savedRecipesRef.get();
        setIsSaved(!savedRecipesSnapshot.empty);
      }
    };
    
    useEffect(() => {
      checkIfSaved();
    }, [recipe.uri]);
    
    const handleBookmarkPress = async () => {
      const user = auth().currentUser;
      const encodedUrl = encodeURIComponent(recipe.uri);
      
      if (user) {
        const savedRecipesRef = firestore()
          .collection('recetasGuardadas');
    
        // Check if the recipe is already saved
        const snapshot = await savedRecipesRef.where('userId', '==', user.uid).where('recetaId', '==', encodedUrl).get();
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            doc.ref.delete();
          });
          setIsSaved(false);
          ToastAndroid.show('Receta eliminada de guardados', ToastAndroid.SHORT);
        } else {
          // Add userId field to recipe object
          const recipeWithUserId = { ...recipe, userId: user.uid, recetaId:encodedUrl  };
          await savedRecipesRef.add(recipeWithUserId);
          setIsSaved(true);
          ToastAndroid.show('Receta guardada', ToastAndroid.LONG);
        }
        
        // Update the savedRecipes state
        checkIfSaved();
      }else{
        ToastAndroid.show('Inicie sesion', ToastAndroid.LONG);
      }
    };
    
    
  
     // Obtener el estado de like actual de la receta cuando se monta el componente
     const obtenerLikeActual = async () => {
        const user = auth().currentUser;
        const encodedUrl = encodeURIComponent(recipe.uri);
        if(user){
            try {
                const recetaSnapshot = await firestore()
                .collection("bebidas")
                .doc(encodedUrl)
                .get();
                const recetaActual = recetaSnapshot.data();
                setLiked(recetaActual.like_user && recetaActual.like_user.includes(user.uid));
            } catch (error) {
                console.error("Error al obtener los likes:", error);
            }
        }
    };
    useEffect(() => {
      
      obtenerLikeActual();
    }, [recipe.uri, auth().currentUser]);
  
    const guardarLike = async () => {
      const encodedUrl = encodeURIComponent(recipe.uri);
      const user = auth().currentUser;
      
      // Verificar si hay una sesión activa
      if (user) {
        // Obtener referencia de la receta
        const recetaRef = firestore().collection("bebidas").doc(encodedUrl);
    
        try {
          // Obtener la receta actual
          const recetaSnapshot = await recetaRef.get();
          const recetaActual = recetaSnapshot.data();
    
          // Comprobar si el usuario ya ha dado like
          let nuevosLikes;
          if (recetaActual.like_user && recetaActual.like_user.includes(user.uid)) {
            nuevosLikes = (recetaActual.likes || 0) - 1;
            // Eliminar el UID del usuario del array de likes_users
            await recetaRef.update({
              likes: nuevosLikes,
              like_user: firestore.FieldValue.arrayRemove(user.uid)
            });
            setLiked(false);
          } else {
            // Obtener el número actual de likes y aumentarlo en 1
            nuevosLikes = (recetaActual.likes || 0) + 1;
            // Añadir el UID del usuario al array de likes_users
            await recetaRef.update({
              likes: nuevosLikes,
              like_user: firestore.FieldValue.arrayUnion(user.uid)
            });
            setLiked(true);
          }
    
          console.log("Like guardado exitosamente");
          obtenerLikeActual(); // Actualizar el estado de liked después de guardar el like
        } catch (error) {
          console.error("Error al guardar el like:", error);
        }
      }else{
        ToastAndroid.show('Inicie sesion', ToastAndroid.LONG);
      }
    };
    useEffect(() => {
      const encodedUrl = encodeURIComponent(recipe.uri);
      const unsubscribe = firestore()
        .collection("bebidas")
        .doc(encodedUrl)
        .onSnapshot((doc) => {
          const data = doc.data();
          setLikes(data.likes);
        });
  
      return () => unsubscribe();
    }, [recipe.uri]);
    
    const getRelatedVideos = async () => {
      const API_KEY = 'AIzaSyCr5vWvRtgxAabHIRkFOy5-7cSBTADZrvU';
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${recipe.label}&key=${API_KEY}&maxResults=5`
        );
        setRelatedVideos(response.data.items);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      getRelatedVideos();
    }, []);
    const togglePanel = () => {
      setShowPanel(!showPanel);
    };
    const togglePanelComent = () => {
      setShowPanelComent(!showPanelComent);
    };
    
    const handleReportComment = async (commentId) => {
      const reportRef = firestore().collection('reportComments').doc(commentId);
      const reportDoc = await reportRef.get();
    
      if (!reportDoc.exists) {
        reportRef.set({ commentId, reportCount: 1 });
        setReportedComments((prevReportedComments) => [...prevReportedComments, commentId]);
      } else {
        const data = reportDoc.data();
        const reportCount = data.reportCount;
        if (reportCount > 1) {
          reportRef.update({ reportCount: firebase.firestore.FieldValue.increment(-1) });
        } else {
          reportRef.delete();
        }
        setReportedComments((prevReportedComments) => prevReportedComments.filter((id) => id !== commentId));
      }
    };
  
    const renderItem = ({ item }) => {
    
      const user = auth().currentUser;
      const isRec = item.recetaId === recipe.uri;
      const isReported = reportedComments.includes(item.id);
  
      return (
        <View style={styles.message}>
          <Image style={styles.userPhoto} source={FotoProv} />
          <View style={styles.messageContent}>
          <View style={styles.nameContainer}>
            
            
            {user && (
              <>
                <Text style={styles.userName}>{item.userName}</Text>
                {!isReported ? (
                  <Text onPress={() => handleReportComment(item.id)}  style={{ color:"black" }} > Reportar  <Icon name="flag" size={16} color="#000" /></Text> 
                ) : (
                  <Text  onPress={() => handleReportComment(item.id)} style={{ color:"black" }} > Quitar reporte <Icon name="flag" size={16} color="red" /></Text>
                )}
              </>
            )}
              </View>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
      );
    };
    const lastTenComments = comments.slice(Math.max(comments.length - 10, 0));
    const renderInput = () => {
      const user = auth().currentUser;
      if (!user) {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.notLoggedInText}>Por favor, inicie sesión para comentar</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu comentario"
              onChangeText={(text) => setText(text)}
              value={text}
            />
            <Button title="Enviar" onPress={handleSend} />
          </View>
        );
      }
    };
    return (
       <View>
        <StatusBar backgroundColor="transparent" />
        
          <View>
            <View style={{ backgroundColor: 'red' }}>
              <TouchableOpacity style={styles.btnback} onPress={handleGoBack}>
                <View style={styles.iconBorder}>
                  <Image style={styles.iconBack} source={arrowleft} />
                </View>
                <Text style={styles.btnbackText}> Atras </Text>
              </TouchableOpacity>
            </View>
  
          </View>
          
        <ScrollView style={{marginBottom:50}}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.labelRecetaContent}>
              <Text style={styles.labelReceta}>{recipe.label}</Text>
            </View>
  
          </View>
          <View style={styles.imgContent}>
            <Image style={styles.imgReceta} source={{ uri: recipe.image }} />          
          </View>
          <View style={styles.infoContent}>
            <View style={styles.iconContainer}>
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconBorder} onPress={guardarLike} >
                {liked ? (<Icon name='heart' style={styles.icon}  />) :
                (<Icon name='heart-outline' style={styles.icon}  />)}
                </TouchableOpacity>
                <Text style={styles.iconText}>{likes}</Text>
                <TouchableOpacity style={styles.iconBorder} onPress={handleBookmarkPress} >
                  
                {isSaved ? (
                  <Icon name="bookmark" style={styles.icon} />
                ) : (
                  <Icon name="bookmark-outline" style={styles.icon} />
                )}
                </TouchableOpacity>
                </View>
              </View>
              <Button style={{with:'100%'}} title="Videos relacionados con esta receta" color={'red'} onPress={togglePanel} />
            <View style={styles.infoReceta}>
            
              
              <Text style={styles.info}>Categoría: {recipe.category}</Text>
              <Text style={styles.info}>Tiempo de preparación: {recipe.totalTime} minutos</Text>
              <Text style={styles.info}>Porciones: {recipe.yield}</Text>
              <Text style={styles.info}>Ingredientes:</Text>
              {recipe.ingredientLines.map(ingredient => (
                <Text style={styles.info} key={ingredient}>{'\u2022'} {ingredient}</Text>
              ))}
              <Text style={styles.info}>Pasos:</Text>
            {recipe.totalSteps  ? (
              recipe.totalSteps.map(step => (
                <Text key={step} style={{ marginBottom: 5, color: 'black' , textAlign:'justify'}}>
                 {step}
                </Text>
              ))
            ) : (
              <Text style={{ color: 'black' }}>No hay pasos disponibles para esta receta.</Text>
            )}
              
                
              <TouchableOpacity style={{alignItems:'center', backgroundColor:'red', width:'100%',padding:7,marginTop:20,}} onPress={togglePanelComent}>
              
              <Text style={{color:'white',fontSize:15,fontWeight:'bold'}}>Ver Comentarios</Text>
            </TouchableOpacity>
            </View>
            
          </View>
              <View>
              
              </View>
  
              <Modal visible={showPanelComent} animationType="slide">
                
                    <View>
                      <View style={{ backgroundColor: 'red' }}>
                        <TouchableOpacity style={styles.btnback} onPress={togglePanelComent}>
                          <View style={styles.iconBorder}>
                            <Image style={styles.iconBack} source={arrowleft} />
                          </View>
                          <Text style={styles.btnbackText}> Cerrar comentarios </Text> 
                        </TouchableOpacity>
                      </View>
  
                    </View>
                
                  {renderInput()}
                    
                    
                      
                  <FlatList style={{ borderBottomColor:'red'}}
                      data={lastTenComments}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      
                    />
                    
                    
                
               
              </Modal>
  
          </ScrollView>
                  
          <View>
        
        <Modal visible={showPanel} animationType="slide">
          
          <View style={styles.panel}>
            <View style={{width:'100%'}}> 
            <Text style={{ fontSize: 18, marginBottom: 10 , color:'black'}}>Videos relacionados:</Text>
                  <FlatList
                    data={relatedVideos}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item.id.videoId}`)}>
                        <View
                          style={{
                            
                            flexDirection: 'row',
                            marginHorizontal: 10,
                            marginVertical: 5,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 10,
                            padding: 10,
                            color:'black',
                            
                          }}
                        > 
                          <Image source={{ uri: item.snippet.thumbnails.medium.url }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                          <View style={{flexWrap:'wrap'}}>
                            <View style={{ width:'80%' ,marginHorizontal: 10,color:'black',  }}>
                              <Text style={{ fontWeight: 'bold', fontSize: 12,color:'black' }}>{item.snippet.title}</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.videoId}
                  />
                  </View>
            <Button title="Cerrar" color={'red'} onPress={togglePanel} />
          </View>
        </Modal>
      </View>
  
                  
            
                  
                  {/* <CommentSection/> */}
                
                
              
            
          
          
          
        </View>
      
        
      
    );
  };
  
  const styles=StyleSheet.create({
   
    
    btnback: { 
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:'red',
      padding:10,
      width:300,
    },
    iconBorder:{
      borderRadius:40,
      backgroundColor:'white',
      width:40,
      height:40,
    },
    iconBack:{
      width:20,
      height:20,
      margin:10,
    },
    btnbackText:{
      color:'black',
      fontWeight:'bold',
      fontSize:20,
      marginLeft:10,
      
  },
    labelRecetaContent:{
      alignItems:'center',
      backgroundColor:'red',
      borderRadius:20,
      padding:5,
      width:'80%',
      marginTop:20,
      /* 
       Sombras
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00, 
      elevation: 24,
      */
    },
    labelReceta:{
      textAlign:'center',
      color:'black',
      fontSize:32,
      fontWeight:'bold',
    },
    imgContent:{
      alignItems:'center'
    },
    imgReceta:{
      width: '80%',
      height: 200,
      borderRadius:20,
      marginTop:20,
    },
    infoContent:{
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignItems:'center',
      marginTop:20,
      paddingBottom:20
    },
    infoReceta:{
      width:'80%',
      alignItems:'baseline',
      padding:5,
    },
    autor:{
      color:'black',
      fontSize:17,
      fontWeight:'700',
    },
    info:{
      color:'black',
      margin:2,
      textAlign:'justify'
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: -20,
      padding: 20,
      backgroundColor: '#F6F6F6',
      borderRadius: 10,
    },
    icon: {
      marginRight: 10,
      color: '#707070',
      fontSize: 20,
    },
    iconSelected: {
      marginRight: 10,
      color: '#F73B3B',
      fontSize: 20,
    },
    iconBorder:{
      borderRadius: 40,
      backgroundColor: 'white',
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    iconText: {
      color: '#666',
      fontSize: 12,
      marginTop: 5,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#EEE',
    },
    input: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      backgroundColor: '#FFF',
      borderRadius: 20,
      marginRight: 10,
      color:'black'
    },
    notLoggedInText: {
      fontStyle: 'italic',
      color: 'black',
    },
    messagesList: {
      flex: 1,
      padding: 10,
      color:'black'
    },
   
    
    
    
    userName: {
      fontWeight: 'bold',
      marginBottom: 5,
      color:'black'
    },
    messageText: {
        color:'black',
    },
    userPhoto: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    message: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-end',
        color:'black'
      },
      userMessage: {
        flexDirection: 'row-reverse',
        marginBottom: 20,
        alignItems: 'flex-end',
      },
      otherMessage: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-end',
        marginLeft: 10,
      },
      messageContent: {
        flex: 1,
        borderRadius: 10,
        padding: 10,
      },
      userMessageContent: {
        backgroundColor: '#DCF8C6',
        marginLeft: 50,
        marginRight: 10,
      },
      otherMessageContent: {
        backgroundColor: '#EEE',
        marginRight: 50,
        marginLeft: 10,
      },
      nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
  
  })
export default RecetasBebidas
