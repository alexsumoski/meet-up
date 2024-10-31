import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import dayjs from 'dayjs';
import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { useAuth } from '~/contexts/AuthProvider';
import { Event, Attendance } from '~/types/db';
import SupaImage from '~/components/SupaImage';

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState<Event | null>();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching event:', error.message);
    } else {
      setEvent(data);

      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', id)
        .single();
      setAttendance(attendanceData);
    }
    setLoading(false);
  };

  const joinEvent = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .insert({ user_id: user.id, event_id: event!.id })
      .select()
      .single();

    setAttendance(data);
  };

  const leaveEvent = async () => {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', event!.id);

    if (error) {
      console.error('Error leaving event:', error.message);
    } else {
      setAttendance(null);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />
      <SupaImage path={event?.image_uri} className="aspect-video w-full rounded-2xl" />
      <Text className="pr-2 text-3xl font-bold" numberOfLines={1}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.date).format('ddd, D MMM')} - {dayjs(event.date).format('h:mm A')}
      </Text>
      <Text className="text-lg">{event.description}</Text>

      <Link href={`/event/${event.id}/attendance`} className="text-lg" numberOfLines={2}>
        View attendance
      </Link>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-200 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        {attendance ? (
          <Pressable onPress={() => leaveEvent()} className="rounded-lg bg-white p-5 px-3">
            <Text className="text-lg font-bold text-green-500">You are attending</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => joinEvent()} className="rounded-lg bg-red-400 p-5 px-8">
            <Text className="text-lg font-bold text-white">Join and RSVP</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
