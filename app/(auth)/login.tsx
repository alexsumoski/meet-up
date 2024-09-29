import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { supabase } from '~/utils/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Sign in successful!');
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Sign up successful!');
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 gap-3 bg-white p-5 pt-10">
      <TextInput
        className="rounded-md border border-gray-200 px-6 py-5"
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="rounded-md border border-gray-200 px-6 py-5"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize="none"
      />
      <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
    </View>
  );
}
