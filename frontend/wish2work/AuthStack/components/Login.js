import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Dimensions, Image } from 'react-native';
import { auth } from '../../config/auth';  // Ensure auth is from the correct config
import { signInWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');  // Get window dimensions

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Success', 'You have logged in successfully!');
      // Navigate to the main app screen or dashboard here
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
   <Image
        source={require('../../assets/logo.png')}  // Replace with the local image path
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05,  // Adjust padding based on screen width
  },
  title: {
    fontSize: width * 0.08,  // Adjust font size based on screen width
    fontWeight: 'bold',
    marginBottom: height * 0.05,  // Adjust margin based on screen height
    textAlign: 'center',
  },
  input: {
    height: height * 0.07,  // Adjust height based on screen height
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: width * 0.05,  // Adjust padding based on screen width
    marginBottom: height * 0.03,  // Adjust margin based on screen height
  },
  button: {
    backgroundColor: '#130160',
    paddingVertical: height * 0.02,  // Adjust padding based on screen height
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,  // Adjust font size based on screen width
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: height * 0.03,  // Adjust margin based on screen height
    textAlign: 'center',
    color: '#007bff',
  },
  image: {
    width: width * 0.7,  // Set image width
    height: width * 0.3,  // Set image width

    resizeMode: 'contain',  // Ensure image maintains aspect ratio
    alignSelf: 'center',  // Center the image
    marginBottom: height*0.02
  }
});

export default Login;
