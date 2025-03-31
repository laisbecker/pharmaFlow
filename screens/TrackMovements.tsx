import { SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, View, Button, Image, ActivityIndicator, Alert } from 'react-native'
import { NavigationProp, CommonActions } from "@react-navigation/native"
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Header from '../components/Header'
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage"
import FormattedDate from '../components/FormattedDate'
import * as ImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MovementType {
  id: number,
  origin_branch_id: number,
  destination_branch_id: number,
  product_id: number,
  quantity: number,
  status: string,
  quantidade: number,
  origem: { id: number, nome: string },
  destino: { id: number, nome: string },
  produto: { id: number, nome: string, imagem: string },
  dataCriacao: string
}

type Track = {
  navigation: NavigationProp<any>
}

export default function TrackMovements({ navigation }: Track) {
  const [movements, setMovements] = useState<MovementType[]>([])
  const [uploading, setUploading] = useState<boolean>(false)

  const fetchMovements = async () => {
    try {
      const response = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/movements')
      setMovements(response.data)
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchMovements()
    }, [])
  )

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

  const startMovement = async (movementId: number, motorista: string, fileUri: string) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', {
        uri: fileUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any)
      formData.append('motorista', motorista)

      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/movements/${movementId}/start`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      Alert.alert('Sucesso', 'Movimentação iniciada com sucesso.')
      await fetchMovements()
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Erro ao iniciar a movimentação.'
      )
    } finally {
      setUploading(false)
    }
  }

  const endMovement = async (movementId: number, motorista: string, fileUri: string) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', {
        uri: fileUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any)
      formData.append('motorista', motorista)

      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/movements/${movementId}/end`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      Alert.alert('Sucesso', 'Movimentação finalizada com sucesso.')
      await fetchMovements()
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.error || 'Erro ao finalizar a movimentação.'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleCameraCapture = async (movementId: number, isStarting: boolean) => {
    const motorista = 'Nome do Motorista'
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const fileUri = result.assets[0].uri
      if (isStarting) {
        await startMovement(movementId, motorista, fileUri)
      } else {
        await endMovement(movementId, motorista, fileUri)
      }
    } else {
      console.log('Captura de imagem cancelada')
    }
  }

  const renderProgressBar = (status: string) => {
    let progressStyle

    if (status === 'created') {
      progressStyle = styles.progressCreated
    } else if (status === 'em transito') {
      progressStyle = styles.progressOngoing
    } else if (status === 'Coleta finalizada') {
      progressStyle = styles.progressCompleted
    }

    return (
      <View style={styles.progressBarBackground}>
        <View style={[progressStyle]} />
      </View>
    )
  }

  const renderMovement = ({ item }: { item: MovementType }) => {
    const isStarted = item.status === 'em transito'
    const isFinished = item.status === 'Coleta finalizada'
    let cardBackgroundColor = '#d9dae6'

    if (isStarted) {
      cardBackgroundColor = '#d4f4ff'
    } else if (isFinished) {
      cardBackgroundColor = '#daffda'
    }

    return (
      <View style={[styles.movementCard, { backgroundColor: cardBackgroundColor }]}>
        <View style={styles.productStyle}>
          {item.produto.imagem && (
            <Image
              source={{ uri: item.produto.imagem }}
              style={styles.image}
            />
          )}
          <View style={styles.cardHeader}>
            <Text style={styles.textButton}>{item.produto.nome}</Text>
            <Text style={styles.textButton}>{item.quantidade} UN</Text>
            <Text style={styles.textButton}>ID da movimentação: {item.id}</Text>
          </View>
        </View>

        <View style={styles.itemsStyle}>
          <Text style={styles.textStyle}>Origem: </Text>
          <Text>{item.origem?.nome || 'Origem não disponível'}</Text>
        </View>
        <View style={styles.itemsStyle}>
          <Text style={styles.textStyle}>Destino: </Text>
          <Text>{item.destino?.nome || 'Destino não disponível'}</Text>
        </View>
        <View style={styles.itemsStyle}>
          <Text style={styles.textStyle}>Status: </Text>
          <Text>{item.status}</Text>
        </View>
        <Text>Histórico:</Text>
        <FormattedDate dateString={item.dataCriacao} />

        {renderProgressBar(item.status)}

        <View style={styles.buttonStyle}>
          {!isStarted && !isFinished && (
            <TouchableOpacity style={styles.button} onPress={() => handleCameraCapture(item.id, true)}>
              <Text style={styles.textButton}>Iniciar entrega</Text>
            </TouchableOpacity>
          )}
          {isStarted && !isFinished && (
            <TouchableOpacity style={styles.button} onPress={() => handleCameraCapture(item.id, false)}>
              <Text style={styles.textButton}>Finalizar entrega</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mapa', {
            origem: item.origem,
            destino: item.destino
          })}>
            <Text style={styles.textButton}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.titleStyle}>Controle de movimentações</Text>
      {uploading && <ActivityIndicator size="large" color="#a8a8a8" />}
      <FlatList
        data={movements}
        renderItem={renderMovement}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
        <MaterialCommunityIcons name="exit-to-app" size={24} color="black" />
        <Text style={styles.logoutButton}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  button: {
    width: 'auto',
    height: 'auto',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#289fe4a6'
  },
  textButton: {
    fontWeight: '500',
    fontSize: 15
  },
  movementCard: {
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#000000',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    alignItems: 'flex-start',
    gap: 15
  },
  textStyle: {
    fontWeight: '500'
  },
  itemsStyle: {
    flexDirection: 'row',
  },
  titleStyle: {
    fontWeight: '500',
    fontSize: 20,
    marginVertical: 20,
    alignSelf: 'center'
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  image: {
    width: 60,
    height: 80,
    borderWidth: 1,
    borderColor: '#000'
  },
  productStyle: {
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    gap: 25
  },
  cardHeader: {
    justifyContent: 'space-between'
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
  },
  progressCreated: {
    height: '100%',
    width: '10%',
    backgroundColor: '#005a00',
    borderRadius: 5,
  },
  progressOngoing: {
    height: '100%',
    width: '50%',
    backgroundColor: '#005a00',
    borderRadius: 5,
  },
  progressCompleted: {
    height: '100%',
    width: '100%',
    backgroundColor: '#005a00',
    borderRadius: 5,
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
})
