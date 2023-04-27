import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,TouchableOpacity,Image ,Text,ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LogoRec from '../logo/Logo_recorte.png'
import LogoText from '../logo/Logo_texto.png'
import { useNavigation } from '@react-navigation/native';


const Login = () => {
    const [user, setUser] = useState(null);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  
  const navigation = useNavigation();

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
        <Image
          style={styles.logo}
          source={LogoRec}
        />
        <Image
          style={styles.logotxt}
          source={LogoText}
        />

        
      </View>
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
        {error && (
            <View style={styles.alert}>
                <Text style={styles.alertText}>{error}</Text>
            </View>
        )}
        <TouchableOpacity style={{backgroundColor:'white', width:290}}>
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
