import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const pessoa1 = {
  nome: 'Leonardo Scotti- RM550769',
  foto: require('./assets/leo-foto.jpg')
};

const pessoa2 = {
  nome: 'Eduardo Violante- RM550364',
  foto: require('./assets/edu-foto.jpg')
};

function AddProductScreen({ navigation }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');

  async function salvar() {
    if (!nomeProduto.trim() || !precoProduto.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

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
    <View style={styles.formContainer}>
      <Text>CADASTRO DE PRODUTOS </Text>
    
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nomeProduto}
        onChangeText={text => setNomeProduto(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={precoProduto}
        onChangeText={text => setPrecoProduto(text)}
      />

      <TouchableOpacity style={styles.formBtn} onPress={salvar}>
        <Text style={{ color: 'white' }}>CADASTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ListProducts')}>
        <Text style={{ color: 'white' }}>VER PRODUTOS</Text>
      </TouchableOpacity>
      
      <View style={styles.personContainer}>
        <Text style={styles.personText}>{pessoa1.nome}</Text>
        <Image source={pessoa1.foto} style={styles.personImage} />
      </View>

      <View style={styles.personContainer}>
        <Text style={styles.personText}>{pessoa2.nome}</Text>
        <Image source={pessoa2.foto} style={styles.personImage} />
      </View>

      </View>

  );
}


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
    backgroundColor: 'black',
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
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formBtn: {
    borderWidth: 1,
    height: 50,
    width: '100%',
    borderRadius: 15,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  personContainer: {
  alignItems: 'center',
  marginTop: 20,
},
personText: {
  fontSize: 18,
},
personImage: {
  width: 100,
  height: 100,
  borderRadius: 50,
  marginTop: 10,
}
});

