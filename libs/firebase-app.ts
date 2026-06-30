import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_WEB_CONFIG } from "./firebase-config";

export function initFirebaseApp() {
	if (!getApps().length) {
		initializeApp(FIREBASE_WEB_CONFIG);
	}
	return getApp();
}

export function getDb() {
	return getFirestore(initFirebaseApp());
}
