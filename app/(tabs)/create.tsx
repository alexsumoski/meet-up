import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, Button, Pressable, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

export default function CreateEvent() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const createEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, description, date: date.toISOString(), user_id: user.id }])
      .select()
      .single();

    if (!error) {
      setTitle('');
      setDescription('');
      setDate(new Date());
      setLoading(false);
      router.push(`/event/${data?.id}`);
    } else {
      Alert.alert('Failed to create the event:', error.message);
    }
  };

  return (
    <View className="flex-1 gap-3 bg-white p-5">
      <TextInput
        value={title}
        // onChangeText={(text) => setTitle(text)}
        onChangeText={setTitle}
        placeholder="Title"
        className="rounded-md border border-gray-200 p-3"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
        numberOfLines={3}
        className="min-h-32 rounded-md border border-gray-200 p-3"
      />
      <Text className="rounded-md border border-gray-200 p-3" onPress={() => setOpen(true)}>
        {date.toLocaleString()}
      </Text>
      <DatePicker
        modal
        open={open}
        date={date}
        minimumDate={new Date()}
        minuteInterval={15}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Pressable
        className="mt-auto items-center rounded-md bg-amber-400 p-3 px-8"
        disabled={loading}
        onPress={() => createEvent()}>
        <Text className="text-lg font-bold text-white">Create Event</Text>
      </Pressable>
    </View>
  );
}
