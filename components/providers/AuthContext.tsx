import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useState } from 'react';

GoogleSignin.configure({
	webClientId: "621559569225-gglpqmia6oovilsknpk3inr23ih218n9.apps.googleusercontent.com",
	offlineAccess: true,
});

interface AuthContextType {
	user?: FirebaseAuthTypes.UserCredential["user"];
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
	const [user, setUser] = useState<AuthContextType['user']>();

	const signInWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const { data } = await GoogleSignin.signIn();

			if (!data) throw new Error('No data returned from Google Sign-In');
			const { idToken } = data;
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			const userCredential = await auth().signInWithCredential(googleCredential);
			const token = await userCredential.user.getIdToken();
			await SecureStore.setItemAsync('authToken', token); // Almacenar token JWT
			setUser(userCredential.user);
		} catch (error) {
			const err = error as Error;
			console.error('Error signing in:', JSON.stringify(err, null, 2));
		}
	};

	const signOut = async () => {
		await auth().signOut();
		await GoogleSignin.signOut();
		await SecureStore.deleteItemAsync('authToken');
		setUser(undefined);
	};

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

