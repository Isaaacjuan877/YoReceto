import React , {useEffect, useState}from 'react';
import { View, Text, Image, 
  ScrollView,Button, Modal, 
  TextInput ,FlatList,TouchableOpacity,
  StyleSheet,StatusBar,Linking, Alert,ToastAndroid } from 'react-native';
import FotoProv from '../prov/fotoprov.png';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app'
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

const AdmPqrs = () => {
    const [pqrs, setPqrs] = useState([]);
  const [tipoNombre, setTipoNombre] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDesPress = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pqrs')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPqrs(data);
      });

    return () => unsubscribe();
  }, []);

  const handlePress = (componentName) => {
    // Actualiza el estado para mostrar el componente seleccionado
    if (typeof componentName === 'string' && componentName.trim() !== '') {
      setTipoNombre(componentName);
      setOpen(!open);
    } else {
      setTipoNombre(null);
    }
  };

  const deletePqrs = (pqrsId) => {
    // Eliminar el comentario correspondiente de la colección "comentarios"
    firestore()
      .collection('pqrs')
      .doc(pqrsId)
      .delete()
      .then(() => {
        console.log('Pqrs eliminado correctamente ');
        ToastAndroid.show('Pqrs eliminado correctamente', ToastAndroid.LONG);
      })
      .catch((error) => {
        console.log('Error eliminando la pqrs:', error);
      });
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 10, borderBottomWidth: 1 }}>
      <View style={styles.commentContainer}>
        <Image style={styles.userPhoto} source={FotoProv} />
        <View style={styles.commentContent}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{item.correo}</Text>
          </View>
          <Text style={styles.commentText}>{item.descripcion}</Text>
        </View>
      </View>
      <View
        style={{
          marginBottom: 10,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: 'gray',
        }}
      >
        <TouchableOpacity onPress={() => deletePqrs(item.id)}>
          <Text style={styles.deleteButton}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredPqrs = tipoNombre
    ? pqrs.filter((item) => item.tipo === tipoNombre)
    : pqrs;
  
    return (
      <View style={styles.container}>
        <View style={{ alignItems:'center' }}>
          <TouchableOpacity style={styles.headerCat} onPress={() => handleDesPress(null)}>
            <Text style={{ color: 'black' }}>Tipo de PQRS</Text>
            <Icon name="angle-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TextInput
          editable={false}
          value={tipoNombre} // Agregamos la propiedad value y asignamos el valor de tipoNombre
          onChangeText={setTipoNombre} // También actualizamos la función onChange
          style={{ marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderRadius: 8, borderColor: 'gray', color:'black' }}
        />
        <FlatList
        data={filteredPqrs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        
      />
        
        <View style={styles.menuCategorias}>
          {open && (
            <View>
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('Peticiones')}>
                <Text style={styles.categoriasText}>Peticiones</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('Quejas')} >
                <Text style={styles.categoriasText}>Quejas</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('Reclamos')}>
                <Text style={styles.categoriasText}>Reclamos</Text>
              </TouchableOpacity>
        
              <TouchableOpacity style={styles.categorias} onPress={() => handlePress('Sugerencias')}>
                <Text style={styles.categoriasText}>Sugerencias</Text>
              </TouchableOpacity>
       
              
            </View>
          )}
        </View>
      </View>
    )
  }

export default AdmPqrs

const styles = StyleSheet.create({container: {
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
  },headerCat:{
    padding:5,
    margin:10,
    flexDirection:'row',
    justifyContent:'space-between',
    borderWidth:2,
    borderColor:'red',
    width:'100%'
   
   
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
});