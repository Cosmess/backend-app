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

    async findAll(id: string): Promise<Agenda[]> {
        const db = this.firebaseService.getFirestore();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const snapshot = await db
            .collection(this.collection)
            .where('tomadorId', '==', id)
            .where('status', '==', 'ABERTO')
            .get();

        const agendas = snapshot.docs.map(doc => doc.data() as Agenda);

        return agendas.filter(agenda => agenda.horario && new Date(agenda.horario) >= yesterday);
    }

    async update(id: string, data: Partial<Agenda>): Promise<void> {
        const db = this.firebaseService.getFirestore();
        await db.collection(this.collection).doc(id).update(data);
    }

    async delete(id: string, userId: string): Promise<void> {
        const db = this.firebaseService.getFirestore();
        const snapshot = await db
            .collection(this.collection)
            .where('id', '==', id)
            .where('tomadorId', '==', userId)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await doc.ref.delete();
        }
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
    
      const snapshot = await db
        .collection('agendas')
        .where('horario', 'in', listaHorarios)
        .where('status', '==', 'ABERTO')
        .get();
    
        return snapshot.docs.map(doc => doc.data() as Agenda);
    }

    async findByIds(ids: string[]): Promise<Agenda[]> {
        const db = this.firebaseService.getFirestore();
      
        const listaIds = Array.isArray(ids) ? ids : [ids];
  
        const snapshot = await db
          .collection('agendas')
          .where('id', 'in', listaIds)
          .get();
      
          return snapshot.docs.map(doc => doc.data() as Agenda);
      }    
}
