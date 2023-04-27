import React , {useEffect, useState} from 'react';
import { View, Text, Image, 
  ScrollView,Button, Modal, 
  TextInput ,FlatList,TouchableOpacity,
  StyleSheet,StatusBar,Linking, Alert,ToastAndroid } from 'react-native';
import FotoProv from '../prov/fotoprov.png';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database'
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const AdmMensajes = () => {
    const [reportedMessages, setReportedMessages] = useState([]);


    useEffect(() => {
        const messagesRef = database().ref('messages');
        const reportsRef = firestore().collection('reports');
      
        reportsRef.onSnapshot(async querySnapshot => {
          const messages = [];
          const promises = [];
          querySnapshot.forEach(doc => {
            const { messageId } = doc.data();
            const promise = messagesRef.child(messageId).once('value', snapshot => {
              if (snapshot.exists()) {
                const message = snapshot.val();
                messages.push({
                  id: messageId,
                  text: message.text,
                  userName: message.userName,
                  reportCommentId: doc.id,
                });
              }
            });
            promises.push(promise);
          });
          await Promise.all(promises);
          setReportedMessages(messages);
        });
      }, []);
      
      const renderItem = ({ item }) => (
        <View style={{ marginBottom: 10, borderBottomWidth: 1 }}>
          <View style={styles.commentContainer}>
            <Image style={styles.userPhoto} source={FotoProv} />
            <View style={styles.commentContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{item.userName}</Text>
              </View>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
          <View style={{marginBottom: 10, justifyContent:'center',alignContent:'center',alignItems:'center', backgroundColor:'gray'}}>
            <TouchableOpacity onPress={() => deleteMessage(item.id, item.reportCommentId)}>
                <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
        </View>
        </View>
      );
      const deleteMessage = (messageId, reportCommentId) => {
        // Eliminar el mensaje de la colección "messages"
        database().ref(`messages/${messageId}`).remove()
            .then(() => {
                console.log(`Mensaje ${messageId} eliminado correctamente de la base de datos`);
            })
            .catch(error => {
                console.log(`Error eliminando el mensaje ${messageId} de la base de datos: ${error}`);
            });
    
        // Eliminar el registro de la colección "reports"
        firestore().collection('reports').doc(reportCommentId).delete()
            .then(() => {
                console.log(`Registro de reporte ${reportCommentId} eliminado correctamente de la base de datos`);
            })
            .catch(error => {
                console.log(`Error eliminando el registro de reporte ${reportCommentId} de la base de datos: ${error}`);
            });
    };
      
      return (
        <View style={styles.container}>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              padding: 20,
              fontSize: 17,
              paddingTop: 10,
            }}>
            Mensajes reportados por otros usuarios en espera de ser censurados
          </Text>
          <FlatList
            data={reportedMessages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
};
export default AdmMensajes
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20
    },
    commentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    userPhoto: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10
    },
    commentContent: {
      flex: 1
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5
    },
    userName: {
      fontWeight: 'bold',
      marginRight: 5,
      color:'black'
    },
    commentText: {
      fontSize: 16,
      color:'black'
    },
    deleteButton: {
      color: 'red',
      fontWeight: 'bold'
    }
  });