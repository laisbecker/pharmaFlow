import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Image, View } from "react-native"
import Header from "../components/Header"
import { useNavigation } from "@react-navigation/native"

export default function Home() {

    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.container}>
                <Header />

                <TouchableOpacity style={styles.managementButton} onPress={() => navigation.navigate('Products')}>
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
    }
})