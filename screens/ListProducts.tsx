import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, FlatList, View, Image } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';

interface ProductsType {
  id: number;
  product_name: string;
  branch_name: string;
  quantity: number;
  image_url: string;
  description: string;
}

export default function ListProducts() {
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductsType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar produtos do backend
  const fetchProducts = () => {
    axios.get(process.env.EXPO_PUBLIC_API_URL + '/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Inicializa a lista filtrada
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para filtrar produtos
  const filterProducts = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = products.filter(product =>
      product.product_name?.toLowerCase().includes(lowercasedFilter) ||
      product.branch_name?.toLowerCase().includes(lowercasedFilter) // Ajuste aqui para usar o nome da filial
    );
    setFilteredProducts(filteredData);
  };

  // Função para renderizar cada item da lista
  const renderProduct = ({ item }: { item: ProductsType }) => (
    <View style={styles.productCard}>
      <View style={styles.styleSection}>
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.alignSection}>
          <Text style={styles.branchName}>{item.branch_name}</Text>
          <Text style={styles.productQuantity}>Quantidade: {item.quantity}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header/>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nome ou filial"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={filterProducts} // Filtra ao pressionar Enter
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()} // Verifica se id está definido
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  searchInput: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 15,
    alignItems: 'center'
  },
  styleSection: {
    width: '100%',
    alignItems: 'center',
    padding: 10
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10
  },
  description: {
    width: '100%',
    color: '#9b9b9b',
    marginBottom: 15
  },
  alignSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  branchName: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500'
  },
  productQuantity: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500'
  }  
});
