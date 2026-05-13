import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { challenges, courts, players } from '@/data/mockData';
import { PremiumButton } from '@/components/common/PremiumButton';
import { Challenge } from '@/types/models';

function challengeOpponent(challenge: Challenge) {
  return players.find((player) => player.id === challenge.to) || {
    ...players[0],
    id: 'open-invite',
    name: 'Open invite',
    username: '@open.match',
    avatar: players[0].avatar,
  };
}

export default function Challenges() {
  const [items, setItems] = useState(challenges);
  const update = (id: string, status: Challenge['status']) => setItems((value) => value.map((item) => (item.id === id ? { ...item, status } : item)));

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#F7F3F0' }}>
      <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 6 }}>Challenges</Text>
      <Text style={{ color: '#6F666B', marginBottom: 12 }}>Incoming, sent, and accepted games</Text>
      {items.map((challenge) => {
        const opponent = challengeOpponent(challenge);
        const court = courts.find((item) => item.id === challenge.courtId) || courts[0];
        return (
          <View key={challenge.id} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 14, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={{ uri: opponent.avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800' }}>{opponent.name}</Text>
                <Text style={{ color: '#6F666B' }}>{court.name} - {challenge.date}</Text>
              </View>
              <Text style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, backgroundColor: '#f3e9ee', color: '#660033' }}>{challenge.status}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <View style={{ flex: 1 }}><PremiumButton label="Accept" onPress={() => update(challenge.id, 'Accepted')} /></View>
              <View style={{ flex: 1 }}><PremiumButton label="Decline" variant="subtle" onPress={() => update(challenge.id, 'Sent')} /></View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
