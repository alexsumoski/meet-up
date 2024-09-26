import { Stack } from 'expo-router';
import { View, Text, Image, FlatList } from 'react-native';
import EventListItem from '~/components/EventListItem';

import events from '~/assets/events.json';

export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <FlatList
        className="bg-white"
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
      />
    </>
  );
}
