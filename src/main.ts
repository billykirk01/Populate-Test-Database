import Axios from "axios";
import * as admin from "firebase-admin";
import { firebaseconfig } from "./firestore";

admin.initializeApp({
    credential: admin.credential.cert(firebaseconfig as admin.ServiceAccount)
});

let firestore = admin.firestore();

let endpoints = [ "posts", "comments", "photos", "todos", "users" ];

export function get<T>(url: string) {
    return new Promise<T>((resolve, reject) => {
        Axios.get<T>(url)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

(async () => {
    try {
        for (const endpoint of endpoints) {
            let collectionRef = firestore.collection(endpoint);
            const items = await get<any[]>(`https://jsonplaceholder.typicode.com/${ endpoint }`);
            for (const item of items) {
                const { id, ...obj } = item;
                collectionRef.doc().set(obj).catch((error) => {
                    console.error(error);
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
})();


