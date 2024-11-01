import { CommonActions, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, View } from "react-native";
import { useEffect, useState } from 'react';
import LottieView from "lottie-react-native";
import validator from 'validator';
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginProps = {
    navigation: NavigationProp<any>
}

export default function Login({ navigation }: LoginProps) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const profileNavigation = (profile: string) => {
        if (profile === 'admin') {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            )
        } else if (profile === 'filial') {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'ListMov' }],
                })
            )
        } else {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Products' }],
                })
            );
        }
    }

    function handleLogin() {
        //limpa mensagem de erro 
        setErrorMessage('')

        if (!email || !password) {
            setErrorMessage('Ops, faltou preencher algum campo!')
            return
        }

        if (!validator.isEmail(email)) {
            setErrorMessage('O formato de e-mail é inválido!')
            return
        }

        axios.post(process.env.EXPO_PUBLIC_API_URL + '/login', {
            email,
            password
        })
            .then(async (response) => {
                await AsyncStorage.setItem('userName', response.data.name)
                await AsyncStorage.setItem('userProfile', response.data.profile)

                profileNavigation(response.data.profile)
            })
            .catch((error) => {
                console.log('Erro:', error);
                setErrorMessage('Credenciais incorretas, tente novamente.')
            })
    }

    useEffect(() => {
        const loginStatus = async () => {
            const userName = await AsyncStorage.getItem('userName')
            const userProfile = await AsyncStorage.getItem('userProfile')

            if (userName && userProfile) {
                profileNavigation(userProfile)
            }
        }

        loginStatus()
    }, [])

    return (
        <SafeAreaView style={styles.container}>

            <LottieView
                autoPlay
                source={require('../assets/pharma.json')}
                style={{ width: 200, height: 200 }}
            />

            <View style={styles.form}>
                <Text>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <Text>Senha:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <View style={styles.buttonAlignment}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        padding: 20,
        alignItems: 'center'
    },
    form: {
        margin: 20,
        gap: 10
    },
    input: {
        width: 300,
        height: 'auto',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#ff0000',
        marginTop: 10
    },
    button: {
        width: 100,
        height: 'auto',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#7e87ff89'
    },
    buttonAlignment: {
        alignItems: 'center'
    }
})