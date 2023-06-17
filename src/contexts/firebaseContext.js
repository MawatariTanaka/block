import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBvaVHDNj0eUlLVkionRvRYDWeryUixZHY',
    authDomain: 'block-shift.firebaseapp.com',
    projectId: 'block-shift',
    storageBucket: 'block-shift.appspot.com',
    messagingSenderId: '1037861505629',
    appId: '1:1037861505629:web:aa95f7a4bd44330bf65bb4',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export function convertNestedArrayToObject(nestedArray) {
    const convertedObject = {};
    for (let i = 0; i < nestedArray.length; i++) {
        const rowName = `row${i + 1}`;
        const row = nestedArray[i];
        const rowObj = {};
        for (let j = 0; j < row.length; j++) {
            const colName = `col${j + 1}`;
            rowObj[colName] = row[j];
        }
        convertedObject[rowName] = rowObj;
    }
    return convertedObject;
}
export function convertObjectToNestedArray(obj) {
    const nestedArray = [];
    for (let i = 0; i < Object.keys(obj).length; i++) {
        const rowName = `row${i + 1}`;
        const row = obj[rowName];
        const rowArray = [];
        for (let j = 0; j < Object.keys(row).length; j++) {
            const colName = `col${j + 1}`;
            rowArray.push(row[colName]);
        }
        nestedArray.push(rowArray);
    }
    return nestedArray;
}
