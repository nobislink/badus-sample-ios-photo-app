import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Request camera permissions
  useEffect(() => {
    const grantCameraPermissions = async () => {
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        setHasPermission(granted);
      } else {
        setHasPermission(permission.granted);
      }
    };
    grantCameraPermissions();
  }, [permission, requestPermission]);

  // Load previously saved photo and monitor network status
  useEffect(() => {
    if (hasPermission) {
      (async () => {
        const savedPhoto = await AsyncStorage.getItem('savedPhoto');
        if (savedPhoto) setPhotoUri(savedPhoto);
      })();
    }

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      if (state.isConnected && photoUri) {
        uploadPhoto();
      }
    });

    return () => unsubscribe();
  }, [hasPermission, photoUri]);

  // Take a photo using the camera
  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert('No camera permission', 'Please grant camera access.');
      return;
    }

    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.5,
        base64: false,
      });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take a photo.');
    }
  };

  // Save the photo locally and upload it
  const savePhoto = async () => {
    if (!photoUri) return;

    try {
      const fileName = photoUri.split('/').pop() || `photo-${Date.now()}.jpg`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({ from: photoUri, to: newPath });
      await AsyncStorage.setItem('savedPhoto', newPath);
      setPhotoUri(newPath);

      if (!isConnected) {
        Alert.alert('Offline', 'Photo will be uploaded when there’s Internet access.');
      } else {
        uploadPhoto();
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo.');
    }
  };

  // Simulate photo upload (replace with a real endpoint)
  const uploadPhoto = async () => {
    if (!photoUri || !isConnected) return;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: photoUri }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      Alert.alert('Success', 'Photo uploaded successfully!');
      await AsyncStorage.removeItem('savedPhoto');
      setPhotoUri(null);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', 'Upload failed. Will retry later.');
    }
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Example</Text>
      <CameraView ref={cameraRef} style={styles.camera} />
      <Text>Network Status: {isConnected ? 'Online' : 'Offline'}</Text>
      <Button title="Take Photo" onPress={takePhoto} />
      {photoUri && (
        <>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <Button title="Save Photo" onPress={savePhoto} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  camera: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  photo: {
    width: 200,
    height: 150,
    marginVertical: 16,
  },
});
