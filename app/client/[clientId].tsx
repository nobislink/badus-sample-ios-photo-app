import { listTypes } from "@/constants";
import { uploadPhoto, uploadQueuedPhotos } from "@/services";
import { Client, PhotoData } from "@/types";
import { getPhotoForClient, savePhotoLocally } from "@/utils";
import NetInfo from "@react-native-community/netinfo";
import * as ImagePicker from "expo-image-picker";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator, Alert, FlatList,
	Image,
	Modal,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native';

const ClientDetailScreen = () => {



	const { clientId = '' } = useLocalSearchParams<{ clientId: string; }>();
	const [client, setClient] = useState<Client>();
	const [loading, setLoading] = useState<boolean>(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null);

	const getClient = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				"https://us-central1-backyard-adus-automation.cloudfunctions.net/getDealData",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ dealId: clientId }),
				}
			);
			const data = (await response.json()) as { type: string; deal: Client; };
			if (data.type === "success") {
				setClient(data.deal);
			}
		} catch (error) {
			console.error("Error fetching client:", clientId, error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getClient();

		NetInfo.addEventListener((state) => {
			if (state.isConnected) {
				uploadQueuedPhotos("YOUR_AUTH_TOKEN", clientId);
			}
		});

	}, [clientId]);

	const handleFolderLinkPress = () => {
		console.log("Opening folder link:", client?.main_folder_link);
	};


	const handleSubTypePress = async (photoType: string, subType: string) => {
		const photo = await getPhotoForClient(clientId, photoType, subType);

		console.log(`🚀 ~ handleSubTypePress ~ photo:`, photo);

		if (photo && photo.localUri) {
			setSelectedPhoto(photo);
			setModalVisible(true);
		} else {
			await handleTakePhoto(photoType, subType);
		}
	};

	const handleTakePhoto = async (photoType: string, subType: string) => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== ImagePicker.PermissionStatus.GRANTED) {
			alert("Camera permission is required!");
			return;
		}


		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: "images",
		});


		if (!result.canceled && result.assets) {
			const imageUri = result.assets[0].uri;

			console.log(`🚀 ~ handleTakePhoto ~ imageUri:`, imageUri);


			const photoData = {
				clientId: clientId as string,
				dealFolderId: client?.main_folder_id!,
				photoType,
				subType,
				uploaded: false,
			};

			const netInfo = await NetInfo.fetch();
			if (netInfo.isConnected) {
				try {
					await uploadPhoto(
						photoData.dealFolderId,
						photoType,
						subType,
						imageUri,
						"YOUR_AUTH_TOKEN" // Reemplaza con el token real
					);
					await savePhotoLocally({ ...photoData, uploaded: true }, imageUri);
					Alert.alert("Photo uploaded successfully!");
				} catch (error) {
					console.error("Upload failed:", error);
					await savePhotoLocally(photoData, imageUri);
					Alert.alert("Photo saved locally, will upload when online.");
				}
			} else {
				await savePhotoLocally(photoData, imageUri);
				Alert.alert("Photo saved locally, will upload when online.");
			}
		}
	};

	// While loading is true, render a loading indicator
	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#2563EB" />
					<Text style={styles.loadingText}>Loading client information...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.clientHeaderContainer}>
					<Text style={styles.clientName}>{client?.dealname}</Text>
					<View style={styles.clientIdContainer}>
						<Link
							href={`https://app.hubspot.com/contacts/6449359/record/0-3/${clientId}`}
							target="_blank"
							style={styles.clientIdLabel}
						>
							ID: {clientId}
						</Link>
						<Text style={styles.clientId}>{client?.id}</Text>
					</View>
				</View>

				<View style={styles.infoCard}>
					<View style={styles.infoSection}>
						<View style={styles.infoIconContainer}>
							<Text style={styles.infoIcon}>📁</Text>
						</View>
						<View style={styles.infoTextContainer}>
							<Text style={styles.infoLabel}>Folder ID</Text>
							<Text style={styles.infoValue}>{client?.main_folder_id}</Text>
						</View>
					</View>
					<View style={styles.separator} />
					<View style={styles.infoSection}>
						<View style={styles.infoIconContainer}>
							<Text style={styles.infoIcon}>🔗</Text>
						</View>
						<View style={styles.infoTextContainer}>
							<Text style={styles.infoLabel}>Drive Folder</Text>
							<TouchableOpacity onPress={handleFolderLinkPress}>
								<Text style={styles.linkText}>{client?.main_folder_link}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={styles.photoTypesContainer}>
					<Text style={styles.photoTypesTitle}>Required Photos</Text>
					<FlatList
						data={listTypes}
						keyExtractor={(item) => item.type}
						renderItem={({ item }) => (
							<View style={styles.photoTypeItem}>
								<Text style={styles.photoTypeLabel}>{item.type}</Text>
								{item.subType.map((subType) => (
									<TouchableOpacity
										key={subType}
										style={styles.photoSubTypeButton}
										onPress={() => handleSubTypePress(item.type, subType)}
									>
										<Text style={styles.photoSubTypeText}>{subType}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
						scrollEnabled={false}
					/>
				</View>
			</ScrollView>

			{/* Modal para mostrar la foto */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{selectedPhoto && selectedPhoto.localUri ? (
							<>
								<Image source={{ uri: selectedPhoto.localUri }} style={styles.modalImage} />
								<Text style={styles.modalText}>
									{selectedPhoto.photoType} - {selectedPhoto.subType}
								</Text>
								<Text style={styles.modalStatus}>
									{selectedPhoto.uploaded ? "Uploaded" : "Saved Locally"}
								</Text>
							</>
						) : (
							<Text style={styles.modalText}>No photo available</Text>
						)}
						<TouchableOpacity
							style={styles.modalCloseButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.modalCloseButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

// Styles for the client details screen
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F3F4F6",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: "#2563EB",
	},
	headerContainer: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#FFFFFF",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.05,
				shadowRadius: 2,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	backButton: {
		paddingVertical: 8,
		paddingHorizontal: 0,
	},
	backButtonText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#2563EB",
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
		paddingBottom: 32,
	},
	clientHeaderContainer: {
		marginBottom: 24,
	},
	clientName: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#1E40AF",
		marginBottom: 8,
	},
	clientIdContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	clientIdLabel: {
		fontSize: 14,
		color: "#6B7280",
		fontWeight: "500",
	},
	clientId: {
		fontSize: 14,
		color: "#6B7280",
	},
	infoCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
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
	infoSection: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingVertical: 12,
	},
	infoIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#DBEAFE",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	infoIcon: {
		fontSize: 20,
	},
	infoTextContainer: {
		flex: 1,
	},
	infoLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1F2937",
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 15,
		color: "#4B5563",
		flexWrap: "wrap",
	},
	linkText: {
		fontSize: 15,
		color: "#2563EB",
		textDecorationLine: "underline",
		flexWrap: "wrap",
	},
	separator: {
		height: 1,
		backgroundColor: "#E5E7EB",
		marginVertical: 8,
	},
	actionsContainer: {
		marginTop: 8,
	},
	actionButton: {
		backgroundColor: "#2563EB",
		borderRadius: 8,
		paddingVertical: 14,
		alignItems: "center",
		marginBottom: 12,
		...Platform.select({
			ios: {
				shadowColor: "#2563EB",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.2,
				shadowRadius: 3,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	secondaryActionButton: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#2563EB",
	},
	actionButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	secondaryActionButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#2563EB",
	},
	photoTypesContainer: {
		marginTop: 8,
		paddingHorizontal: 16,
	},
	photoTypesTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1E40AF",
		marginBottom: 12,
	},
	photoTypeItem: {
		marginBottom: 16,
	},
	photoTypeLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1F2937",
		marginBottom: 8,
	},
	photoSubTypeButton: {
		backgroundColor: "#2563EB",
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginBottom: 8,
		...Platform.select({
			ios: {
				shadowColor: "#2563EB",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.2,
				shadowRadius: 3,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	photoSubTypeText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#FFFFFF",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		padding: 20,
		alignItems: "center",
		width: "80%",
	},
	modalImage: {
		width: 200,
		height: 150,
		borderRadius: 8,
		marginBottom: 16,
	},
	modalText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1F2937",
		marginBottom: 8,
	},
	modalStatus: {
		fontSize: 14,
		color: "#6B7280",
		marginBottom: 16,
	},
	modalCloseButton: {
		backgroundColor: "#2563EB",
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	modalCloseButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
});

export default ClientDetailScreen;