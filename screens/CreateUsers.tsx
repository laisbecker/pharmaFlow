import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Header from "../components/Header"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import validator from 'validator'
import axios from 'axios'
import { NavigationProp } from "@react-navigation/native";

type CreationProps = {
    navigation: NavigationProp<any>
}

export default function CreateUsers({ navigation }: CreationProps) {

    const [profile, setProfile] = useState('motorista')
    const [name, setName] = useState('')
    const [document, setDocument] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    function handleLogin() {
        //limpar mensagem de erro 
        setErrorMessage('')

        if (!name || !document || !address || !email || !password || !confirmPassword) {
            setErrorMessage('Ops, faltou preencher algum campo!')
            return
        }

        if (!validator.isEmail(email)) {
            setErrorMessage('O formato de e-mail é inválido!')
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage('As senhas inseridas são diferentes!')
            return
        }

        axios.post(process.env.EXPO_PUBLIC_API_URL + '/register', {
            profile: profile,
            name: name,
            document: document,
            full_address: address,
            email: email,
            password: password
        })
            .then((response) => {
                console.log('DEU CERTO!!!')
                Alert.alert('Cadastro criado com sucesso!')
                navigation.navigate('Users')
            })
            .catch(() => {
                console.log('sinto em lhe informar... CATCH')
            })
    }

    function switchProfileBranch() {
        setProfile('filial')
    }

    function switchProfileDriver() {
        setProfile('motorista')
    }

    return (
        <SafeAreaView style={styles.safeStyle}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    <>
                        <Header />
                        <View style={styles.containerProfile}>
                            <TouchableOpacity style={[styles.icons, profile === 'filial' ? styles.selected : null]} onPress={switchProfileBranch}>
                                <MaterialCommunityIcons
                                    name='office-building'
                                    size={50}
                                    color='black'
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.icons, profile === 'motorista' ? styles.selected : null]} onPress={switchProfileDriver}>
                                <MaterialCommunityIcons
                                    name='truck-delivery'
                                    size={50}
                                    color='black'
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.textTitle}>Dados pessoais</Text>


                        <View style={styles.formContainer}>

                            <Text style={styles.textInput}>Nome Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                            <Text style={styles.textInput}>{profile === 'motorista' ? 'CPF' : 'CNPJ'}</Text>
                            <TextInput
                                style={styles.input}
                                value={document}
                                onChangeText={setDocument}
                                keyboardType='numeric'
                            />
                            <Text style={styles.textInput}>Endereço Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setAddress}
                            />
                            <Text style={styles.textTitle}>Dados de login</Text>
                            <Text style={styles.textInput}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <Text style={styles.textInput}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            <Text style={styles.textInput}>Confirme a senha</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text>Cadastrar</Text>
                        </TouchableOpacity>
                    </>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeStyle: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    container: {
        flex: 1,
    },
    icons: {
        width: 70,
        height: 70,
        backgroundColor: '#5cb9e432',
        borderRadius: 50,
        borderColor: 'transparent',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selected: {
        borderColor: 'black'
    },
    containerProfile: {
        flexDirection: 'row',
        alignContent: 'center',
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-around'
    },
    input: {
        width: '100%',
        height: 30,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5
    },
    textInput: {
        alignSelf: 'flex-start'
    },
    textTitle: {
        fontSize: 20,
        fontWeight: '500',
        margin: 30
    },
    formContainer: {
        width: '80%',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#5cb9e4ae',
        width: 100,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 25
    },
    scroll: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    errorText: {
        color: '#ff0000'
    }
});
