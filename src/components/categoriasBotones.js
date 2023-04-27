import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
const CategoriasBotones = ({title,icon,screen}) => {
  const navigation = useNavigation();

  const handleCategoryPress = () => {
    navigation.navigate(screen);
  }
  return (
    
    <TouchableOpacity style={styles.container} onPress={handleCategoryPress}>
        <View style={styles.circulo}  >
            
            <Icon style={{padding:10}} name={icon} size={50} color="black" />
        </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>

  )
}

export default CategoriasBotones

const styles = StyleSheet.create({
    container:{
       
        alignItems:'center',
        width:100,
        height:130,
        
    },
    circulo:{
        
        borderRadius:50,
        backgroundColor:'red',
        marginBottom:10,
        marginTop:15
    },
    title:{
        textAlign:'center',
        fontWeight:'500',
        color:'black'
    }
})