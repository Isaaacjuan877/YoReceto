import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image ,SafeAreaView} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database'
import FotoProv from '../prov/fotoprov.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [reportedMessages, setReportedMessages] = useState([]);
  
    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          // Actualizar el estado de los mensajes con la nueva cuenta
          const ref = firebase.database().ref('messages');
          ref.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const messageList = Object.keys(data).map((key) => ({
                ...data[key],
                id: key,
              }));
              setMessages(messageList.reverse());
            }
          });
        } else {
          // Limpiar el estado de los mensajes
          setMessages([]);
        }
      });
    
      // Devolver una función de limpieza para desuscribirse de los cambios en la cuenta
      return () => unsubscribe();
    }, []);
    const handleSend = async () => {
        const user = auth().currentUser;
        if (!user) {
          console.log('Usuario no autenticado');
          return;
        }
      
        const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
        const userData = userDoc.data();
      
        firebase
          .database()
          .ref('messages')
          .push({
            text: text,
            userId: user.uid,
            userName: userData.nombre,
            fecha: firebase.database.ServerValue.TIMESTAMP
            
          })
          .then(() => {
            console.log('Mensaje enviado');
            setText('');
            
            // Agregar el nuevo mensaje al principio de la lista
          })
          .catch((error) => {
            console.log('Error al enviar mensaje:', error);
          });
      };
  
    const handleRefresh = () => {
      setRefreshing(true);
      const ref = firebase.database().ref('messages');
      ref.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data).map((key) => ({
            ...data[key],
            id: key,
          }));
          setMessages(messageList);
          setRefreshing(false);
        }
      });
    };
   
    const handleReport = async (messageId) => {
      const reportRef = firestore().collection('reports').doc(messageId);
      const reportDoc = await reportRef.get();
    
      if (!reportDoc.exists) {
        reportRef.set({ messageId, reportCount: 1 });
        setReportedMessages((prevReportedMessages) => [...prevReportedMessages, messageId]);
      } else {
        const data = reportDoc.data();
        const reportCount = data.reportCount;
        if (reportCount > 1) {
          reportRef.update({ reportCount: firebase.firestore.FieldValue.increment(-1) });
        } else {
          reportRef.delete();
        }
        setReportedMessages((prevReportedMessages) => prevReportedMessages.filter((id) => id !== messageId));
      }
    };
  
    const renderItem = ({ item }) => {
      const user = auth().currentUser;
      const isUser = item.userId === user?.uid;
      const isReported = reportedMessages.includes(item.id);
      return (
        <View style={[styles.message, isUser ? styles.userMessage : styles.otherMessage]}>
          {!isUser && <Image style={styles.userPhoto} source={FotoProv} />}
          <View style={[styles.messageContent, isUser ? styles.userMessageContent : styles.otherMessageContent]}>
            <View style={styles.nameContainer}>
            {!isUser && (
            <>
              <Text style={styles.userName}>{item.userName}</Text>
              {!isReported ? (
                <Text onPress={() => handleReport(item.id)}  style={{ color:"black" }} > Reportar  <Icon name="flag" size={16} color="#000" /></Text> 
              ) : (
                <Text  onPress={() => handleReport(item.id)} style={{ color:"black" }} color="transparent" > Quitar reporte <Icon name="flag" size={16} color="red" /></Text>
              )}
            </>
          )}
            </View>
            <Text style={styles.messageText}>{item.text}</Text>
            
          </View>
         {isUser && <Image style={styles.userPhoto} source={FotoProv} />}
          
         
        </View>
      );
    };
    
    const renderInput = () => {
      const user = auth().currentUser;
      if (!user) {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.notLoggedInText}>Por favor, inicie sesión para enviar mensajes</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escriba su mensaje"
              onChangeText={(text) => setText(text)}
              value={text}
            />
            <Button title="Enviar" onPress={handleSend} />
          </View>
        );
      }
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
        <FlatList
            style={styles.messagesList}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            
            onRefresh={handleRefresh} // Agregamos la prop onRefresh y le pasamos la función handleRefresh
            refreshing={refreshing} // Agregamos la prop refreshing y le pasamos el estado refreshing
            /> 
        {renderInput()}
        </View>
    </SafeAreaView>
    );
};
export default Chat

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    button: {
      color: 'black',
      borderRadius: 10,
      padding: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#EEE',
    },
    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
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
        flexDirection: 'row',
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
  });
  