import React , {useEffect, useState}from 'react';
import { View, Text, Image, 
  ScrollView,Button, Modal, 
  TextInput ,FlatList,TouchableOpacity,
  StyleSheet,StatusBar,Linking, Alert,ToastAndroid } from 'react-native';
import FotoProv from '../prov/fotoprov.png';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database'
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
const AdmComentarios = () => {
    const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('reportComments')
      .onSnapshot(querySnapshot => {
        const commentRefs = querySnapshot.docs.map(doc => firestore().collection('comentarios').doc(doc.data().commentId));
        Promise.all(commentRefs.map(ref => ref.get()))
          .then(querySnapshots => {
            const data = querySnapshots.map(snapshot => ({ ...snapshot.data(), id: snapshot.id, reportCommentId: querySnapshot.docs.find(doc => doc.data().commentId === snapshot.id).id }));
            setComments(data);
          })
          .catch(error => {
            console.log('Error obteniendo los comentarios:', error);
          });
      });

    return () => unsubscribe();
  }, []);

  const deleteComment = (commentId, reportCommentId) => {
    // Eliminar el comentario correspondiente de la colección "comentarios"
    firestore()
      .collection('comentarios')
      .doc(commentId)
      .delete()
      .then(() => {
        console.log('Comentario eliminado correctamente de comentarios');
      })
      .catch(error => {
        console.log('Error eliminando el comentario de comentarios:', error);
      });

    // Eliminar el documento correspondiente en la colección "reportComments"
    firestore()
      .collection('reportComments')
      .doc(reportCommentId)
      .delete()
      .then(() => {
        console.log('Comentario eliminado correctamente de reportComments');
      })
      .catch(error => {
        console.log('Error eliminando el comentario de reportComments:', error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={{marginBottom: 10, borderBottomWidth:1}}>
        
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
        <TouchableOpacity onPress={() => deleteComment(item.id, item.reportCommentId)}>
            <Text style={styles.deleteButton}>Eliminar</Text>
        </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <Text style={{textAlign:'center', color:'black', padding:20,fontSize:17, paddingTop:10}}>Comentarios reportados por otros usuarios en espera de ser censurados</Text>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        
      />
    </View>
  )
}
export default AdmComentarios;
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