import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Agenda } from '../entities/agenda.entity';
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class AgendaRepository {
    private collection = 'agendas';

    constructor(private readonly firebaseService: FirebaseService) { }

    async create(agenda: Agenda): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(agenda.id).set({ ...agenda });
    }

    async findAll(): Promise<Agenda[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db.collection(this.collection).get();
        return snapshot.docs.map(doc => doc.data() as Agenda);
    }

    async update(id: string, data: Partial<Agenda>): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).update(data);
    }

    async delete(id: string): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).delete();
    }

    async findByTomador(id: string): Promise<Agenda[]> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection(this.collection)
            .where('tomadorId', '==', id)
            .where('status', '==', 'ABERTO')
            .get();

        return snapshot.docs.map(doc => doc.data() as Agenda);
    }
    
    async findByHorario(horarios: string[]): Promise<Agenda[]> {
      const db = this.firebaseService.getFirestore();
    
      const listaHorarios = Array.isArray(horarios) ? horarios : [horarios];

      // converte datas para Timestamp
      const datas = listaHorarios.map(h => new Date(h));
    
      const snapshot = await db
        .collection('agendas')
        .where('horario', 'in', listaHorarios)
        .where('status', '==', 'ABERTO')
        .get();
    
        return snapshot.docs.map(doc => doc.data() as Agenda);
    }
    

}
