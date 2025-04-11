import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Dimensions, Image, ScrollView, Animated } from 'react-native';
import { auth } from '../../config/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const phrases = [
    "Welcome to Wish2Work 👋",
    "Urgent roles, ready students. ⏱️🤝",
    "Your next opportunity is waiting. 🚀🎓"
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fadeInText();
  }, [currentPhraseIndex]);

  const fadeInText = () => {
    fadeAnim.setValue(0);  // Start with invisible text
    Animated.timing(fadeAnim, {
      toValue: 1,  // Fade in
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Success', 'You have logged in successfully!');
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.animatedText}>{phrases[currentPhraseIndex]}</Text>
      </Animated.View>

      <Image
        source={require('../../assets/logo.png')}
        style={styles.image}
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: "#EEF2F7"
  },
  animatedText: {
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: '600',
    marginBottom: height * 0.04,
    color: '#130160',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  input: {
    height: height * 0.07,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.03,
  },
  button: {
    backgroundColor: '#130160',
    paddingVertical: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: height * 0.03,
    textAlign: 'center',
    color: '#007bff',
  },
  image: {
    width: width * 0.7,
    height: width * 0.3,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: height * 0.02,
  },
});

export default Login;
