import { Tabs } from 'expo-router';
import { Home, MapPin, Sparkles, Heart, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderColor: '#F3F4F6',
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="near-me"
        options={{
          title: 'Near Me',
          tabBarIcon: ({ color, size }) => (
            <MapPin color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="deb-decides"
        options={{
          title: 'Deb Decides',
          tabBarIcon: ({ color, size }) => (
            <Sparkles color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}


