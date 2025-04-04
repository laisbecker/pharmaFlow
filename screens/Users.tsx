import axios from "axios"
import { useEffect, useState } from "react"
import { FlatList, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header"
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

export default function Users({ navigation }: UserProps) {

    const [users, setUsers] = useState<UsersType[]>([])
    const [userProfile, setUserProfile] = useState('')
    const [icon, setIcon] = useState(null)

    useEffect(() => {
        const loadUserData = async () => {
            const name = await AsyncStorage.getItem('userName')
            const profile = await AsyncStorage.getItem('userProfile')

            setUserProfile(profile || '')
        }

        loadUserData()
    }, [])

    useFocusEffect(() => {
        axios.get(process.env.EXPO_PUBLIC_API_URL + '/users')
            .then(response => {
                setUsers(response.data.map((user: UsersType) => ({
                    ...user,
                    status: user.status === 1, // Converte 1 para true e 0 para false
                })));
            })
            .catch(error => console.log(error))
    })

    function handleChangeStatus(id: number) {

        axios.patch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}/toggle-status`)

            .then(response => {
                console.log('Status alterado:', response.data)
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === id ? { ...user, status: response.data.status === 1 } : user
                    )
                )
            })
            .catch(error => console.log(error))
    }

    const renderUser = ({ item }: { item: UsersType }) => {
        const cardStyle = item.status ? styles.active : styles.inactive

        const userIcon = item.profile === 'admin'
            ? require('../assets/administrator.png')
            : item.profile === 'filial'
                ? require('../assets/office.png')
                : require('../assets/truck.png')

        return (
            <View style={[styles.card, cardStyle]}>
                <View style={styles.userCards}>
                    <Image source={userIcon} style={styles.icon} />
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
            <Header />
            <View style={styles.headerContainer}>
                <Text style={styles.titleStyle}>Listagem de usuários</Text>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('CreateUsers')}>
                    <Text style={styles.textStyle}>+ NOVO</Text>
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
    buttonStyle: {
        width: 100,
        height: 'auto',
        borderRadius: 10,
        padding: 10,
        marginTop: 15,
        alignItems: 'center',
        backgroundColor: '#289fe4a6'
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
    },
    headerContainer: {
        justifyContent: 'space-between',
        margin: 13,
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    titleStyle: {
        fontWeight: '500',
        fontSize: 20
    },
})