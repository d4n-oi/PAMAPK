import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Home() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [cliques, setCliques] = useState(0);
  const [nivel, setNivel] = useState('Iniciante');
  const [metaProximoNivel, setMetaProximoNivel] = useState(10);
  const [modoZen, setModoZen] = useState(false);
  const [instrucaoZen, setInstrucaoZen] = useState('Inspire...');

  const scaleValue = useRef(new Animated.Value(1)).current;
  const breathValue = useRef(new Animated.Value(1)).current; 

  const progresso = Math.min((cliques / metaProximoNivel) * 100, 100);

  const animarPatoClique = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.spring(scaleValue, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
  };

  const calcularNivel = (total) => {
    if (total < 10) { setNivel('Ovo 🥚'); setMetaProximoNivel(10); }
    else if (total < 50) { setNivel('Patinho 🐥'); setMetaProximoNivel(50); }
    else if (total < 100) { setNivel('Explorador 🧢'); setMetaProximoNivel(100); }
    else { setNivel('Rei do Lago 👑'); setMetaProximoNivel(total + 100); }
  };

  const carregarDados = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('pato.db');
      
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS jogo (id INTEGER PRIMARY KEY NOT NULL, cliques INTEGER NOT NULL);
      `);

      const resultado = await db.getAllAsync('SELECT * FROM jogo WHERE id = 1');
      if (resultado.length > 0) {
        setCliques(resultado[0].cliques);
        calcularNivel(resultado[0].cliques);
      } else {
        await db.runAsync('INSERT INTO jogo (id, cliques) VALUES (1, 0)');
      }
    } catch (error) {
      console.log("Erro ao carregar banco:", error);
    }
  };

  const clicarNoPato = async () => {
    if (modoZen) return;
    animarPatoClique();
    const novoValor = cliques + 1;
    setCliques(novoValor);
    calcularNivel(novoValor);
    const db = await SQLite.openDatabaseAsync('pato.db');
    await db.runAsync('UPDATE jogo SET cliques = ? WHERE id = 1', [novoValor]);
  };

  const confirmarReset = () => {
    Alert.alert(
      "Reiniciar Jornada?",
      "Tem certeza que deseja zerar seus cliques? O pato voltará a ser um ovo!",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, zerar", 
          style: 'destructive',
          onPress: async () => {
            setCliques(0);
            calcularNivel(0);
            const db = await SQLite.openDatabaseAsync('pato.db');
            await db.runAsync('UPDATE jogo SET cliques = 0 WHERE id = 1');
          }
        }
      ]
    );
  };

  useEffect(() => {
    let timerTexto;
    if (modoZen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathValue, { toValue: 1.2, duration: 4000, useNativeDriver: true }),
          Animated.timing(breathValue, { toValue: 1.0, duration: 4000, useNativeDriver: true })
        ])
      ).start();

      setInstrucaoZen('Inspire...');
      timerTexto = setInterval(() => {
        setInstrucaoZen((prev) => prev === 'Inspire...' ? 'Expire...' : 'Inspire...');
      }, 4000);

    } else {
      breathValue.stopAnimation();
      breathValue.setValue(1);
      clearInterval(timerTexto);
    }
    return () => clearInterval(timerTexto);
  }, [modoZen]);

  useEffect(() => {
    carregarDados();
  }, []);

  if (!fontsLoaded) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={modoZen ? "light-content" : "dark-content"} />
      
      <LinearGradient
        colors={modoZen ? ['#E1F5FE', '#81D4FA'] : ['#FFF0F5', '#FFD1DC']}
        style={styles.background}
      />

      <View style={styles.header}>
        {!modoZen && (
          <View style={styles.tagNivel}>
            <Ionicons name="sparkles" size={16} color="#FF69B4" />
            <Text style={styles.tagTexto}>{nivel}</Text>
          </View>
        )}
        
        {!modoZen && (
          <View style={styles.headerButtons}>
            
            {/* Botão Reset (Novo) */}
            <TouchableOpacity style={styles.btnConfig} onPress={confirmarReset}>
              <Ionicons name="refresh" size={22} color="#FF69B4" />
            </TouchableOpacity>

            {/* Botão Zen */}
            <TouchableOpacity style={styles.btnConfig} onPress={() => setModoZen(true)}>
              <Ionicons name="heart" size={22} color="#FF69B4" />
            </TouchableOpacity>
          
          </View>
        )}
      </View>

      <View style={styles.mainArea}>
        
        {!modoZen && (
          <>
            <View style={styles.cardPlacar}>
              <Text style={styles.labelPlacar}>AMOR ACUMULADO</Text>
              <Text style={styles.valorPlacar}>{cliques}</Text>
            </View>

            <View style={styles.bgPato} />

            <TouchableOpacity onPress={clicarNoPato} activeOpacity={1}>
              <Animated.Image 
                source={require('../../assets/images/Patinho.png')} 
                style={[styles.patoImagem, { transform: [{ scale: scaleValue }] }]} 
              />
            </TouchableOpacity>

            <View style={styles.barraContainer}>
              <View style={styles.infoBarra}>
                <Text style={styles.textoBarra}>Próxima Evolução</Text>
                <Text style={styles.textoBarra}>{Math.floor(progresso)}%</Text>
              </View>
              <View style={styles.trilhoBarra}>
                <View style={[styles.enchimentoBarra, { width: `${progresso}%` }]} />
              </View>
            </View>
          </>
        )}

        {modoZen && (
          <View style={styles.zenContainer}>
            <Text style={styles.zenTag}>MOMENTO DE PAZ</Text>

            <View style={styles.zenAnimationArea}>
              <Animated.View style={[styles.rippleCircle, { 
                 width: 320, height: 320, opacity: 0.2,
                 transform: [{ scale: breathValue }] 
              }]} />
              
              <Animated.View style={[styles.rippleCircle, { 
                 width: 260, height: 260, opacity: 0.4,
                 transform: [{ scale: breathValue }] 
              }]} />

              <Animated.Image 
                source={require('../../assets/images/Patinho.png')} 
                style={[styles.patoZen, { transform: [{ scale: breathValue }] }]} 
              />
            </View>

            <Text style={styles.instrucaoZen}>{instrucaoZen}</Text>

            <TouchableOpacity style={styles.btnSairZen} onPress={() => setModoZen(false)}>
              <Text style={styles.txtSairZen}>Encerrar Sessão</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  
  header: { 
    marginTop: 60, flexDirection: 'row', justifyContent: 'space-between', 
    paddingHorizontal: 20, alignItems: 'center', height: 50 
  },
  
  tagNivel: { 
    flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, 
    borderRadius: 25, alignItems: 'center', gap: 8, elevation: 2, 
    shadowColor: '#FFB6C1', shadowOpacity: 0.3, shadowOffset: {width:0, height:2} 
  },
  tagTexto: { color: '#FF69B4', fontFamily: 'Poppins_600SemiBold', fontSize: 14 },

  headerButtons: { flexDirection: 'row', gap: 10, marginLeft: 'auto' },

  btnConfig: { 
    padding: 10, backgroundColor: '#FFF', borderRadius: 50, elevation: 2,
    alignItems: 'center', justifyContent: 'center'
  },
  
  mainArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 50 },
  
  cardPlacar: { alignItems: 'center', marginBottom: 20 },
  labelPlacar: { color: '#FF9EAA', fontFamily: 'Poppins_600SemiBold', fontSize: 12, letterSpacing: 2 },
  valorPlacar: { color: '#FF69B4', fontFamily: 'Poppins_700Bold', fontSize: 80, marginTop: -10, textShadowColor: 'rgba(255, 182, 193, 0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 10 },
  bgPato: { position: 'absolute', width: 280, height: 280, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 140, top: '32%' },
  patoImagem: { width: 260, height: 260, resizeMode: 'contain', marginBottom: 40 },
  barraContainer: { width: '80%' },
  infoBarra: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  textoBarra: { color: '#FF69B4', fontFamily: 'Poppins_600SemiBold', fontSize: 12 },
  trilhoBarra: { height: 15, backgroundColor: '#FFF', borderRadius: 10, padding: 2 },
  enchimentoBarra: { height: '100%', backgroundColor: '#A0E7E5', borderRadius: 8 },

  zenContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 40 },
  zenTag: { color: '#0277BD', fontFamily: 'Poppins_600SemiBold', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' },
  zenAnimationArea: { alignItems: 'center', justifyContent: 'center', height: 350 },
  rippleCircle: { position: 'absolute', backgroundColor: '#FFF', borderRadius: 999 },
  patoZen: { width: 220, height: 220, resizeMode: 'contain', zIndex: 10 },
  instrucaoZen: { fontSize: 36, fontFamily: 'Poppins_700Bold', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  btnSairZen: { backgroundColor: 'rgba(255,255,255,0.3)', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, borderWidth: 1, borderColor: '#FFF' },
  txtSairZen: { color: '#FFF', fontFamily: 'Poppins_600SemiBold', fontSize: 14 }
});