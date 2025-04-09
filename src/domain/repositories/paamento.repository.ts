import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Pagamento } from '../entities/pagamento.entity';

@Injectable()
export class PagamentoRepository {
    private collection = 'pagamentos';

    constructor(private readonly firebaseService: FirebaseService) { }

    async create(pagamento: Pagamento): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(pagamento.id).set({ ...pagamento });
    }

    async findByEmail(email: string): Promise<Pagamento | null> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).where('email', '==', email).get();
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as Pagamento;
    }

    async findAll(): Promise<Pagamento[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).get();
        return snapshot.docs.map(doc => doc.data() as Pagamento);
    }

    async update(id: string, data: Partial<Pagamento>): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).update(data);
    }

    async delete(id: string): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).delete();
    }

}
