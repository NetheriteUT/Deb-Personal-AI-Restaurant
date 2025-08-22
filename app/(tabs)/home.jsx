import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, MapPin, Clock, Star, DollarSign, Heart, MessageCircle, TrendingUp, Utensils, Coffee } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    getCurrentLocation();
    setTimeOfDay(getTimeOfDay());
  }, []);

  useEffect(() => {
    if (location) {
      loadRecommendations();
    }
  }, [location]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Set a default location for demo
        setLocation({ latitude: 40.7128, longitude: -74.0060 });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocation({ latitude: 40.7128, longitude: -74.0060 });
    }
  };

  const loadRecommendations = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          latitude: location.latitude,
          longitude: location.longitude,
          mood: `${timeOfDay} cravings`,
          craving: ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setGreeting(data.greeting || `Good ${timeOfDay}! Here's what I think you'll love today:`);
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Set fallback recommendations
      setFallbackRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackRecommendations = () => {
    const fallbackRecs = [
      {
        id: 1,
        restaurantName: "Sunrise Cafe",
        dishName: "Avocado Toast Supreme",
        description: "Fresh avocado, heirloom tomatoes, and everything bagel seasoning",
        basePrice: 14.50,
        distance: "0.2 mi",
        rating: 4.8,
        estimatedTime: "15-20 min",
        debsNote: "Perfect for a healthy start to your day! The fresh ingredients will give you that energy boost you need ☀️",
        confidence: 92,
        photos: null,
        customizations: [
          {
            name: "Add-ons",
            options: [
              { label: "Poached Egg", price: 2.00 },
              { label: "Smoked Salmon", price: 4.00 },
              { label: "Extra Avocado", price: 1.50 }
            ]
          }
        ]
      },
      {
        id: 2,
        restaurantName: "Luigi's Corner",
        dishName: "Truffle Mushroom Risotto",
        description: "Creamy arborio rice with wild mushrooms and truffle oil",
        basePrice: 22.00,
        distance: "0.4 mi",
        rating: 4.6,
        estimatedTime: "25-30 min",
        debsNote: "This is comfort food at its finest! Rich, creamy, and absolutely satisfying 🍄",
        confidence: 88,
        photos: null,
        customizations: [
          {
            name: "Protein",
            options: [
              { label: "Grilled Chicken", price: 5.00 },
              { label: "Pan-seared Shrimp", price: 7.00 }
            ]
          }
        ]
      }
    ];
    
    setRecommendations(fallbackRecs);
    setGreeting(`Good ${timeOfDay}! I've got some delicious suggestions for you:`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const addToFavorites = async (recommendation) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          restaurantName: recommendation.restaurantName,
          restaurantPlaceId: recommendation.restaurantId,
          dishName: recommendation.dishName,
          dishPrice: recommendation.basePrice,
          dishDescription: recommendation.description,
          restaurantAddress: recommendation.restaurantAddress,
          restaurantRating: recommendation.rating
        })
      });

      if (response.ok) {
        Alert.alert('Added to Favorites! ❤️', `${recommendation.dishName} from ${recommendation.restaurantName} has been saved to your favorites.`);
      } else {
        const data = await response.json();
        Alert.alert('Oops!', data.error || 'Could not add to favorites');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Error', 'Could not add to favorites. Please try again.');
    }
  };

  const RecommendationCard = ({ recommendation, index }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    }}>
      {/* Header with confidence and favorite */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <View style={{
          backgroundColor: '#ECFDF5',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#059669' }}>
            {recommendation.confidence}% Match
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => addToFavorites(recommendation)}
          style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 12,
            padding: 8,
          }}
        >
          <Heart size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Photo placeholder */}
      <View style={{
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        height: 140,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Utensils size={32} color="#6B7280" />
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
          Food Photo
        </Text>
      </View>

      {/* Restaurant & Dish */}
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 4 }}>
        {recommendation.dishName}
      </Text>
      <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>
        at {recommendation.restaurantName}
      </Text>
      
      <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 16 }}>
        {recommendation.description}
      </Text>

      {/* Details */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}>
          <DollarSign size={16} color="#FF6B6B" />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginLeft: 4 }}>
            ${recommendation.basePrice}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}>
          <Star size={16} color="#FCD34D" fill="#FCD34D" />
          <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
            {recommendation.rating}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}>
          <MapPin size={16} color="#6B7280" />
          <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
            {recommendation.distance}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Clock size={16} color="#6B7280" />
          <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
            {recommendation.estimatedTime}
          </Text>
        </View>
      </View>

      {/* Deb's Note */}
      <View style={{ 
        backgroundColor: '#FEF3F2', 
        borderRadius: 12, 
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B6B',
        marginBottom: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <MessageCircle size={16} color="#FF6B6B" style={{ marginTop: 2, marginRight: 8 }} />
          <Text style={{ fontSize: 13, color: '#374151', lineHeight: 18, flex: 1 }}>
            {recommendation.debsNote}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            padding: 16,
            flex: 1,
            alignItems: 'center',
          }}
          onPress={() => Alert.alert('View Details', `Show more info about ${recommendation.dishName}`)}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>
            View Details
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            borderRadius: 12,
            padding: 16,
            flex: 2,
            alignItems: 'center',
          }}
          onPress={() => Alert.alert('Customize Order', `This would open the customization screen for ${recommendation.dishName}! 🍽️`)}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
            Customize & Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ 
        paddingTop: insets.top + 20, 
        paddingHorizontal: 20, 
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#1F2937' }}>
              Hey there! 👋
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
              Ready for some delicious discoveries?
            </Text>
          </View>
          <View style={{
            backgroundColor: '#FF6B6B',
            borderRadius: 20,
            padding: 12,
          }}>
            <Sparkles size={24} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Deb's Greeting */}
        {greeting && (
          <View style={{
            backgroundColor: '#FEF3F2',
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 8,
            borderLeftWidth: 4,
            borderLeftColor: '#FF6B6B',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{
                backgroundColor: '#FF6B6B',
                borderRadius: 16,
                padding: 8,
                marginRight: 12,
              }}>
                <MessageCircle size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FF6B6B', marginBottom: 4 }}>
                  Deb says:
                </Text>
                <Text style={{ fontSize: 15, color: '#374151', lineHeight: 22 }}>
                  {greeting}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  minWidth: 100,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={() => Alert.alert('Quick Order', 'This would show your most recent orders!')}
              >
                <TrendingUp size={24} color="#FF6B6B" />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#1F2937', marginTop: 8 }}>
                  Trending
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  minWidth: 100,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={() => Alert.alert('Breakfast', 'Show breakfast recommendations!')}
              >
                <Coffee size={24} color="#F59E0B" />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#1F2937', marginTop: 8 }}>
                  Breakfast
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  minWidth: 100,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={() => Alert.alert('Quick Bite', 'Show quick meal options!')}
              >
                <Utensils size={24} color="#10B981" />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#1F2937', marginTop: 8 }}>
                  Quick Bite
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Recommendations */}
        <View style={{ paddingBottom: insets.bottom + 20 }}>
          {loading && recommendations.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Sparkles size={48} color="#FF6B6B" />
              <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 16, textAlign: 'center' }}>
                Deb is finding perfect dishes for you...
              </Text>
            </View>
          ) : recommendations.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Utensils size={48} color="#D1D5DB" />
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16, textAlign: 'center' }}>
                No recommendations yet
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
                Pull down to refresh or check your location settings
              </Text>
            </View>
          ) : (
            recommendations.map((recommendation, index) => (
              <RecommendationCard 
                key={recommendation.id || index} 
                recommendation={recommendation} 
                index={index} 
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}


