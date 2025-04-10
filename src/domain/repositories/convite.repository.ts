import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Convite } from '../entities/convite.entity';

@Injectable()
export class ConviteRepository {
    private collection = 'convites';

    constructor(private readonly firebaseService: FirebaseService) { }

    async create(convite: Convite): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(convite.id).set({ ...convite });
    }

    async findAll(): Promise<Convite[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).get();
        return snapshot.docs.map(doc => doc.data() as Convite);
    }

    async update(id: string, data: Partial<Convite>): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).update(data);
    }

    async delete(id: string): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).delete();
    }

    async findByTomador(id: string): Promise<Convite[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection(this.collection)
            .where('tomadorId', '==', id)
            .get();

        return snapshot.docs.map(doc => doc.data() as Convite);
    }

    async findByPrestador(id: string): Promise<Convite[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection(this.collection)
            .where('prestadorId', '==', id)
            .get();

        return snapshot.docs.map(doc => doc.data() as Convite);
    }

    async findByHorario(horarios: string[]): Promise<Convite[]> {
        const db = this.firebaseService.getFirestore();

        const listaHorarios = Array.isArray(horarios) ? horarios : [horarios];

        const snapshot = await db
            .collection('convites')
            .where('horario', 'in', listaHorarios)
            .where('status', '==', 'ABERTO')
            .get();

        return snapshot.docs.map(doc => doc.data() as Convite);
    }

    async findById(id: string): Promise<Convite | null> {
        const db = this.firebaseService.getFirestore();
        const doc = await db.collection(this.collection).doc(id).get();
        return doc.exists ? (doc.data() as Convite) : null;
    }

    async findByIdAndTomador(id: string, tomadorId: string): Promise<Convite | null> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
          .collection('convites')
          .where('id', '==', id)
          .where('tomadorId', '==', tomadorId)
          .limit(1)
          .get();
      
        if (!snapshot.empty) {
          return snapshot.docs[0].data() as Convite;
        }
      
        return null;
      }

      async findByIdAndPrestador(id: string, tomadorId: string): Promise<Convite | null> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
          .collection('convites')
          .where('id', '==', id)
          .where('prestadorId', '==', tomadorId)
          .limit(1)
          .get();
      
        if (!snapshot.empty) {
          return snapshot.docs[0].data() as Convite;
        }
      
        return null;
      }

      async findByPrestadorAndAgendaId(prestadorId: string = '', agendaId: string = ''): Promise<Convite | null> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection(this.collection)
            .where('prestadorId', '==', prestadorId)
            .where('agendaId', '==', agendaId)
            .get();
            
            if (!snapshot.empty) {
                return snapshot.docs[0].data() as Convite;
              }
            
              return null;
        }
      
}
