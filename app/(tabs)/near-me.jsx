import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MapPin,
  Search,
  List,
  Map,
  Star,
  Clock,
  DollarSign,
  Heart,
  Filter,
  Phone,
} from "lucide-react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

export default function NearMeScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const cuisineTypes = [
    "All",
    "Italian",
    "Mexican",
    "Chinese",
    "American",
    "Thai",
    "Indian",
    "Japanese",
    "Pizza",
    "Deli",
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyRestaurants();
    }
  }, [location, selectedCuisine]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to find nearby restaurants.",
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Could not get your location. Please try again.");
    }
  };

  const fetchNearbyRestaurants = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const cuisine =
        selectedCuisine && selectedCuisine !== "All" ? selectedCuisine : "";
      const response = await fetch(
        `/api/restaurants/nearby?lat=${location.latitude}&lng=${location.longitude}&cuisine=${cuisine}&limit=30`,
      );

      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants || []);
      } else {
        throw new Error("Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      // Fallback to mock data
      setMockRestaurants();
    } finally {
      setLoading(false);
    }
  };

  const setMockRestaurants = () => {
    const mockRestaurants = [
      {
        id: "1",
        name: "Tony's Italian Bistro",
        rating: 4.5,
        address: "456 Oak Street",
        cuisine: "Italian",
        coordinates: {
          latitude: location.latitude + 0.001,
          longitude: location.longitude + 0.001,
        },
        distance: "0.3",
        priceLevel: 2,
        isOpen: true,
        phone: "(555) 123-4567",
        deliveryTime: "25-30 min",
        deliveryFee: "$2.99",
        photos: [],
      },
      {
        id: "2",
        name: "Green Garden Cafe",
        rating: 4.7,
        address: "789 Pine Avenue",
        cuisine: "American",
        coordinates: {
          latitude: location.latitude - 0.002,
          longitude: location.longitude + 0.002,
        },
        distance: "0.5",
        priceLevel: 1,
        isOpen: true,
        phone: "(555) 234-5678",
        deliveryTime: "15-25 min",
        deliveryFee: "Free",
        photos: [],
      },
    ];
    setRestaurants(mockRestaurants);
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToFavorites = async (restaurant) => {
    try {
      Alert.alert(
        "Added to Favorites",
        `${restaurant.name} has been added to your favorites!`,
      );
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert("Error", "Could not add to favorites. Please try again.");
    }
  };

  const RestaurantCard = ({ restaurant }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={() => setSelectedRestaurant(restaurant)}
    >
      {restaurant.photos && restaurant.photos.length > 0 && (
        <Image
          source={{ uri: restaurant.photos[0].photo_url }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            marginBottom: 12,
          }}
          resizeMode="cover"
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
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
            {restaurant.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
            {restaurant.cuisine}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {restaurant.isOpen && (
            <View
              style={{
                backgroundColor: "#ECFDF5",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: "#059669" }}
              >
                Open
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => addToFavorites(restaurant)}
            style={{
              backgroundColor: "#FEF2F2",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <Heart size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
            marginBottom: 4,
          }}
        >
          <Star size={14} color="#FCD34D" fill="#FCD34D" />
          <Text
            style={{
              fontSize: 14,
              color: "#1F2937",
              marginLeft: 4,
              fontWeight: "600",
            }}
          >
            {restaurant.rating}
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 4 }}>
            ({restaurant.reviewCount || 0})
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
            marginBottom: 4,
          }}
        >
          <MapPin size={14} color="#6B7280" />
          <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
            {restaurant.distance} mi
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Clock size={14} color="#6B7280" />
          <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 4 }}>
            {restaurant.deliveryTime}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 14, color: "#6B7280" }}>
          Delivery: {restaurant.deliveryFee}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {[...Array(restaurant.priceLevel || 2)].map((_, i) => (
            <DollarSign key={i} size={14} color="#059669" />
          ))}
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
              `Getting directions to ${restaurant.name}`,
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
            Alert.alert("View Menu", `Viewing menu for ${restaurant.name}`)
          }
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
            View Menu
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderMapView = () => {
    if (!location) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            Getting your location...
          </Text>
        </View>
      );
    }

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.coordinates.latitude,
              longitude: restaurant.coordinates.longitude,
            }}
            pinColor="#FF6B6B"
          >
            <Callout onPress={() => setSelectedRestaurant(restaurant)}>
              <View style={{ width: 200, padding: 8 }}>
                <Text
                  style={{ fontWeight: "600", fontSize: 14, marginBottom: 4 }}
                >
                  {restaurant.name}
                </Text>
                <Text
                  style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}
                >
                  {restaurant.cuisine} • {restaurant.distance} mi
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Star size={12} color="#FCD34D" fill="#FCD34D" />
                  <Text style={{ fontSize: 12, marginLeft: 4 }}>
                    {restaurant.rating} • {restaurant.deliveryTime}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#1F2937" }}>
            Near Me 📍
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: viewMode === "list" ? "#FF6B6B" : "#F3F4F6",
                borderRadius: 12,
                padding: 12,
              }}
              onPress={() => setViewMode("list")}
            >
              <List
                size={20}
                color={viewMode === "list" ? "#fff" : "#6B7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: viewMode === "map" ? "#FF6B6B" : "#F3F4F6",
                borderRadius: 12,
                padding: 12,
              }}
              onPress={() => setViewMode("map")}
            >
              <Map size={20} color={viewMode === "map" ? "#fff" : "#6B7280"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Search size={20} color="#6B7280" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: "#1F2937",
            }}
            placeholder="Search restaurants or cuisine..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Cuisine Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {cuisineTypes.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={{
                backgroundColor:
                  selectedCuisine === cuisine ? "#FF6B6B" : "#F3F4F6",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
              }}
              onPress={() =>
                setSelectedCuisine(selectedCuisine === cuisine ? "" : cuisine)
              }
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: selectedCuisine === cuisine ? "#fff" : "#6B7280",
                }}
              >
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {viewMode === "map" ? (
        renderMapView()
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#6B7280" }}>
                Finding restaurants near you...
              </Text>
            </View>
          ) : filteredRestaurants.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <MapPin size={48} color="#D1D5DB" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#374151",
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                No restaurants found
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Try adjusting your search or check your location settings
              </Text>
            </View>
          ) : (
            <View style={{ paddingTop: 20 }}>
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Restaurant Count */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 20,
          left: 20,
          backgroundColor: "#1F2937",
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
          {filteredRestaurants.length} restaurants
        </Text>
      </View>
    </View>
  );
}



