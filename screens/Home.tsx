import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Image, Button, View } from "react-native"
import Header from "../components/Header"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CommonActions, NavigationProp } from "@react-navigation/native";

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

            <TouchableOpacity style={styles.managementButton} onPress={() => navigation.navigate('ListProducts')}>
                <Image source={require('../assets/box.png')} style={styles.image} />
                <Text style={styles.textButton}>
                    Gerenciar estoque
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.managementButton} onPress={() => navigation.navigate('Users')}>
                <Image source={require('../assets/user.png')} style={styles.image} />
                <Text style={styles.textButton}>
                    Gerenciar usuários
                </Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button title="Logout" onPress={handleLogout} />
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
    managementButton: {
        backgroundColor: '#8758ff71',
        width: 350,
        height: 100,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
        padding: 20,
        justifyContent: 'center'
    },
    textButton: {
        fontSize: 22,
        color: '#181818'
    },
    image: {
        width: 60,
        height: 60
    },
    buttonContainer: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }
})