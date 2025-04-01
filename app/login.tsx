// import { useState } from "react";
// import {
// 	ActivityIndicator,
// 	Alert,
// 	Image,
// 	KeyboardAvoidingView,
// 	Platform,
// 	ScrollView,
// 	StyleSheet,
// 	Text,
// 	TextInput,
// 	TouchableOpacity,
// 	View,
// } from "react-native";

// import { useAuth } from "@/hooks";
// import * as Google from "@react-native-google-signin/google-signin";
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

// // Import the logo SVG
// const logoSvg = require("@/assets/icons/logo.svg");

// const LoginScreen = ({ }) => {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [loading, setLoading] = useState(false);

// 	// Function to handle email/password login
// 	const handleLogin = async () => {
// 		if (!email || !password) {
// 			Alert.alert("Error", "Please enter both email and password");
// 			return;
// 		}

// 		setLoading(true);
// 		try {
// 			// Implement your login logic here
// 			// For demo purposes, we'll just simulate a delay
// 			await new Promise((resolve) => setTimeout(resolve, 1500));

// 			// Navigate to main app after successful login
// 			// navigation.navigate('Home');

// 			Alert.alert("Success", "Login successful!");
// 		} catch (error) {
// 			const err = error as Error;
// 			Alert.alert("Login Failed", err.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	// Function to handle Google Sign-in
// 	const handleGoogleSignIn = async () => {
// 		setLoading(true);
// 		try {
// 			// Configure Google Sign-In
// 			Google.GoogleSignin.configure({
// 				webClientId: "YOUR_WEB_CLIENT_ID", // Get this from Google Cloud Console
// 				offlineAccess: true,
// 			});

// 			// Sign in with Google
// 			await Google.GoogleSignin.hasPlayServices();
// 			const userInfo = await Google.GoogleSignin.signIn();

// 			// Here you would typically:
// 			// 1. Send the userInfo.idToken to your backend
// 			// 2. Get a JWT token back
// 			// 3. Store the JWT token
// 			// 4. Navigate to the main app

// 			Alert.alert("Success", `Signed in as ${userInfo.data?.user?.name}`);
// 			// navigation.navigate('Home');
// 		} catch (error) {
// 			const err = error as Error & { code: string; };

// 			if (err.code === Google.statusCodes.SIGN_IN_CANCELLED) {
// 				// User cancelled the login flow
// 				console.log("Sign in cancelled");
// 			} else {
// 				Alert.alert("Google Sign-In Error", err.message);
// 			}
// 		} finally {
// 			setLoading(false);
// 		}
// 	};


// 	const { signInWithGoogle } = useAuth();

// 	return (
// 		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
// 			<ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
// 				<View style={styles.logoContainer}>
// 					<Image src={logoSvg} width={150} height={150} />
// 				</View>

// 				<Text style={styles.title}>Welcome Back</Text>
// 				<Text style={styles.subtitle}>Sign in to continue</Text>

// 				<View style={styles.formContainer}>
// 					<View style={styles.inputContainer}>
// 						<Text style={styles.inputLabel}>Email</Text>
// 						<TextInput
// 							style={styles.input}
// 							placeholder="Enter your email"
// 							placeholderTextColor="#A0A0A0"
// 							keyboardType="email-address"
// 							autoCapitalize="none"
// 							value={email}
// 							onChangeText={setEmail}
// 						/>
// 					</View>

// 					<View style={styles.inputContainer}>
// 						<Text style={styles.inputLabel}>Password</Text>
// 						<TextInput
// 							style={styles.input}
// 							placeholder="Enter your password"
// 							placeholderTextColor="#A0A0A0"
// 							secureTextEntry
// 							value={password}
// 							onChangeText={setPassword}
// 						/>
// 					</View>

// 					<TouchableOpacity style={styles.forgotPassword}>
// 						<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
// 					</TouchableOpacity>

// 					<TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
// 						{loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
// 					</TouchableOpacity>

// 					<View style={styles.dividerContainer}>
// 						<View style={styles.divider} />
// 						<Text style={styles.dividerText}>OR</Text>
// 						<View style={styles.divider} />
// 					</View>


// 					{/*
// 					Here you can use the Google Sign-In button from the library
// 					*/}
// 					<GoogleSigninButton
// 						size={GoogleSigninButton.Size.Wide}
// 						color={GoogleSigninButton.Color.Dark}
// 						onPress={() => {
// 							// initiate sign in
// 						}}
// 					// disabled={isInProgress}
// 					/>;
// 					<TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle} disabled={loading}>
// 						<View style={styles.googleButtonContent}>
// 							<Text style={styles.googleButtonText}>Sign in with Google</Text>
// 						</View>
// 					</TouchableOpacity>
// 				</View>

// 				<View style={styles.footer}>
// 					<Text style={styles.footerText}>Don't have an account? </Text>
// 					<TouchableOpacity>
// 						<Text style={styles.signUpText}>Sign Up</Text>
// 					</TouchableOpacity>
// 				</View>
// 			</ScrollView>
// 		</KeyboardAvoidingView>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#FFFFFF",
// 	},
// 	scrollContainer: {
// 		flexGrow: 1,
// 		paddingHorizontal: 24,
// 		paddingTop: 60,
// 		paddingBottom: 40,
// 	},
// 	logoContainer: {
// 		alignItems: "center",
// 		marginBottom: 40,
// 	},
// 	title: {
// 		fontSize: 28,
// 		fontWeight: "bold",
// 		color: "#333333",
// 		textAlign: "center",
// 	},
// 	subtitle: {
// 		fontSize: 16,
// 		color: "#666666",
// 		marginTop: 8,
// 		marginBottom: 40,
// 		textAlign: "center",
// 	},
// 	formContainer: {
// 		width: "100%",
// 	},
// 	inputContainer: {
// 		marginBottom: 20,
// 	},
// 	inputLabel: {
// 		fontSize: 14,
// 		fontWeight: "600",
// 		color: "#333333",
// 		marginBottom: 8,
// 	},
// 	input: {
// 		height: 50,
// 		borderWidth: 1,
// 		borderColor: "#E0E0E0",
// 		borderRadius: 8,
// 		paddingHorizontal: 16,
// 		fontSize: 16,
// 		color: "#333333",
// 		backgroundColor: "#F8F8F8",
// 	},
// 	forgotPassword: {
// 		alignSelf: "flex-end",
// 		marginBottom: 24,
// 	},
// 	forgotPasswordText: {
// 		fontSize: 14,
// 		color: "#92BB70", // Using the green color from the logo
// 		fontWeight: "600",
// 	},
// 	loginButton: {
// 		height: 50,
// 		backgroundColor: "#92BB70", // Using the green color from the logo
// 		borderRadius: 8,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		marginBottom: 24,
// 	},
// 	loginButtonText: {
// 		fontSize: 16,
// 		fontWeight: "bold",
// 		color: "#FFFFFF",
// 	},
// 	dividerContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		marginBottom: 24,
// 	},
// 	divider: {
// 		flex: 1,
// 		height: 1,
// 		backgroundColor: "#E0E0E0",
// 	},
// 	dividerText: {
// 		paddingHorizontal: 16,
// 		color: "#666666",
// 		fontSize: 14,
// 	},
// 	googleButton: {
// 		height: 50,
// 		borderWidth: 1,
// 		borderColor: "#E0E0E0",
// 		borderRadius: 8,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: "#FFFFFF",
// 	},
// 	googleButtonContent: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	googleIcon: {
// 		width: 24,
// 		height: 24,
// 		marginRight: 12,
// 	},
// 	googleButtonText: {
// 		fontSize: 16,
// 		fontWeight: "600",
// 		color: "#333333",
// 	},
// 	footer: {
// 		flexDirection: "row",
// 		justifyContent: "center",
// 		marginTop: 40,
// 	},
// 	footerText: {
// 		fontSize: 14,
// 		color: "#666666",
// 	},
// 	signUpText: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		color: "#92BB70", // Using the green color from the logo
// 	},
// });

// export default LoginScreen;

import { StyleSheet, Text, View } from 'react-native';

const login = () => {
	return (
		<View>
			<Text>login</Text>
		</View>
	);
};

export default login;

const styles = StyleSheet.create({});