import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Diario() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [texto, setTexto] = useState('');
  const [humor, setHumor] = useState('Feliz'); 
  const [historico, setHistorico] = useState([]);

  const carregarHistorico = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('pato.db');
      
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS diario (
          id INTEGER PRIMARY KEY NOT NULL, 
          data TEXT NOT NULL, 
          humor TEXT NOT NULL, 
          texto TEXT NOT NULL
        );
      `);

      const registros = await db.getAllAsync('SELECT * FROM diario ORDER BY id DESC');
      setHistorico(registros);
    } catch (error) {
      console.log("Erro ao carregar diário:", error);
    }
  };

  const salvarDiario = async () => {
    if (texto === '') return;
    
    try {
      const db = await SQLite.openDatabaseAsync('pato.db');
      const dataHoje = new Date().toLocaleDateString('pt-BR');
      
      await db.runAsync('INSERT INTO diario (data, humor, texto) VALUES (?, ?, ?)', [dataHoje, humor, texto]);
      
      setTexto('');
      Keyboard.dismiss();
      carregarHistorico(); 
    } catch (error) {
      console.log("Erro ao salvar:", error);
    }
  };

  const deletarItem = async (id) => {
    try {
      const db = await SQLite.openDatabaseAsync('pato.db');
      await db.runAsync('DELETE FROM diario WHERE id = ?', [id]);
      carregarHistorico();
    } catch (error) {
      console.log("Erro ao deletar:", error);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const renderIconeHumor = (tipo) => {
    switch(tipo) {
      case 'Feliz': return 'happy';
      case 'Estressado': return 'thunderstorm';
      case 'Cansado': return 'battery-dead';
      default: return 'help';
    }
  };

  if (!fontsLoaded) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient colors={['#FFF0F5', '#FFD1DC']} style={styles.background} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Meu Diário</Text>
        <Text style={styles.subtitulo}>Como está seu coração hoje?</Text>
      </View>

      <View style={styles.inputCard}>
        <View style={styles.humorContainer}>
          {['Feliz', 'Estressado', 'Cansado'].map((tipo) => (
            <TouchableOpacity 
              key={tipo} 
              onPress={() => setHumor(tipo)} 
              style={[styles.btnHumor, humor === tipo && styles.btnHumorAtivo]}
            >
              <Ionicons 
                name={tipo === 'Feliz' ? 'happy-outline' : tipo === 'Estressado' ? 'thunderstorm-outline' : 'battery-dead-outline'} 
                size={24} 
                color={humor === tipo ? '#FFF' : '#FFB7B2'} 
              />
              <Text style={[styles.txtHumor, humor === tipo && styles.txtHumorAtivo]}>{tipo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Escreva seus sentimentos aqui..."
          placeholderTextColor="#FFB7B2"
          value={texto}
          onChangeText={setTexto}
          multiline={true}
        />

        <TouchableOpacity style={styles.btnSalvar} onPress={salvarDiario}>
          <Text style={styles.txtSalvar}>GUARDAR NO CORAÇÃO</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listaContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => deletarItem(item.id)} style={styles.cardItem}>
            <View style={styles.cardIcone}>
               <Ionicons name={renderIconeHumor(item.humor)} size={20} color="#FF69B4" />
            </View>
            <View style={styles.cardConteudo}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardData}>{item.data}</Text>
                <Text style={styles.cardHumorTag}>{item.humor}</Text>
              </View>
              <Text style={styles.cardTexto}>{item.texto}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Seu diário está vazio como uma folha em branco... 🍃</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  
  header: { marginTop: 60, paddingHorizontal: 20, marginBottom: 20, alignItems: 'center' },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 26, color: '#FF69B4' },
  subtitulo: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FF9EAA' },

  inputCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#FFB6C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  
  humorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  btnHumor: { 
    alignItems: 'center', justifyContent: 'center', 
    padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#FFE4E1', width: '30%',
    backgroundColor: '#FFF0F5'
  },
  btnHumorAtivo: { backgroundColor: '#FFB7B2', borderColor: '#FFB7B2' },
  txtHumor: { fontFamily: 'Poppins_400Regular', fontSize: 10, marginTop: 4, color: '#FFB7B2' },
  txtHumorAtivo: { color: '#FFF', fontWeight: 'bold' },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    height: 80,
    textAlignVertical: 'top',
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFE4E1'
  },

  btnSalvar: {
    backgroundColor: '#FFB7B2', 
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#FFB7B2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  txtSalvar: { fontFamily: 'Poppins_700Bold', color: '#FFF', fontSize: 14, letterSpacing: 1 },

  listaContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  cardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB7B2'
  },
  cardIcone: {
    width: 35, height: 35, backgroundColor: '#FFF0F5', borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginRight: 15
  },
  cardConteudo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardData: { fontFamily: 'Poppins_400Regular', fontSize: 10, color: '#AAA' },
  cardHumorTag: { fontFamily: 'Poppins_600SemiBold', fontSize: 10, color: '#FF69B4', textTransform: 'uppercase' },
  cardTexto: { fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#555' },

  vazio: { textAlign: 'center', color: '#FFB7B2', marginTop: 20, fontFamily: 'Poppins_400Regular', fontStyle:'italic' }
});