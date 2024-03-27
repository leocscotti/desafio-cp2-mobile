import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Tela para adicionar produtos
function AddProductScreen({ navigation }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');

  async function salvar() {
    let produtos = [];
    if (await AsyncStorage.getItem('PRODUTOS') !== null) {
      produtos = JSON.parse(await AsyncStorage.getItem('PRODUTOS'));
    }

    produtos.push({ nome: nomeProduto, preco: precoProduto });

    await AsyncStorage.setItem('PRODUTOS', JSON.stringify(produtos));
    alert('PRODUTO SALVO');
    setNomeProduto('');
    setPrecoProduto('');
  }

  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={{ color: 'white' }}>CADASTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ListProducts')}>
        <Text style={{ color: 'white' }}>VER PRODUTOS</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela para listar os produtos
function ListProductsScreen({ navigation }) {
  const [listProdutos, setListProdutos] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      buscarDados();
    });

    return unsubscribe;
  }, [navigation]);

  async function buscarDados() {
    const p = await AsyncStorage.getItem('PRODUTOS');
    setListProdutos(JSON.parse(p) || []);
  }

  return (
    <View style={styles.container}>
      <Text>LISTA DE PRODUTOS</Text>

      <FlatList
        data={listProdutos}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('DeleteProduct', { produto: item })}>
            <Text style={{ fontSize: 18 }}>NOME: {item.nome} PREÇO: {item.preco}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('AddProduct')}>
        <Text style={{ color: 'white' }}>ADICIONAR PRODUTO</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela para excluir produtos
function DeleteProductScreen({ route, navigation }) {
  const { produto } = route.params;

  async function deletarProduto() {
    let produtos = await AsyncStorage.getItem('PRODUTOS');
    produtos = JSON.parse(produtos).filter((item) => item.nome !== produto.nome);
    await AsyncStorage.setItem('PRODUTOS', JSON.stringify(produtos));
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text>EXCLUIR PRODUTO</Text>
      <Text style={{ fontSize: 18 }}>NOME: {produto.nome}</Text>
      <Text style={{ fontSize: 18 }}>PREÇO: {produto.preco}</Text>

      <TouchableOpacity style={styles.btnDelete} onPress={deletarProduto}>
        <Text style={{ color: 'white' }}>EXCLUIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddProduct">
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ListProducts" component={ListProductsScreen} />
        <Stack.Screen name="DeleteProduct" component={DeleteProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  btn: {
    borderWidth: 1,
    height: 50,
    width: '100%',
    borderRadius: 15,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  itemContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 15,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  btnDelete: {
    backgroundColor: 'red',
    borderRadius: 12,
    width: 100,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
