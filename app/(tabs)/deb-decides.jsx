import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Animated, TextInput, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, MapPin, Clock, Star, DollarSign, RefreshCw, Heart, MessageCircle, Smile, Coffee } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function DebDecidesScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  const [mood, setMood] = useState('');
  const [craving, setCraving] = useState('');
  const [debGreeting, setDebGreeting] = useState('');
  const [showConversation, setShowConversation] = useState(false);

  const moods = ['hungry', 'adventurous', 'comfort food', 'healthy', 'indulgent', 'quick bite'];
  const cravings = ['spicy', 'sweet', 'savory', 'fresh', 'warm', 'crunchy', 'creamy'];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find nearby restaurants.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location. Please try again.');
    }
  };

  const letDebDecide = async () => {
    if (!location) {
      Alert.alert('Location Required', 'Please enable location services to let Deb decide for you.');
      return;
    }

    setLoading(true);
    setRecommendation(null);
    setShowConversation(false);

    // Start animation
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user', // In real app, this would be the actual user ID
          latitude: location.latitude,
          longitude: location.longitude,
          mood: mood,
          craving: craving
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.recommendations && data.recommendations.length > 0) {
          // Pick a random recommendation from the AI suggestions
          const randomRec = data.recommendations[Math.floor(Math.random() * data.recommendations.length)];
          setRecommendation(randomRec);
          setDebGreeting(data.greeting);
          setShowConversation(true);
        } else {
          throw new Error('No recommendations received');
        }
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      
      // Fallback recommendation
      const fallbackRecommendation = {
        restaurantName: "Local Favorite Deli",
        dishName: "Custom Sandwich Builder",
        description: "Build your perfect sandwich with fresh ingredients",
        basePrice: 12.99,
        customizations: [
          {
            name: "Bread",
            options: [
              { label: "Whole Wheat", price: 0 },
              { label: "Sourdough", price: 0.50 },
              { label: "Everything Bagel", price: 1.00 }
            ]
          },
          {
            name: "Protein",
            options: [
              { label: "Turkey", price: 0 },
              { label: "Ham", price: 0 },
              { label: "Roast Beef", price: 2.00 },
              { label: "Grilled Chicken", price: 1.50 }
            ]
          },
          {
            name: "Extras",
            options: [
              { label: "Avocado", price: 1.50 },
              { label: "Bacon", price: 2.00 },
              { label: "Extra Cheese", price: 1.00 }
            ]
          }
        ],
        distance: "0.4 mi",
        rating: 4.6,
        estimatedTime: "15-20 min",
        debsNote: "I picked this because you can make it exactly how you want it! Perfect for when you're feeling creative with your food choices 🥪",
        confidence: 85
      };

      setRecommendation(fallbackRecommendation);
      setDebGreeting("Hey there! I'm having a little connection hiccup, but I still have a great idea for you! 😊");
      setShowConversation(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (basePrice, selectedOptions = []) => {
    const extraCost = selectedOptions.reduce((total, option) => total + option.price, 0);
    return (basePrice + extraCost).toFixed(2);
  };

  const animatedStyle = {
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
      {
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '10deg'],
        }),
      },
    ],
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }} showsVerticalScrollIndicator={false}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#1F2937' }}>
              Deb Decides ✨
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
              Your AI food companion
            </Text>
          </View>
          <Animated.View style={[{
            backgroundColor: '#FF6B6B',
            borderRadius: 20,
            padding: 12,
          }, animatedStyle]}>
            <Sparkles size={24} color="#fff" />
          </Animated.View>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: insets.bottom + 20 }}>
        {!showConversation && !loading && (
          <View style={{ alignItems: 'center' }}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 100,
              padding: 40,
              marginBottom: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}>
              <MessageCircle size={64} color="#FF6B6B" />
            </View>
            
            <Text style={{ 
              fontSize: 24, 
              fontWeight: '700', 
              color: '#1F2937', 
              textAlign: 'center',
              marginBottom: 16 
            }}>
              How are you feeling?
            </Text>
            
            <Text style={{ 
              fontSize: 16, 
              color: '#6B7280', 
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 32 
            }}>
              Tell Deb your mood and what you're craving so she can find the perfect dish for you!
            </Text>

            {/* Mood Selection */}
            <View style={{ width: '100%', marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
                What's your mood? 😊
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {moods.map((moodOption) => (
                  <TouchableOpacity
                    key={moodOption}
                    style={{
                      backgroundColor: mood === moodOption ? '#FF6B6B' : '#F3F4F6',
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                    }}
                    onPress={() => setMood(mood === moodOption ? '' : moodOption)}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: mood === moodOption ? '#fff' : '#6B7280',
                    }}>
                      {moodOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Craving Selection */}
            <View style={{ width: '100%', marginBottom: 32 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
                Any cravings? 🤤
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {cravings.map((cravingOption) => (
                  <TouchableOpacity
                    key={cravingOption}
                    style={{
                      backgroundColor: craving === cravingOption ? '#FF6B6B' : '#F3F4F6',
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                    }}
                    onPress={() => setCraving(craving === cravingOption ? '' : cravingOption)}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: craving === cravingOption ? '#fff' : '#6B7280',
                    }}>
                      {cravingOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#FF6B6B',
                borderRadius: 20,
                paddingVertical: 20,
                paddingHorizontal: 40,
                width: '100%',
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
              onPress={letDebDecide}
              disabled={loading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} color="#fff" />
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '700', 
                  color: '#fff',
                  marginLeft: 12 
                }}>
                  Let Deb Decide!
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={{ alignItems: 'center' }}>
            <Animated.View style={[{
              backgroundColor: '#fff',
              borderRadius: 100,
              padding: 40,
              marginBottom: 32,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }, animatedStyle]}>
              <Sparkles size={64} color="#FF6B6B" />
            </Animated.View>
            
            <Text style={{ 
              fontSize: 20, 
              fontWeight: '600', 
              color: '#1F2937', 
              textAlign: 'center',
              marginBottom: 12 
            }}>
              Deb is thinking...
            </Text>
            
            <Text style={{ 
              fontSize: 16, 
              color: '#6B7280', 
              textAlign: 'center' 
            }}>
              Analyzing your preferences and nearby options
            </Text>
          </View>
        )}

        {recommendation && !loading && showConversation && (
          <View>
            {/* Deb's Greeting */}
            {debGreeting && (
              <View style={{
                backgroundColor: '#FEF3F2',
                borderRadius: 16,
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#FF6B6B',
                marginBottom: 20,
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
                      {debGreeting}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Recommendation Card */}
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
              marginBottom: 20,
            }}>
              {/* Confidence Badge */}
              <View style={{
                backgroundColor: '#ECFDF5',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                alignSelf: 'flex-start',
                marginBottom: 16,
              }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#059669' }}>
                  {recommendation.confidence}% Match
                </Text>
              </View>

              {/* Restaurant & Dish */}
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 8 }}>
                {recommendation.dishName}
              </Text>
              <Text style={{ fontSize: 18, color: '#6B7280', marginBottom: 12 }}>
                at {recommendation.restaurantName}
              </Text>
              
              <Text style={{ fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 16 }}>
                {recommendation.description}
              </Text>

              {/* Details */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 8 }}>
                  <DollarSign size={16} color="#FF6B6B" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginLeft: 4 }}>
                    ${recommendation.basePrice}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 8 }}>
                  <Star size={16} color="#FCD34D" fill="#FCD34D" />
                  <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
                    {recommendation.rating}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 8 }}>
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

              {/* Customization Options */}
              {recommendation.customizations && recommendation.customizations.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 }}>
                    Customize Your Order:
                  </Text>
                  {recommendation.customizations.map((category, categoryIndex) => (
                    <View key={categoryIndex} style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                        {category.name}:
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {category.options.map((option, optionIndex) => (
                          <View
                            key={optionIndex}
                            style={{
                              backgroundColor: '#F9FAFB',
                              borderRadius: 12,
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderWidth: 1,
                              borderColor: '#E5E7EB',
                            }}
                          >
                            <Text style={{ fontSize: 12, color: '#374151' }}>
                              {option.label} {option.price > 0 && `+$${option.price.toFixed(2)}`}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Deb's Note */}
              <View style={{ 
                backgroundColor: '#FEF3F2', 
                borderRadius: 12, 
                padding: 16,
                borderLeftWidth: 4,
                borderLeftColor: '#FF6B6B',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>
                  {recommendation.debsNote}
                </Text>
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
                  onPress={() => {
                    setShowConversation(false);
                    setMood('');
                    setCraving('');
                  }}
                >
                  <RefreshCw size={20} color="#6B7280" />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', marginTop: 4 }}>
                    Try Again
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
                  onPress={() => Alert.alert('Great Choice!', 'This would open the customization screen! 🍽️')}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                    Customize & Order
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}


