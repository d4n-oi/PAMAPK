import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, Image, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Frases() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const conselhos = [
    "Respire fundo. Você está exatamente onde precisa estar. 🌸",
    "Seja gentil com seu coração hoje. Ele bate só por você.",
    "Pequenos passos também te levam longe. Continue nadando! 🦆",
    "Você é magia pura em forma de gente. ✨",
    "O lago fica mais bonito quando você sorri.",
    "Não tenha pressa, a natureza nunca se apressa e tudo floresce.",
    "Sua paz é sua prioridade. Proteja-a com carinho. 🛡️",
    "Você já superou 100% dos seus dias difíceis. Orgulhe-se!",
    "Confie no tempo. O que é seu encontrará o caminho.",
    "Hoje, permita-se apenas ser. Sem cobranças. 🍃"
  ];

  const [frase, setFrase] = useState("Toque no botão para revelar sua mensagem mágica...");
  const [animacao, setAnimacao] = useState(1); 
  const gerarNovaFrase = () => {
    const numeroAleatorio = Math.floor(Math.random() * conselhos.length);
    setFrase(conselhos[numeroAleatorio]);
  };

  const compartilharFrase = async () => {
    try {
      await Share.share({ message: `O Pato Zen diz: "${frase}" 🦆✨` });
    } catch (error) { console.log(error.message); }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      
      <LinearGradient
        colors={['#FFF0F5', '#E6E6FA']} 
        style={styles.background}
      />

      
      <View style={styles.bolinha1} />
      <View style={styles.bolinha2} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Oráculo do Pato</Text>
      </View>

      <View style={styles.mainArea}>
        
        
        <View style={styles.patoContainer}>
            <Image 
            source={require('../../assets/images/PatinhoFrase.png')} 
            style={styles.patoImagem}
            />
        </View>

        <View style={styles.cardFrase}>
          
            <Text style={styles.aspas}>“</Text>
            
            <Text style={styles.textoFrase}>{frase}</Text>
            
            <Text style={styles.aspasFechamento}>”</Text>
        </View>

      
        <TouchableOpacity style={styles.btnGerar} onPress={gerarNovaFrase} activeOpacity={0.8}>
          <Text style={styles.txtBtn}>TIRAR UMA CARTA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnShare} onPress={compartilharFrase}>
          <Ionicons name="share-outline" size={20} color="#B39DDB" />
          <Text style={styles.txtShare}>Compartilhar frase</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  
  bolinha1: {
    position: 'absolute', top: 50, left: -50, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bolinha2: {
    position: 'absolute', bottom: 100, right: -30, width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(230, 230, 250, 0.5)',
  },

  header: { marginTop: 70, alignItems: 'center', marginBottom: 10 },
  titulo: { fontFamily: 'Poppins_700Bold', fontSize: 22, color: '#9575CD', letterSpacing: 1 },

  mainArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 90 },

  patoContainer: {
    marginBottom: -30, 
    zIndex: 10,
    elevation: 10
  },
  patoImagem: {
    width: 160, height: 160,
    resizeMode: 'contain',
  },

 
  cardFrase: {
    backgroundColor: '#FFF',
    width: width * 0.85,
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: "#9575CD",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  
  aspas: {
    position: 'absolute', top: 10, left: 20,
    fontSize: 60, fontFamily: 'Poppins_700Bold', color: '#F3E5F5' 
  },
  aspasFechamento: {
    position: 'absolute', bottom: -10, right: 20,
    fontSize: 60, fontFamily: 'Poppins_700Bold', color: '#F3E5F5'
  },
  
  textoFrase: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#7E57C2', 
    textAlign: 'center',
    lineHeight: 24
  },

  btnGerar: {
    backgroundColor: '#B39DDB', 
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#B39DDB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5
  },
  txtBtn: { 
    fontFamily: 'Poppins_700Bold', 
    color: '#FFF', 
    fontSize: 14, 
    letterSpacing: 1 
  },

  btnShare: { flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.8 },
  txtShare: { fontFamily: 'Poppins_400Regular', color: '#B39DDB', fontSize: 12 }
});