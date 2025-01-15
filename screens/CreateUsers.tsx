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
                console.log('SUCESSO!')
                Alert.alert('Cadastro criado com sucesso!')
                navigation.navigate('Users')
            })
            .catch(() => {
                console.log('CATCH!')
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
            <Header />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    <>
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

                            <Text style={styles.textInput}>{profile === 'motorista' ? 'Nome do Motorista' : 'Nome da Filial'}</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder='Digite o nome'
                            />
                            <Text style={styles.textInput}>{profile === 'motorista' ? 'CPF' : 'CNPJ'}</Text>
                            <TextInput
                                style={styles.input}
                                value={document}
                                onChangeText={setDocument}
                                keyboardType='numeric'
                                placeholder='Digite o número do documento'
                            />
                            <Text style={styles.textInput}>Endereço Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setAddress}
                                placeholder='Digite o endereço'
                            />
                            <Text style={styles.textTitle}>Dados de login</Text>
                            <Text style={styles.textInput}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                placeholder='Digite o e-mail'
                            />
                            <Text style={styles.textInput}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder='Digite a senha'
                            />
                            <Text style={styles.textInput}>Confirme a senha</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder='Digite a confirmação da senha'
                            />
                        </View>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.textStyle}>Cadastrar</Text>
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
        flex: 1
    },
    icons: {
        width: 70,
        height: 70,
        backgroundColor: '#289fe4a6',
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
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        padding: 10,
        backgroundColor: '#fff'
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
        width: 100,
        height: 'auto',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#289fe4a6'
    },
    scroll: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    errorText: {
        color: '#ff0000'
    },
    textStyle: {
        fontWeight: '500',
        fontSize: 15
    }
});
