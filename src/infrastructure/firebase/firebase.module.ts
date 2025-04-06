import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';
process.env.FIRESTORE_USE_REST = 'true';
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
      },
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService], // ✅ Certifique-se de que o FirebaseService está exportado
})
export class FirebaseModule {}
