import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Client {
  id: string;
  dealname: string;
  main_folder_id: string;
  main_folder_link: string;
}

const ClientListScreen = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://us-central1-backyard-adus-automation.cloudfunctions.net/getDeals"
      );
      const data = (await response.json()) as {
        type: string;
        deals: Client[];
      };

      if (data.type === "success") {
        setClients(data.deals);
      } else {
        console.error("Error fetching clients:", data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getClients();
    } catch (error) {
      console.error("Error refreshing clients:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.dealname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientPress = (client: Client) => {
    console.log("Cliente seleccionado:", client.dealname);
  };

  const renderClientItem = ({ item }: { item: Client; }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => handleClientPress(item)}
      activeOpacity={0.7}
      key={item.id}
    >
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.dealname}</Text>
        <View style={styles.folderContainer}>
          <View style={styles.folderIndicator} />
          <Text style={styles.folderText}>
            Folder: {item?.main_folder_id?.substring(0, 8)}...
          </Text>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Clients</Text>
      <Text style={styles.headerSubtitle}>
        {filteredClients.length} Clients found
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <Text style={styles.emptyText}>No customers found</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Mover el TextInput fuera del ListHeaderComponent */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search client..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          underlineColorAndroid="transparent"
          autoCapitalize="none" // Evita cambios automáticos en el texto
        />
      </View>
      <FlatList
        data={filteredClients}
        renderItem={renderClientItem}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={30}
        maxToRenderPerBatch={15}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  searchContainer: {
    margin: 12,
    paddingHorizontal: 8,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  clientInfo: {
    flex: 1,
    marginRight: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  folderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    marginRight: 6,
  },
  folderText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
  },
  arrowContainer: {
    padding: 8,
  },
  arrowIcon: {
    fontSize: 24,
    color: "#2563EB",
    fontWeight: "300",
  },
  separator: {
    height: 1,
    backgroundColor: "transparent",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default ClientListScreen;