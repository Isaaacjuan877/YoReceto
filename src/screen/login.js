import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,TouchableOpacity,Image ,Text,ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LogoRec from '../logo/Logo_recorte.png'
import LogoText from '../logo/Logo_texto.png'
import { useNavigation } from '@react-navigation/native';


const Login = () => {
  // declarar las variables de estado del componente user, correo(correo electrónico), clave(contraseña) y error
    const [user, setUser] = useState(null);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  
  const navigation = useNavigation();
// se utiliza para observar cambios en el estado de autenticación del usuario. 
//Llama auth().onAuthStateChangedcon una función de devolución de llamada que se ejecuta cuando cambia el estado de autenticación. 
//Si un usuario está autenticado, obtiene su información de la base de datos de Firestore y la almacena en la uservariable de estado. 
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
        setUser({ ...userDoc.data(), uid: user.uid });
      } else {
        setUser(null);
      }
    });
  
    return unsubscribe;
  }, []);
  //Se llama auth().signInWithEmailAndPasswordpara intentar iniciar la sesión del usuario con el correo electrónico
  // y la contraseña proporcionados. Si tiene éxito, muestra un mensaje de éxito y navega a la pantalla "Inicio" (Inicio). 
  //Si hay un error, establece la errorvariable de estado en un mensaje basado en el código de error devuelto por Firebase.
  const handleLogin = () => {
    
        auth()
      .signInWithEmailAndPassword(correo, clave)
      .then(() => {
        ToastAndroid.show('Inicio de sesión exitoso', ToastAndroid.LONG);
        console.log('Inicio de sesión exitoso');
        setCorreo('');
        setClave('');
        setError('');
       navigation.navigate('Inicio'); // aquí se redirige a la pantalla de inicio de sesión
        
      })
      .catch((error) => {
        console.log('Error en inicio de sesión:', error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
            setError('Las credenciales no coinciden');
        } else if (error.code === 'auth/wrong-password') {
            setError('Contraseña incorrecta');
        } else {
            setError('Error en inicio de sesión');
        }
      });
  };
  

  return (
    
    
    <View style={styles.container}>
        <View style={styles.logoContainer}>
          {/* Logos YoReceto */}
        <Image
          style={styles.logo}
          source={LogoRec}
        />
        <Image
          style={styles.logotxt}
          source={LogoText}
        />

        
      </View>
      {/* Camps de texto para el inicio de sesion */}
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
      {/* Mostar error referentes al inicio de sesion */}
        {error && (
            <View style={styles.alert}>
                <Text style={styles.alertText}>{error}</Text>
            </View>
        )}
        <TouchableOpacity style={{backgroundColor:'white', width:290}}>
          {/* Se llama la funcion handleLogin */}
            <Button style={styles.btnSesion} title="Iniciar sesión" onPress={handleLogin} />
        </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'

  },
  input: {
    width: '80%',
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
  alert: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  alertText: {
    color: 'white',
  },
});

export default Login;
