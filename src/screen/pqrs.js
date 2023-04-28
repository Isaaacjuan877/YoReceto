import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet ,TextInput, Button, ToastAndroid} from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app'
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

const PQRS = () => {
   
    const [user, setUser] = useState(null);
    const [tipo, setTipo] = useState(null);
    const [tipoNombre, setTipoNombre] = useState(null);
    const [pqrDescription, setPqrDescription] = useState('');
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [open, setOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [email, setEmail] = useState('');
    const handleDesPress = () => {
      setOpen(!open);
    };
      // Checamos si hay o no hay sesioes activas
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
          if (user) {
            const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
            setUser({ ...userDoc.data(), uid: user.uid });
            setUserEmail(user.email);
            
          } else {
            setUser(null);
            
           
          }
        });
      
        return unsubscribe;
      }, []);
    
    const handlePress = componentName => {
      setTipoNombre(componentName);
      setOpen(!open);
    };
    
    const handleTipoSelect = tipo => {
      setTipo(tipo);
      setShowMenu(false);
      setTipoNombre(tipo.label); // Agregamos la asignación del nombre del tipo seleccionado
    };
    
    const handleSubmit = () => {
        // Verificar si todos los campos están llenos
        if (!tipoNombre|| (!userEmail && !email)   || !pqrDescription) {
          // Mostrar un mensaje de error si hay campos vacíos
          alert('Por favor, complete todos los campos antes de enviar la PQRS.');
          return;
        }
      
        // Guardamos la información en la colección de Firebase
        firebase.firestore().collection('pqrs').add({
          tipo: tipoNombre, // Guardamos el nombre del tipo seleccionado
          descripcion: pqrDescription,
          correo: user ? userEmail : email
        })
        .then(() => {
          console.log('PQRS enviada correctamente');
          ToastAndroid.show('Enviado correctamente', ToastAndroid.LONG);
          // Limpiar los campos después de enviar la información
          setTipo(null);
          setTipoNombre(null);
          setPqrDescription('');
          setEmail(''); // Vaciar el campo del correo
        })
        .catch(error => {
          console.error('Error al enviar la PQRS:', error);
        });
      };
    

      
    
    return (
      <View style={{ flex: 1, padding: 16, }}>
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
        <Text style={styles.label}>Correo:</Text>
        {user ? (
            <TextInput
                placeholder="Correo electrónico"
                value={userEmail}
                editable={false}
                keyboardType="email-address"
                style={{ marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderRadius: 8, borderColor: 'gray', color:'black' }}
            />
            ) : (
            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{ marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderRadius: 8, borderColor: 'gray', color:'black' }}
            />
        )}
    
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          placeholder="Descripción de la PQRS"
          value={pqrDescription}
          onChangeText={setPqrDescription}
          multiline
          numberOfLines={6}
    
          style={{ marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderRadius: 8, borderColor: 'gray', color:'black' }}
        />
        <Button title="Enviar" onPress={handleSubmit} />
    
    
      <View style={styles.menuCategorias}>
          {open && (
            // dependiendo de que se presione se escoje el tipo de pqrs
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
  );
};
export default PQRS
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    color:'black'
  },
  tipoButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    color:'black'
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    color:'black'
  },
  tipoItem: {
    padding: 8,
    
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
  
  headerCat:{
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
