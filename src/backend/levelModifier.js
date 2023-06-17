import { db, convertNestedArrayToObject } from '../contexts/firebaseContext';
import { collection, addDoc } from 'firebase/firestore';

export async function addNewLevel(initGrid, targetGrid, id) {
    const convertedInitGrid = convertNestedArrayToObject(initGrid);
    const convertedTargetGrid = convertNestedArrayToObject(targetGrid);
    await addDoc(collection(db, 'grid'), {
        initGrid: convertedInitGrid,
        targetGrid: convertedTargetGrid,
        level: id,
    });
}
