/* import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from 'axios';

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [genre, setGenre] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const userData = {
      username,
      email,
      password,
      date_naissance: dateNaissance,
      genre,
    };

    axios
      .post('http://192.168.11.109:8000/api/user/register/', userData)
      .then((response) => {
        setMessage('User registered successfully!');
        router.push("/login")
        console.log(response.data);
      })
      .catch((error) => {
        setMessage('Error registering user.');
        console.error(error);
      });
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance"
        value={dateNaissance}
        onChangeText={setDateNaissance}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <Button title="S'inscrire" onPress={handleSubmit} />
      {message && <Text>{message}</Text>}

      <Text style={styles.link} onPress={() => router.push("/login")}>
        Déjà un compte ? Connectez-vous
      </Text>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
  },
});

 */

import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from 'axios';

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const userData = {
      Username: username,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: password
    };

    axios
      .post('http://192.168.11.109:8000/api/user/register/', userData)
      .then((response) => {
        setMessage('Utilisateur inscrit avec succès !');
        router.push("/login");
        console.log(response.data);
      })
      .catch((error) => {
        setMessage("Erreur lors de l'inscription.");
        console.error(error.response?.data || error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="S'inscrire" onPress={handleSubmit} />
      {message && <Text>{message}</Text>}

      <Text style={styles.link} onPress={() => router.push("/login")}>
        Déjà un compte ? Connectez-vous
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
  },
  link: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
  },
});
