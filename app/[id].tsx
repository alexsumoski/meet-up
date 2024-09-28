import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, Pressable } from 'react-native';
import events from '~/assets/events.json';
import dayjs from 'dayjs';

export default function EventPage() {
  const { id } = useLocalSearchParams();
  const event = events.find((event) => event.id === id);

  if (!event) {
    return <Text>No event found :(</Text>;
  }
  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <Stack.Screen
        options={{ title: 'Event', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />
      <Image className="aspect-video w-full rounded-2xl" source={{ uri: event.image }} />
      <Text className="pr-2 text-3xl font-bold" numberOfLines={1}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.datetime).format('ddd, D MMM')} - {dayjs(event.datetime).format('h:mm A')}
      </Text>
      <Text className="text-lg">{event.description}</Text>

      <View className=" absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-200 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>
        <Pressable className="rounded-lg bg-red-400 p-5 px-8">
          <Text className="text-lg font-bold text-white">Join and RSVP</Text>
        </Pressable>
      </View>
    </View>
  );
}
