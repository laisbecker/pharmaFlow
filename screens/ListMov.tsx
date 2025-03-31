import { SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, View, Button } from 'react-native';
import { NavigationProp, CommonActions } from "@react-navigation/native";
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MovementType {
  id: number,
  origin_branch_id: number,
  destination_branch_id: number,
  product_id: number,
  quantity: number,
  status: string,
  quantidade: number,
  origem: { id: number; nome: string },
  destino: { id: number; nome: string },
  produto: { id: number; nome: string },
}

type ListProps = {
  navigation: NavigationProp<any>
}

export default function ListMov({ navigation }: ListProps) {

  const [movements, setMovements] = useState<MovementType[]>([])

  const fetchMovements = () => {
    axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements')
      .then(response => {
        setMovements(response.data)
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error)
      });
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchMovements();
    }, [])
  );

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

  const renderMovement = ({ item }: { item: MovementType }) => (
    <View style={styles.movementCard}>
      <View style={styles.itemsStyle}>
        <Text style={styles.textStyle}>Origem: </Text>
        <Text>{item.origem.nome}</Text>
      </View>
      <View style={styles.itemsStyle}>
        <Text style={styles.textStyle}>Destino: </Text>
        <Text>{item.destino.nome}</Text>
      </View>
      <View style={styles.itemsStyle}>
        <Text style={styles.textStyle}>Produto: </Text>
        <Text>{item.produto.nome} - {item.quantidade} UN</Text>
      </View>
      <View style={styles.itemsStyle}>
        <Text style={styles.textStyle}>Status: </Text>
        <Text>{item.status}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.headerContainer}>
        <Text style={styles.titleStyle}>
          Listagem de movimentações
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegisterMov')}>
          <Text style={styles.textStyle}>+ NOVA</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movements}
        renderItem={renderMovement}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
        <MaterialCommunityIcons name="exit-to-app" size={24} color="black"/>
        <Text style={styles.logoutButton}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  button: {
    width: 80,
    height: 'auto',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#289fe4a6'
  },
  movementCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#000000',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 15,
  },
  textStyle: {
    fontWeight: '500'
  },
  itemsStyle: {
    flexDirection: 'row'
  },
  titleStyle: {
    fontWeight: '500',
    fontSize: 20
  },
  headerContainer: {
    justifyContent: 'space-between',
    margin: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonContainer: {
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5
  },
  logoutButton: {
    fontSize: 18,
    fontWeight: '500',
    textDecorationLine: 'underline'
  }
});
