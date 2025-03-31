import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Image, View } from "react-native"
import Header from "../components/Header"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CommonActions, NavigationProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

type HomeProps = {
    navigation: NavigationProp<any>
}

export default function Home({ navigation }: HomeProps) {

    function handleLogout() {
        AsyncStorage.removeItem('userName')
        AsyncStorage.removeItem('userProfile')
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        )

    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.navigate('ListProducts')}>
                <Image source={require('../assets/box.png')} style={styles.image} />
                <Text style={styles.textButton}>
                    Gerenciar estoque
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchableStyle} onPress={() => {console.log("Navigating to Users"); navigation.navigate('Users')}}>
                <Image source={require('../assets/user.png')} style={styles.image} />
                <Text style={styles.textButton}>
                    Gerenciar usuários
                </Text>
            </TouchableOpacity>
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <MaterialCommunityIcons name="exit-to-app" size={24} color="black" />
                    <Text style={styles.logoutButton} >Sair</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        gap: 30
    },
    touchableStyle: {
        backgroundColor: '#289fe494',
        width: 350,
        height: 90,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
        padding: 20,
        justifyContent: 'center',
    },
    textButton: {
        fontSize: 22,
        color: '#181818'
    },
    image: {
        width: 60,
        height: 60
    },
    button: {
        flexDirection: 'row',
        gap: 5
    },
    logoutButton: {
        fontSize: 18,
        fontWeight: '500',
        textDecorationLine: 'underline'
    },
    logoutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10
    }
})