import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Settings, ChefHat, DollarSign, AlertTriangle, Utensils } from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [preferences, setPreferences] = useState({
    favoriteCuisines: [],
    spiceTolerance: 3,
    allergens: [],
    budgetMin: 0,
    budgetMax: 50,
    dietaryRestrictions: []
  });
  const [loading, setLoading] = useState(false);

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 
    'American', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Greek'
  ];

  const allergenOptions = [
    'Nuts', 'Shellfish', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Fish'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'
  ];

  const spiceLabels = ['Mild', 'Low', 'Medium', 'High', 'Very Hot'];

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      // Mock user ID for now - will be replaced with real auth
      const userId = 'user123';
      const response = await fetch(`/api/user-preferences?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      const userId = 'user123';
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences })
      });

      if (response.ok) {
        Alert.alert('Success', 'Your preferences have been saved!');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Could not save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array, item, setter) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setter(newArray);
  };

  const OptionButton = ({ title, selected, onPress, icon: Icon }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? '#FF6B6B' : '#F9FAFB',
        borderWidth: 1,
        borderColor: selected ? '#FF6B6B' : '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      {Icon && <Icon size={16} color={selected ? '#fff' : '#6B7280'} />}
      <Text style={{
        color: selected ? '#fff' : '#374151',
        fontWeight: selected ? '600' : '500',
        fontSize: 14,
        marginLeft: Icon ? 6 : 0,
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SpiceButton = ({ level, selected, onPress }) => (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? '#FF6B6B' : '#F9FAFB',
        borderWidth: 1,
        borderColor: selected ? '#FF6B6B' : '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
      }}
      onPress={onPress}
    >
      <Text style={{
        color: selected ? '#fff' : '#374151',
        fontWeight: selected ? '600' : '500',
        fontSize: 12,
        textAlign: 'center',
      }}>
        {spiceLabels[level - 1]}
      </Text>
      <Text style={{
        color: selected ? '#fff' : '#6B7280',
        fontSize: 10,
        marginTop: 2,
      }}>
        {level}/5
      </Text>
    </TouchableOpacity>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#1F2937' }}>
              Your Profile
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
              Tell Deb what you love to eat
            </Text>
          </View>
          <View style={{
            backgroundColor: '#FF6B6B',
            borderRadius: 20,
            padding: 12,
          }}>
            <User size={24} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Favorite Cuisines */}
        <View style={{ backgroundColor: '#fff', marginTop: 20, marginHorizontal: 20, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <ChefHat size={20} color="#FF6B6B" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginLeft: 8 }}>
              Favorite Cuisines
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            Select all the cuisines you enjoy
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cuisineOptions.map((cuisine) => (
              <OptionButton
                key={cuisine}
                title={cuisine}
                selected={preferences.favoriteCuisines.includes(cuisine)}
                onPress={() => {
                  const newCuisines = preferences.favoriteCuisines.includes(cuisine)
                    ? preferences.favoriteCuisines.filter(c => c !== cuisine)
                    : [...preferences.favoriteCuisines, cuisine];
                  setPreferences(prev => ({ ...prev, favoriteCuisines: newCuisines }));
                }}
              />
            ))}
          </View>
        </View>

        {/* Spice Tolerance */}
        <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 20, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20 }}>🌶️</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginLeft: 8 }}>
              Spice Tolerance
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            How spicy do you like your food?
          </Text>
          <View style={{ flexDirection: 'row', marginHorizontal: -4 }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <SpiceButton
                key={level}
                level={level}
                selected={preferences.spiceTolerance === level}
                onPress={() => setPreferences(prev => ({ ...prev, spiceTolerance: level }))}
              />
            ))}
          </View>
        </View>

        {/* Budget Range */}
        <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 20, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <DollarSign size={20} color="#FF6B6B" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginLeft: 8 }}>
              Budget Range
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            What's your typical spending range per meal?
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#374151', marginRight: 12 }}>$</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                flex: 1,
                marginRight: 12,
                backgroundColor: '#F9FAFB'
              }}
              value={preferences.budgetMin.toString()}
              onChangeText={(text) => setPreferences(prev => ({ ...prev, budgetMin: parseInt(text) || 0 }))}
              keyboardType="numeric"
              placeholder="Min"
            />
            <Text style={{ fontSize: 16, color: '#6B7280', marginHorizontal: 8 }}>to</Text>
            <Text style={{ fontSize: 16, color: '#374151', marginRight: 12 }}>$</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                flex: 1,
                backgroundColor: '#F9FAFB'
              }}
              value={preferences.budgetMax.toString()}
              onChangeText={(text) => setPreferences(prev => ({ ...prev, budgetMax: parseInt(text) || 50 }))}
              keyboardType="numeric"
              placeholder="Max"
            />
          </View>
        </View>

        {/* Allergens */}
        <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 20, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <AlertTriangle size={20} color="#FF6B6B" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginLeft: 8 }}>
              Allergens to Avoid
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            Select any allergens you need to avoid
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {allergenOptions.map((allergen) => (
              <OptionButton
                key={allergen}
                title={allergen}
                selected={preferences.allergens.includes(allergen)}
                onPress={() => {
                  const newAllergens = preferences.allergens.includes(allergen)
                    ? preferences.allergens.filter(a => a !== allergen)
                    : [...preferences.allergens, allergen];
                  setPreferences(prev => ({ ...prev, allergens: newAllergens }));
                }}
              />
            ))}
          </View>
        </View>

        {/* Dietary Restrictions */}
        <View style={{ backgroundColor: '#fff', marginTop: 16, marginHorizontal: 20, borderRadius: 16, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Utensils size={20} color="#FF6B6B" />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginLeft: 8 }}>
              Dietary Preferences
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
            Any specific dietary requirements?
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {dietaryOptions.map((diet) => (
              <OptionButton
                key={diet}
                title={diet}
                selected={preferences.dietaryRestrictions.includes(diet)}
                onPress={() => {
                  const newDietary = preferences.dietaryRestrictions.includes(diet)
                    ? preferences.dietaryRestrictions.filter(d => d !== diet)
                    : [...preferences.dietaryRestrictions, diet];
                  setPreferences(prev => ({ ...prev, dietaryRestrictions: newDietary }));
                }}
              />
            ))}
          </View>
        </View>

        {/* Save Button */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF6B6B',
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              opacity: loading ? 0.7 : 1,
            }}
            onPress={savePreferences}
            disabled={loading}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


