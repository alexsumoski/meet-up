import { Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';

import { supabase } from '~/utils/supabase';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const { session } = useAuth();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setAvatarUrl(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string;
    website: string;
    avatar_url: string;
    full_name: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 gap-3 bg-white p-5">
      <Stack.Screen options={{ title: 'Profile' }} />
      <TextInput
        className="rounded-md border border-gray-200 px-6 py-5 text-gray-400"
        editable={false}
        value={session.user.email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="rounded-md border border-gray-200 px-6 py-5"
        onChangeText={(text) => setFullName(text)}
        value={fullName}
        placeholder="fullname"
        autoCapitalize="none"
      />
      <TextInput
        className="rounded-md border border-gray-200 px-6 py-5"
        onChangeText={(text) => setUsername(text)}
        value={username}
        placeholder="username"
        autoCapitalize="none"
      />
      <TextInput
        className="rounded-md border border-gray-200 px-6 py-5"
        onChangeText={(text) => setWebsite(text)}
        value={website}
        placeholder="website"
        autoCapitalize="none"
      />

      <Pressable
        onPress={() =>
          updateProfile({ username, website, full_name: fullName, avatar_url: avatarUrl })
        }
        disabled={loading}
        className="items-center rounded-md border-2 p-3 px-8 ">
        <Text>Save</Text>
      </Pressable>
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
