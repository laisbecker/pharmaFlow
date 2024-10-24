import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

export default function Header() {

    const [userName, setUserName] = useState('')
    const [userProfile, setUserProfile] = useState('')
    const [icon, setIcon] = useState(null)

    useEffect(() => {
        const loadUserData = async () => {
            const name = await AsyncStorage.getItem('userName')
            const profile = await AsyncStorage.getItem('userProfile')

            setUserName(name || '')
            setUserProfile(profile || '')

            if (profile === 'admin') {
                setIcon(require('../assets/administrator.png'))
            } else if(profile === 'filial'){
                setIcon(require('../assets/office.png'))
            } else {
                setIcon(require('../assets/truck.png'))
            }
        }

        loadUserData()
    }, [])

    return (
        <View style={styles.header}>
            <Text>Olá, {userName}!</Text>
            {icon && <Image source={icon} style={styles.icon}/>}
            <Text>Usuário: {userProfile}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 45,
        height: 45
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-evenly',
        padding: 5,
        backgroundColor: '#5cb9e432',
        width: '100%'
    }
})