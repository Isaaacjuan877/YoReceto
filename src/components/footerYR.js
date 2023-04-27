import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FooterYR = () => {
  return (
    <View style={styles.container}>
        <View style={styles.copyright}>
             <Text style={styles.copyrighttext}>Copyright © 2023 YoReceto. Todos los derechos reservados.</Text>
        </View>
     
    </View>
  )
}

export default FooterYR

const styles = StyleSheet.create({
    container:{
        
        width:'100%',
        
        alignItems:'center',
        
        alignContent:'center',
        
    },
    copyright:{
        marginTop:30,
        width:'100%',
        backgroundColor:'red',
        padding:30,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    copyrighttext:{
        color:'black',
        textAlign:'center',
        fontSize:17,
        fontWeight:'bold',
        fontFamily:'sans-serif-thin'
    }


})