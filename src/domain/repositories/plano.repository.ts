import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Plano } from '../entities/plano.entity';

@Injectable()
export class PlanoRepository {
    private collection = 'planos';

    constructor(private readonly firebaseService: FirebaseService) { }

    async create(plano: Plano): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(plano.id).set({ ...plano });
    }

    async findByEmail(email: string): Promise<Plano | null> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).where('email', '==', email).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as Plano;
    }

    async findAll(): Promise<Plano[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).get();
        return snapshot.docs.map(doc => doc.data() as Plano);
    }

    async findOne(): Promise<Plano> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).where('status', '==', 'ATIVO').get();
        return snapshot.docs[0].data() as Plano;
    }

    async update(id: string, data: Partial<Plano>): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).update(data);
    }

    async delete(id: string): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).delete();
    }

}
