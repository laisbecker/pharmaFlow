import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, FlatList } from "react-native";
import Header from "../components/Header";
import axios from "axios";
import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
interface Branch {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
}

interface Products {
    branch_id: string;
    destination_branch_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    observations?: string;
}

export default function RegisterMov() {
    const navigation = useNavigation<NavigationProp<any>>();

    const [originBranch, setOriginBranch] = useState("");
    const [destinationBranch, setDestinationBranch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [obs, setObs] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState({origin: false, destination: false, product: false});

    const [filialOptions, setFilialOptions] = useState<Branch[]>([]);
    const [productOptions, setProductOptions] = useState<Products[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);

    const toggleDropdown = (key: keyof typeof dropdownOpen) => {
      setDropdownOpen(prev => ({
        origin: key === 'origin' ? !prev.origin : false,
        destination: key === 'destination' ? !prev.destination : false,
        product: key === 'product' ? !prev.product : false
      }))
    }

    useEffect(() => {
        axios
            .get(process.env.EXPO_PUBLIC_API_URL + "/branches/options")
            .then((response) => {
                setFilialOptions(response.data)
            })
            .catch((error) => console.log("Erro ao buscar filiais", error))

        axios
            .get(process.env.EXPO_PUBLIC_API_URL + "/products/options")
            .then((response) => {
                setProductOptions(response.data)
            })
            .catch((error) => console.log("Erro ao buscar produtos", error))
    }, [])

    const handleSubmit = () => {
        setErrorMessage("")

        if (
            !originBranch ||
            !destinationBranch ||
            !selectedProduct ||
            !quantity
        ) {
            setErrorMessage(
                "Todos os campos, exceto observações, devem ser preenchidos."
            )
            return
        }

        if (originBranch === destinationBranch) {
            setErrorMessage(
                "A filial de destino não pode ser igual a de origem."
            )
            return
        }

        const selectedProd = productOptions.find(
            (product) => String(product.product_id) === String(selectedProduct)
        )
        if (selectedProd && parseInt(quantity) > selectedProd.quantity) {
            setErrorMessage(
                `A quantidade não pode ser maior do que ${selectedProd.quantity} UN.`
            )
            setQuantity("")
            return
        }

        axios
            .post(process.env.EXPO_PUBLIC_API_URL + "/movements", {
                originBranchId: originBranch,
                destinationBranchId: destinationBranch,
                productId: selectedProduct,
                quantity: quantity,
            })
            .then(() => {
                Alert.alert("Movimentação registrada com sucesso!")
                navigation.navigate("ListMov")
            })
            .catch(() => {
                console.log("CATCH!")
            })
    };

    useEffect(() => {
        if (originBranch) {
            const filtered = productOptions.filter(
                (product) => String(product.branch_id) === String(originBranch)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [originBranch, productOptions]);

    return (
        <SafeAreaView style={styles.safeStyle}>
            <Header />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <FlatList
                    data={[1]}
                    keyExtractor={() => "root"}
                    renderItem={() => (
                        <View style={styles.scroll}>
                            <Text style={styles.titleStyle}>
                                Nova movimentação
                            </Text>
                            <View style={styles.formContainer}>
                              <View style={{zIndex: 3000}}>
                                <Text>Filial de origem</Text>
                                  <DropDownPicker
                                      open={dropdownOpen.origin}
                                      value={originBranch}
                                      items={filialOptions.map((filial) => ({
                                          label: filial.name,
                                          value: filial.id,
                                      }))}
                                      setOpen={() => toggleDropdown('origin')}
                                      setValue={setOriginBranch}
                                      placeholder="Selecione uma filial de origem"
                                      style={styles.dropdown}
                                      dropDownContainerStyle={styles.dropdownContainer}
                                      selectedItemLabelStyle={styles.selectedItem}
                                      listItemLabelStyle={styles.listItem}
                                      showTickIcon={true}
                                      TickIconComponent={() => (
                                          <MaterialIcons
                                              name="check"
                                              size={20}
                                              color="#00ffbf"
                                          />
                                      )}
                                      listItemContainerStyle={
                                          styles.listItemContainer
                                      }
                                  />
                              </View>

                              <View style={{ zIndex: 2000}}>
                                <Text>Filial de destino</Text>
                                  <DropDownPicker
                                      open={dropdownOpen.destination}
                                      value={destinationBranch}
                                      items={filialOptions.map((filial) => ({
                                          label: filial.name,
                                          value: filial.id,
                                      }))}
                                      setOpen={() => toggleDropdown('destination')}
                                      setValue={setDestinationBranch}
                                      placeholder="Selecione uma filial de destino"
                                      style={styles.dropdown}
                                      dropDownContainerStyle={styles.dropdownContainer}
                                      selectedItemLabelStyle={styles.selectedItem}
                                      listItemLabelStyle={styles.listItem}
                                      showTickIcon={true}
                                      TickIconComponent={() => (
                                          <MaterialIcons
                                              name="check"
                                              size={20}
                                              color="#00ffbf"
                                          />
                                      )}
                                      listItemContainerStyle={
                                          styles.listItemContainer
                                      }
                                  />
                              </View>

                              <View style={{ zIndex: 1000}}>
                                <Text>Produto desejado</Text>
                                  <DropDownPicker
                                    open={dropdownOpen.product}
                                    value={selectedProduct}
                                    items={filteredProducts.map((product) => ({
                                          label: `${product.product_name} - ${product.quantity} UN`,
                                          value: product.product_id,
                                      }))}
                                      setOpen={() => toggleDropdown('product')}
                                      setValue={setSelectedProduct}
                                      placeholder="Selecione um produto"
                                      style={styles.dropdown}
                                      dropDownContainerStyle={styles.dropdownContainer}
                                      selectedItemLabelStyle={styles.selectedItem}
                                      listItemLabelStyle={styles.listItem}
                                      showTickIcon={true}
                                      TickIconComponent={() => (
                                          <MaterialIcons
                                              name="check"
                                              size={20}
                                              color="#00ffbf"
                                          />
                                      )}
                                      listItemContainerStyle={
                                          styles.listItemContainer
                                      }
                                  />
                                </View>
                                
                                <Text>Quantidade desejada</Text>
                                <TextInput
                                    style={styles.input}
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="numeric"
                                    placeholder="Digite a quantidade desejada"
                                />
                                <Text>Observações</Text>
                                <TextInput
                                    style={styles.input}
                                    value={obs}
                                    onChangeText={setObs}
                                    placeholder="Digite uma observação, caso haja"
                                />
                                {errorMessage ? (
                                    <Text style={styles.error}>
                                        {errorMessage}
                                    </Text>
                                ) : null}
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.textButton}>Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeStyle: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    container: {
        flex: 1,
        zIndex: 1
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: "500",
        marginTop: 25,
        alignSelf: "center",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        alignSelf: "center",
        backgroundColor: "#fff",
        paddingLeft: 10,
    },
    formContainer: {
        flex: 1,
        width: "80%",
        alignItems: "flex-start",
        marginTop: 20,
    },
    scroll: {
        alignItems: "center",
        paddingBottom: 30,
        position: 'relative',
        marginBottom: 20,
        zIndex: 1
    },
    button: {
        width: 100,
        height: "auto",
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        alignItems: "center",
        backgroundColor: "#289fe4a6",
    },
    textButton: {
        fontWeight: "500",
        fontSize: 15,
    },
    error: {
        color: "#ff0000",
        marginTop: 10,
    },
    dropdown: {
        borderColor: "#000000",
        borderRadius: 5,
        marginVertical: 8,
        position: 'relative',
        zIndex: 10
    },
    dropdownContainer: {
        borderColor: "#000000",
        borderRadius: 5,
        marginTop: 4,
        zIndex: 1000
    },
    selectedItem: {
        color: "#289fe4a6",
        fontWeight: "600",
    },
    listItem: {
        color: "#333",
        zIndex: 9999
    },
    listItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        paddingVertical: 12,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        backgroundColor: "white",
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
    },
    inputAndroid: {
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        width: "100%",
    },
    placeholder: {
        color: "#bdbdbd",
    },
});
