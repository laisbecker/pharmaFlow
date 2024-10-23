import axios from "axios"
import { useEffect, useState } from "react"
import { FlatList, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationProp } from "@react-navigation/native";

interface UsersType {
    id: number,
    name: string,
    profile: string,
    status: number | boolean,
    password: number,
    email: string
}

type UserProps = {
    navigation: NavigationProp<any>
}

export default function Users({navigation}: UserProps) {

    const [users, setUsers] = useState<UsersType[]>([])
    const [userProfile, setUserProfile] = useState('')
    const [icon, setIcon] = useState(null)

    useEffect(() => {
        const loadUserData = async () => {
            const name = await AsyncStorage.getItem('userName')
            const profile = await AsyncStorage.getItem('userProfile')

            setUserProfile(profile || '')

            if (profile === 'admin') {
                setIcon(require('../assets/administrator.png'))
            } else if (profile === 'filial') {
                setIcon(require('../assets/office.png'))
            } else {
                setIcon(require('../assets/truck.png'))
            }
        }

        loadUserData()
    }, [])

    useEffect(() => {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/users')
        .then(response => {
            console.log('Usuários carregados:', response.data); // Log dos usuários carregados
            setUsers(response.data.map((user: UsersType) => ({
                ...user,
                status: user.status === 1, // Converte 1 para true e 0 para false
            })));
        })
            .catch(error => console.log(error))
    }, [])

    function handleChangeStatus(id: number) {

        axios.patch(`http://192.168.1.14:3000/users/${id}/toggle-status`)

            .then(response => {
                console.log('Status alterado:', response.data)
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === id ? { ...user, status: response.data.status === 1 } : user
                    )
                );
            })
            .catch(error => console.log(error))
    }

    const renderUser = ({ item }: { item: UsersType }) => {
        const cardStyle = item.status ? styles.active : styles.inactive

        return (
            <View style={[styles.card, cardStyle]}>
                <View style={styles.userCards}>
                    {icon && <Image source={icon} style={styles.icon} />}
                    <Switch value={!!item.status} onValueChange={() => handleChangeStatus(item.id)} />
                </View>
                <View style={styles.alignCard}>
                    <Text style={styles.textStyle}>{item.name}</Text>
                    </View>
                
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateUsers')}>
                    <Text>+ Novo usuário</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={users}
                renderItem={renderUser}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
            />

        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    button: {
        width: 140,
        height: 'auto',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#8758ff83'
    },
    buttonContainer: {
        alignItems: 'flex-end',
        marginRight: 15
    },
    icon: {
        width: 50,
        height: 50
    },
    userCards: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,

    },
    card: {
        width: '43%',
        padding: 8,
        margin: 15,
        borderRadius: 10
    },
    alignCard: {
        alignItems: 'flex-start',
        marginLeft: 5,
        marginBottom: 5
    },
    textStyle: {
        fontWeight: '500',
        fontSize: 15
    },
    active: {
        backgroundColor: '#00ffbf3d',
    },
    inactive: {
        backgroundColor: '#ff00003e'
    }
})