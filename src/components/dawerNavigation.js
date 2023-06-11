import { StyleSheet, Text,View,Image,ScrollView, Linking} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FotoProv from '../prov/fotoprov.png';
import { Icon } from '@rneui/themed';
import logo from '../logo/Logo.png';
import React ,{useEffect,useState}from 'react'
import { createDrawerNavigator,  DrawerContentScrollView } from '@react-navigation/drawer';
import Guadados from '../screen/guardados';
import Home from '../screen/home';
import Login from '../screen/login';
import RecetaDiaria from '../screen/recetadiaria';
import Recetario from '../screen/recetario';
import Receta from '../screen/receta'
import MenuBotones from "../components/MenuBotones";
import Perfil from '../screen/perfil';
import Personalizada from '../screen/personalizada';
import RecetaPersonalizada from '../screen/recetaPersonalizada'
import Registro from '../screen/registro'
import Chat from '../screen/chat';
import RecetaGuardada from '../screen/recetaGuardada';
import RecetarioSano from '../screen/recetarioSano';
import RecetasSanas from '../screen/recetasSanas';
import RecetarioVegetariano from '../screen/recetarioVegetariano';
import RecetasVegetarianas from '../screen/recetasVegetarianas';
import RecetarioVegano from '../screen/recetarioVegano';
import RecetasVeganas from '../screen/recetasVeganas';
import RecetarioPostres from '../screen/recetarioPostres';
import RecetasPostres from '../screen/recetasPostres';
import RecetarioBebidas from '../screen/recetarioBebidas';
import RecetasBebidas from '../screen/recetasBebidas';
import RecetarioCastellano from '../screen/recetarioCastellano';
import Agregar from '../admin/agregar';
import Modificar from '../admin/modificar';
import PanelDeControl from '../admin/panelDeControl';
import AdmComentarios from '../admin/admComentarios';
import AdmMensajes from '../admin/admMensajes';
import PQRS from '../screen/pqrs';
import AdmPqrs from '../admin/admPqrs';
import Likes from '../analiticas/likes';
import RecetasFavoritas from '../analiticas/recetasFavoritas';
import Ingredientes from '../analiticas/ingredientes';
import DB from '../database/dbrecetario';
const Drawer = createDrawerNavigator();
export  function DrawerNavigation() {

    const [user, setUser] = useState(null);
    const AdminCorreo = "Admin@gmail.com"
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
  return (
    
    <Drawer.Navigator initialRouteName='Inicio'
        drawerContent={(props)=><Menu {...props}/>}
    >
        <Drawer.Screen name="Inicio" component={Home}  />
        <Drawer.Screen name="Recetario" component={Recetario} />
        <Drawer.Screen name="Receta" component={Receta} options={{headerShown:false}}/>
        <Drawer.Screen name="Personalizada" component={Personalizada} /> 
        
          <Drawer.Screen name="PanelDeControl" component={PanelDeControl} />
        <Drawer.Screen name="Agregar" component={Agregar} />
        <Drawer.Screen name="Modificar" component={Modificar} /> 
        <Drawer.Screen name="AdmComentarios" component={AdmComentarios} />
        <Drawer.Screen name="AdmMensajes" component={AdmMensajes} />
        <Drawer.Screen name="AdmPqrs" component={AdmPqrs} />
        <Drawer.Screen name="Perfil" component={Perfil} /> 
       {/*  <Drawer.Screen name="Likes" component={Likes} />
        <Drawer.Screen name="RecetasFavoritas" component={RecetasFavoritas} />
        <Drawer.Screen name="Ingredientes" component={Ingredientes} /> */}
               <Drawer.Screen name="Guardados" component={Guadados} />
       
          <Drawer.Screen name="Login" component={Login}  />
         
        <Drawer.Screen name="Registro" component={Registro} />
        <Drawer.Screen name="Chat" component={Chat} /> 
        <Drawer.Screen name="PQRS" component={PQRS} /> 
       
        
        <Drawer.Screen name="RecetaGuardada" component={RecetaGuardada} options={{headerShown:false}}/>
        {/* <Drawer.Screen name="RecetaDiaria" component={RecetaDiaria} /> */}
        
        <Drawer.Screen name="RecetaPersonalizada" component={RecetaPersonalizada} options={{headerShown:false}} />
       
       
       
    
       
        
        {/* recetarios */}
        <Drawer.Screen name="RecetarioCastellano" component={RecetarioCastellano} />
        <Drawer.Screen name="RecetarioSano" component={RecetarioSano} />
        <Drawer.Screen name="RecetasSanas" component={RecetasSanas} options={{headerShown:false}}/>
        <Drawer.Screen name="RecetarioVegetariano" component={RecetarioVegetariano} />
        <Drawer.Screen name="RecetasVegetarianas" component={RecetasVegetarianas} options={{headerShown:false}}/>
        <Drawer.Screen name="RecetarioVegano" component={RecetarioVegano} />
        <Drawer.Screen name="RecetasVeganas" component={RecetasVeganas} options={{headerShown:false}}/>
        <Drawer.Screen name="RecetarioPostres" component={RecetarioPostres} />
        <Drawer.Screen name="RecetasPostres" component={RecetasPostres} options={{headerShown:false}}/>
        <Drawer.Screen name="RecetarioBebidas" component={RecetarioBebidas} />
        <Drawer.Screen name="RecetasBebidas" component={RecetasBebidas} options={{headerShown:false}}/>
         {/* <Drawer.Screen name="DB" component={DB} />   */}

        {/*Administrador*/}
        
       
         
      </Drawer.Navigator>
  )
}
const Menu = ({navigation})=>{
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    

    
    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        try {
          if (user) {
            const userAct = auth().currentUser;
            const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
            const userData = { ...userDoc.data(), uid: user.uid };

            setUser(userData);

            // Verificar si el usuario es un administrador
            
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error(error);
        }
      });
    
      return unsubscribe;
    }, []);

    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        try {
          if (user) {
            const userDoc = await firestore().collection('Usuarios').doc(user.uid).get();
            const isAdmin = userDoc.data().isAdmin;
            if (isAdmin) {
              setAdmin(true);
              console.log('El usuario es un administrador');
            } else {
              console.log('El usuario no es un administrador');
              setAdmin(false);
            }
          } else {
            console.log('No hay sesiones activas');
          }
        } catch (error) {
          console.error(error);
        }
      });
      return unsubscribe;
    }, []);
    
    const handleComposeEmail = () => {
      const recipientEmail = 'isaacjuan877@gmail.com'; // Cambia por tu dirección de correo
  
      const emailUrl = `mailto:${recipientEmail}`;
  
      Linking.openURL(emailUrl);
    };
    
    
  
    return(
        <ScrollView>
            <DrawerContentScrollView
            style={styles.container}
            >
                
                
                {user ? (
        <>
          <View style={styles.head}>
                <View >
                  <Text style={styles.name}>Hola! {user.nombre} </Text>
                  <Text style={{fontSize:17,color:'black'}}>Bienvenido</Text>
                </View>
                <Image style={styles.avatar} source={{uri:'https://render.fineartamerica.com/images/images-profile-flow/400/images-medium-large-5/did-someone-say-mouse-don-spenner.jpg'}}/>
              </View>
        </>
      ) : (
        <Text style={{color:'black', fontWeight:'bold'}}>Cargando...</Text>
      )}
                
                
                <View style={styles.App_header}>
                    <View style={styles.header_logo}>
                        <Image source={logo} style={styles.App_logo} alt="logo" /> 
                    
                    </View> 
                    
                </View>
            
                <MenuBotones
                  icon="home"
                  text="Inicio"
                  onPress={() => navigation.navigate('Inicio')}
                />
                
        { user && admin ? (
          <>
            <MenuBotones
              icon="settings"
              text="Panel de control"
              onPress={() => navigation.navigate('PanelDeControl')}
            />
            <MenuBotones
              icon="add"
              text="Agregar"
              onPress={() => navigation.navigate('Agregar')}
            />
            <MenuBotones
              icon="add"
              text="Modificar"
              onPress={() => navigation.navigate('Modificar')}
            />
            <MenuBotones
              icon="add"
              text="Administrar comentarios"
              onPress={() => navigation.navigate('AdmComentarios')}
            />
            <MenuBotones
              icon="add"
              text="AdmMensajes"
              onPress={() => navigation.navigate('AdmMensajes')}
            />
            <MenuBotones
              icon="add"
              text="AdmPqrs"
              onPress={() => navigation.navigate('AdmPqrs')}
            />
            <MenuBotones
                  icon="fast-food"
                  text="Recetario"
                  onPress={() => navigation.navigate('Recetario')}
                />
                {/* <MenuBotones
                  icon= 'pizza'
                  text='Receta Diaria'
                  onPress={()=>navigation.navigate('RecetaDiaria')}
                /> */}

                <MenuBotones
                  icon="pizza"
                  text="Receta Personalizada"
                  onPress={() => navigation.navigate('Personalizada')}
                />

                <MenuBotones
                  icon="bookmark"
                  text="Guardados"
                  onPress={() => navigation.navigate('Guardados')}
                />
                <MenuBotones
                  icon= 'chatbubbles'
                  text='Chat en linea'
                  onPress={()=>navigation.navigate('Chat')}
                />
            <MenuBotones
              icon="person"
              text="Perfil"
              onPress={() => navigation.navigate('Perfil')}
            />
            {/* <MenuBotones
              icon="person"
              text="Likes"
              onPress={() => navigation.navigate('Likes')}
            />
            <MenuBotones
              icon="person"
              text="RecetasFavoritas"
              onPress={() => navigation.navigate('RecetasFavoritas')}
            />
            <MenuBotones
              icon="person"
              text="Ingredientes"
              onPress={() => navigation.navigate('Ingredientes')}
            /> */}
          </>
        ) : (
          <>
            {user ? (
              <>
              <MenuBotones
                  icon="fast-food"
                  text="Recetario"
                  onPress={() => navigation.navigate('Recetario')}
                />
                {/* <MenuBotones
                  icon= 'pizza'
                  text='Receta Diaria'
                  onPress={()=>navigation.navigate('RecetaDiaria')}
                /> */}

                <MenuBotones
                  icon="pizza"
                  text="Receta Personalizada"
                  onPress={() => navigation.navigate('Personalizada')}
                />

                <MenuBotones
                  icon="bookmark"
                  text="Guardados"
                  onPress={() => navigation.navigate('Guardados')}
                />
                <MenuBotones
                  icon="person"
                  text="Perfil"
                  onPress={() => navigation.navigate('Perfil')}
                />
                <MenuBotones
                  icon= 'person'
                  text='Registro'
                  onPress={()=>navigation.navigate('Registro')}
                />
                            
                <MenuBotones
                  icon= 'chatbubbles'
                  text='Chat en linea'
                  onPress={()=>navigation.navigate('Chat')}
                />
                <MenuBotones
                  icon= 'chatbox-ellipses'
                  text='PQRS'
                  onPress={()=>navigation.navigate('PQRS')}
                />
                
              </>
            ) : (
              <>
              <MenuBotones
                  icon="fast-food"
                  text="Recetario"
                  onPress={() => navigation.navigate('Recetario')}
                />
                {/* <MenuBotones
                  icon= 'pizza'
                  text='Receta Diaria'
                  onPress={()=>navigation.navigate('RecetaDiaria')}
                /> */}

                <MenuBotones
                  icon="pizza"
                  text="Receta Perzonalizada"
                  onPress={() => navigation.navigate('Personalizada')}
                />

              <MenuBotones
                icon="log-in"
                text="Login"
                onPress={() => navigation.navigate('Login')}
                />
                <MenuBotones
                  icon= 'person'
                  text='Registro'
                  onPress={()=>navigation.navigate('Registro')}
                />
                            
                <MenuBotones
                  icon= 'chatbubbles'
                  text='Chat en linea'
                  onPress={()=>navigation.navigate('Chat')}
                />
                <MenuBotones
                  icon= 'chatbox-ellipses'
                  text='PQRS'
                  onPress={()=>navigation.navigate('PQRS')}
                />
                </>
              )}
              
              </>
              )}
              
                
<Text style={styles.title}>
                    Contactanos 
                    
                </Text>
                 
                <View
                    style={styles.contacto}
                >
                 
                    <Icon style={styles.redes}
                        raised
                        name='logo-facebook'
                        type='ionicon'
                        color='red'
                        
                    />
                    <Icon style={styles.redes}
                        raised
                        name='logo-instagram'
                        type='ionicon'
                        color='red'
                    />
                    
                    
                    
                
                </View>
                <View
                    style={styles.contacto}
                >
                 
                    
                    <Icon style={styles.redes}
                        raised
                        name='logo-twitter'
                        type='ionicon'
                        color='red'
                    />
                    <Icon style={styles.redes}
                        raised
                        name='mail'
                        type='ionicon'
                        color='red'
                        onPress={handleComposeEmail}
                    />
                    
                
                </View>
                
                
    </DrawerContentScrollView>
        </ScrollView>
    )

}
export default Menu;
const styles= StyleSheet.create({
    container: {
        padding:20,
    },
    title:{
        fontSize:20,
        fontWeight: 'bold',
        color:'black'
    },
    App_header:{
        display:'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'flex-start',
    height: 80,
	padding: 5,
	
	backgroundColor:'red',
	borderRadius: 30,
	paddingBottom: 10,
	marginBottom: 50,
    marginTop:25,
    },
    App_logo :{
        width: '100%',
       borderRadius:5,

          
    },
    header_logo:{

        order: 0,
        flex: 4,
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'center',
        height: 40,
       
    },
    contacto:{
        display:'flex',
        flexWrap:'nowrap',
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
        justifyContent: 'space-around',
        // backgroundColor:'red',
        height:'auto',
        width:'100%',
        margin: 15,
        
      },
      redes:{
        
      },
      head:{
        flexDirection:'row',
        justifyContent:'space-between',
        
        
      },
      name:{
        fontSize:20,
        fontWeight:'bold',
        color:'black'
      },
      avatar:{
        width:50,
        height:50,
        borderRadius:30,
      },
})