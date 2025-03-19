import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App) {}

  getFirestore() {
    return this.firebaseApp.firestore();
  }
}
