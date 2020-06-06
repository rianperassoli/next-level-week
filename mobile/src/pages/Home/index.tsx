import React, { useState, useEffect } from 'react'
import { View, ImageBackground, Text, Image, StyleSheet, Picker, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

interface IBGEUFResponse {
  sigla: string
  nome: string
}

interface IBGECityResponse {
  nome: string
}

interface State {
  initials: string
  name: string
}

const Home = () => {
  const navigation = useNavigation()

  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')
  const [ufs, setUfs] = useState<State[]>([])
  const [cities, setCities] = useState<string[]>([])

  const handleNavigateToPoints = () => {
    navigation.navigate('Points', { uf, city })
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufs = response.data.map(uf => ({ initials: uf.sigla, name: uf.nome }))
      setUfs(ufs)
    })
  }, [])

  useEffect(() => {
    if (uf === '') {
      return
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome)
      setCities(cityNames)
    })
  }, [uf])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={styles.imageBackground}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />

          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

        <View style={styles.footer}>

          <Picker
            selectedValue={uf}
            style={styles.select}
            onValueChange={(value) => setUf(value)}
          >
            {ufs.map((ufItem, index) => (
              <Picker.Item key={String(index)} label={ufItem.name} value={ufItem.initials} />
            ))}
          </Picker>

          <Picker
            selectedValue={city}
            style={styles.select}
            onValueChange={(value) => setCity(value)}
          >
            {cities.map((cityItem, index) => (
              <Picker.Item key={String(index)} label={cityItem} value={cityItem} />
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  imageBackground: {
    width: 274,
    height: 368
  }
});

export default Home