import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, TextBase } from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

interface Branch {
  id: string,
  name: string,
  location: string,
  latitude: number,
  longitude: number
}

interface Products {
  branch_id: string,
  destination_branch_id: string,
  product_id: string,
  product_name: string,
  quantity: number,
  observations?: string,
}

export default function RegisterMov() {
  const navigation = useNavigation<NavigationProp<any>>()

  const [originBranch, setOriginBranch] = useState('')
  const [destinationBranch, setDestinationBranch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [obs, setObs] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [filialOptions, setFilialOptions] = useState<Branch[]>([])
  const [productOptions, setProductOptions] = useState<Products[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([])

  useEffect(() => {

    axios.get(process.env.EXPO_PUBLIC_API_URL + '/branches/options')
      .then((response) => {
        setFilialOptions(response.data)
      })
      .catch(() => console.log('Catch!'))

    axios.get(process.env.EXPO_PUBLIC_API_URL + '/products/options')
      .then((response) => {
        setProductOptions(response.data)
      })
      .catch(() => console.log('Catch!'))
  }, [])

  const handleSubmit = () => {
    setErrorMessage('')

    if (!originBranch || !destinationBranch || !selectedProduct || !quantity) {
      setErrorMessage('Todos os campos, exceto observações, devem ser preenchidos.');
      return
    }

    if (originBranch === destinationBranch) {
      setErrorMessage('A filial de origem e a filial de destino não podem ser iguais.');
      return
    }

    const selectedProd = productOptions.find(product => String(product.product_id) === String(selectedProduct));
    if (selectedProd && parseInt(quantity) > selectedProd.quantity) {
      setErrorMessage(`A quantidade não pode ser maior do que ${selectedProd.quantity} UN.`)
      setQuantity('')
      return;
    }

    axios.post(process.env.EXPO_PUBLIC_API_URL + '/movements', {
      originBranchId: originBranch,
      destinationBranchId: destinationBranch,
      productId: selectedProduct,
      quantity: quantity,
    })
      .then(() => {
        Alert.alert('Movimentação registrada com sucesso!')
        navigation.navigate('ListMov')
      })
      .catch(() => {
        console.log('CATCH!')
      })
  }

  useEffect(() => {
    if (originBranch) {
      const filtered = productOptions.filter(product => String(product.branch_id) === String(originBranch))
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [originBranch, productOptions])

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
          <Text style={styles.titleStyle}>Nova movimentação</Text>
          <View style={styles.formContainer}>
            <Text>Filial de origem</Text>
            <RNPickerSelect
              onValueChange={(value) => setOriginBranch(value)}
              items={[
                ...filialOptions.map(filial => ({ label: filial.name, value: filial.id })),
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Selecione uma filial de origem', value: null }}
            />

            <Text>Filial de destino</Text>
            <RNPickerSelect
              onValueChange={(value) => setDestinationBranch(value)}
              items={[
                ...filialOptions.map(filial => ({ label: filial.name, value: filial.id })),
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Selecione uma filial de destino', value: null }}
            />

            <Text>Produto desejado</Text>
            <RNPickerSelect
              onValueChange={(value) => {
                setSelectedProduct(value)
              }}
              items={[
                ...filteredProducts.map(product => ({
                  label: `${product.product_name} - ${product.quantity} UN`,
                  value: product.product_id,
                })),
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Selecione um produto', value: null }}
            />

            <Text>Quantidade desejada</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType='numeric'
              placeholder='Digite a quantidade desejada'
            />
            <Text>Observações</Text>
            <TextInput
              style={styles.input}
              value={obs}
              onChangeText={setObs}
              placeholder='Digite uma observação, caso haja'
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.textButton}>Cadastrar</Text>
          </TouchableOpacity>
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
  titleStyle: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 25,
    alignSelf: 'center'
  },
  input: {
    width: '100%',
    height: 43,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10
  },
  formContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  button: {
    width: 100,
    height: 'auto',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#289fe4a6',
  },
  textButton: {
    fontWeight: '500',
    fontSize: 15
  },
  error: {
    color: '#ff0000',
    marginTop: 10
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    width: '100%',

  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  },
  placeholder: {
    color: '#bdbdbd',
  },
})
