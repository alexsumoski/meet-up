import { Stack } from 'expo-router';
import { View, Text, Image, FlatList, Alert } from 'react-native';
import EventListItem from '~/components/EventListItem';

import { supabase } from '~/utils/supabase';
import { useEffect, useState } from 'react';
import { NearbyEvent } from '~/types/db';
import * as Location from 'expo-location';

export default function Events() {
  const [events, setEvents] = useState<NearbyEvent[] | null>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [status, requestPermission] = Location.useForegroundPermissions();

  useEffect(() => {
    if (status && !status?.granted && status.canAskAgain) {
      requestPermission();
    }
  }, [status]);

  useEffect(() => {
    (async () => {
      if (!status?.granted) {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [status]);

  useEffect(() => {
    if (status?.granted && location) {
      fetchNearbyEvents();
    }
  }, [location]);

  // const fetchAllEvents = async () => {
  //   const { data, error } = await supabase.from('events').select('*');
  //   setEvents(data);
  // };

  const fetchNearbyEvents = async () => {
    if (!location) return;
    const { data, error } = await supabase.rpc('nearby_events', {
      lat: location.coords.latitude,
      long: location.coords.longitude,
    });
    setEvents(data);
  };

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
