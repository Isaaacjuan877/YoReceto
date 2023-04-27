import { View, Text, TouchableOpacity,StyleSheet} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
//import Entypo from'react-native-vector-icons/Entypo'
//import { Image } from '@rneui/themed'
const MenuBotones = ({text, onPress,icon}) => {
  return (
    <TouchableOpacity
    style = {styles.buttonContainer}
    onPress={onPress}
    >
      <Icon name={icon} />
      {/* <Image
        
        
      /> */}

      <Text style={styles.text}>{text}</Text>
      
    </TouchableOpacity>
    
  )
}
const styles= StyleSheet.create({
    buttonContainer:{
      flexDirection:'row',
      alignItems:'center',
        borderRadius:10,
        backgroundColor:'red',
        marginBottom:15,
        padding:15,
        

    },
    image:{
      borderRadius:23,
      height:45,
      width:45
    },
    text:{
      fontWeight:'bold',
      marginStart:15,

    },
    
})


export default MenuBotones