import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Heart,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Trash2,
} from "lucide-react-native";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // Mock user ID for now - will be replaced with real auth
      const userId = "user123";
      const response = await fetch(`/api/favorites?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      // Mock favorites for demo
      setFavorites([
        {
          id: 1,
          restaurantName: "Tony's Italian Bistro",
          dishName: "Spicy Arrabbiata Pasta",
          price: 18.99,
          distance: "0.3 miles",
          rating: 4.5,
          savedAt: "2024-01-15",
          restaurantAddress: "456 Oak Street",
        },
        {
          id: 2,
          restaurantName: "Sakura Sushi",
          dishName: "Salmon Teriyaki Roll",
          price: 16.0,
          distance: "0.7 miles",
          rating: 4.6,
          savedAt: "2024-01-10",
          restaurantAddress: "789 Pine Avenue",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this dish from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`/api/favorites/${favoriteId}`, {
                method: "DELETE",
              });

              if (response.ok) {
                setFavorites((prev) =>
                  prev.filter((fav) => fav.id !== favoriteId),
                );
              } else {
                throw new Error("Failed to remove favorite");
              }
            } catch (error) {
              console.error("Error removing favorite:", error);
              Alert.alert(
                "Error",
                "Could not remove favorite. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const FavoriteCard = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            {item.dishName}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
            {item.restaurantName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#FF6B6B",
              marginRight: 12,
            }}
          >
            ${item.price}
          </Text>
          <TouchableOpacity
            onPress={() => removeFavorite(item.id)}
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <Star size={16} color="#FCD34D" fill="#FCD34D" />
          <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
            {item.rating}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <MapPin size={16} color="#6B7280" />
          <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
            {item.distance}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />
          <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
            Saved {new Date(item.savedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 12,
            padding: 12,
            flex: 1,
            alignItems: "center",
          }}
          onPress={() =>
            Alert.alert(
              "Directions",
              `Getting directions to ${item.restaurantName}`,
            )
          }
        >
          <MapPin size={16} color="#6B7280" />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            Directions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#FF6B6B",
            borderRadius: 12,
            padding: 12,
            flex: 2,
            alignItems: "center",
          }}
          onPress={() =>
            Alert.alert(
              "Order Now",
              `Ordering ${item.dishName} from ${item.restaurantName}`,
            )
          }
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
            Order Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#1F2937" }}>
              Your Favorites ❤️
            </Text>
            <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 4 }}>
              {favorites.length} saved dishes
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#FF6B6B",
              borderRadius: 20,
              padding: 12,
            }}
          >
            <Heart size={24} color="#fff" fill="#fff" />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#6B7280" }}>
              Loading your favorites...
            </Text>
          </View>
        ) : favorites.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 100,
                padding: 40,
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Heart size={48} color="#D1D5DB" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              No favorites yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Start exploring restaurants and save your favorite dishes to see
              them here!
            </Text>
          </View>
        ) : (
          <View style={{ paddingTop: 20 }}>
            {favorites.map((item) => (
              <FavoriteCard key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#FF6B6B",
                borderStyle: "dashed",
              }}
              onPress={() =>
                Alert.alert(
                  "Explore More",
                  "Check out the Near Me tab to discover new favorites!",
                )
              }
            >
              <Heart size={20} color="#FF6B6B" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#FF6B6B",
                  marginLeft: 8,
                }}
              >
                Discover More Favorites
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}



