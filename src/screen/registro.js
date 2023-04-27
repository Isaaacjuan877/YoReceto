import {View,Text,TextInput,Image,StyleSheet, ScrollView,Button,StatusBar,TouchableOpacity} from 'react-native';
import React, { useState,useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
/* 
    import storage from '@react-native-firebase/storage';
    import ImagePicker from 'react-native-image-picker';
    import {launchImageLibrary} from 'react-native-image-picker'; 
*/

import LogoRec from '../logo/Logo_recorte.png'
import LogoText from '../logo/Logo_texto.png'

const Registro = () => {

    const [nombre, setNombre]=useState('');
    const [apellido, setApellido]=useState('');
    const [correo, setCorreo]=useState('');
    const [clave, setClave]=useState('');
    const [confirmClave, setConfirmClave]=useState('');
    const navigation= useNavigation();
    const handleGo = () => {
      navigation.navigate('Login');
    };
    
    const registroUsuario = async () => {
      let registroValido = true
      try {
        if (!nombre || !apellido || !correo || !clave || !confirmClave) {
          registroValido=false
          alert('Por favor llene todos los campos')
        }
        if (clave !== confirmClave) {
          registroValido=false
          alert('Las contraseñas  no coinciden');
        }
        if (registroValido) {
          const userCredential = await auth().createUserWithEmailAndPassword(correo, clave);
          const user = userCredential.user;
          await firestore().collection('Usuarios').doc(user.uid).set({
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            isAdmin: false
          });
          await auth().signOut(); // cerrar sesión después de registro exitoso
          setNombre('')
          setApellido('')
          setCorreo('')
          setClave('')
          setConfirmClave('')
        }
      } catch (error) {
        console.log(error)
      } 
    }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={LogoRec}
        />
        <Image
          style={styles.logotxt}
          source={LogoText}
        />
      </View>
      <View>
        <View style={{ backgroundColor: 'red' }}>
          <TouchableOpacity style={{alignItems:'center',padding:5,marginTop:-25,}} onPress={handleGo} > 
            <Text style={styles.btnbackText}> Iniciar Sesion </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView >
      <View style={styles.formContainer}>
          
      
      <View style={{}}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          onChangeText={text => setNombre(text)}
          value={nombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          onChangeText={text => setApellido(text)}
          value={apellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          onChangeText={text => setCorreo(text)}
          keyboardType="email-address"
          value={correo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          onChangeText={text => setClave(text)}
          value={clave}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          secureTextEntry={true}
          onChangeText={text => setConfirmClave(text)}
          value={confirmClave}
        />
        
       </View>
       
        
        <Button style={styles.registroButton}
         title='Registrate'
            onPress={()=>registroUsuario()}
            />
            
        
      </View>
      </ScrollView>  
    </View>
  )
}

export default Registro

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
        fontWeight:'bold',
        backgroundColor:'red',
        borderRadius:20
        

      },
    
    
    logo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginBottom:-50
    },
    logotxt: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom:-20,
      
    },
      
      
      
    input: {
      width: '100%',
      height: 40,
      borderColor: 'white',
      borderWidth: 1,
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    btnSesion:{
      width:100,
      color:'black',
  
    },
    logoContainer: {
      alignItems: 'center',
      padding:0,
      marginTop: 20,
      
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginBottom:-50
    },
    logotxt: {
      width: 150,
      height: 150,
      resizeMode: 'contain',
      marginBottom:-20
    },
    });