import { View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
export default function EventListItem({ event }: any) {
  return (
    <View className="m-3 gap-3 border-b-2 border-gray-100 pb-3">
      <View className="flex-row">
        <View className="flex-1 gap-2">
          <Text className="text-lg font-semibold uppercase text-amber-800">
            {dayjs(event.datetime).format('ddd, D MMM')} - {dayjs(event.datetime).format('h:mm A')}
          </Text>
          <Text className="pr-2 text-xl font-bold" numberOfLines={1}>
            {event.title}
          </Text>
          <Text className="text-gray-700">{event.location}</Text>
        </View>
        <Image className="aspect-video w-2/5 rounded-2xl" source={{ uri: event.image }} />
      </View>

      <View className="flex-row gap-5">
        <Text className="mr-auto text-gray-700">16 going</Text>
        <Feather name="share" size={18} color="gray" />
        <Feather name="bookmark" size={18} color="gray" />
      </View>
    </View>
  );
}
