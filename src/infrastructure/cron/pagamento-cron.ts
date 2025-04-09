import * as cron from 'node-cron';
import { EmailService } from '../../application/services/email.service';
import * as moment from 'moment';
import { ProfissionalRepository } from '../../domain/repositories/profissional.repository';
import { EstabelecimentoRepository } from '../../domain/repositories/estabelecimento.repository';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';

const firebaseService = new FirebaseService();
const profissionalRepository = new ProfissionalRepository(firebaseService);
const estabelecimentoRepository = new EstabelecimentoRepository(firebaseService);
const emailService = new EmailService(profissionalRepository, estabelecimentoRepository);

const checkPaymentDueDates = async () => {
const profissionais = await profissionalRepository.findAll();
const estabelecimentos = await estabelecimentoRepository.findAll();

const entities = [
    ...profissionais.map(profissional => ({
        email: profissional.email,
        dateLastPayment: profissional.dateLastPayment,
    })),
    ...estabelecimentos.map(estabelecimento => ({
        email: estabelecimento.email,
        dateLastPayment: estabelecimento.dateLastPayment,
    })),
];


  const today = new Date();

  entities.forEach(entity => {
    const { email, dateLastPayment } = entity;
    let paymentDueDate: moment.Moment | null = null;

    if (
      dateLastPayment &&
      typeof dateLastPayment === 'object' &&
      '_seconds' in dateLastPayment
    ) {
      // Timestamp do Firebase
      paymentDueDate = moment.unix((dateLastPayment as any)._seconds).add(31, 'days');
    } else if (dateLastPayment instanceof Date) {
      // Tipo Date
      paymentDueDate = moment(dateLastPayment).add(31, 'days');
    }
  
    if (!paymentDueDate) return;
  
    const today = moment();
    const daysUntilDue = paymentDueDate.diff(today, 'days');

    if (daysUntilDue === 5) {
      emailService.enviarEmail(
        email,
        'Aviso: Vencimento Próximo',
        'Sua assinatura vencerá em 5 dias. Por favor, renove para evitar interrupções.',
      );
    } else if (daysUntilDue === 1) {
      emailService.enviarEmail(
        email,
        'Aviso: Último Dia para Renovação',
        'Sua assinatura vencerá amanhã. Por favor, renove para evitar interrupções.',
      );
    } else if (daysUntilDue <= 0) {
      emailService.enviarEmail(
        email,
        'Aviso: Assinatura Vencida',
        'Sua assinatura venceu. Por favor, renove para continuar utilizando nossos serviços.',
      );
    }
  });
};

// Agendar a cron para rodar diariamente às 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Executando verificação de vencimentos...');
  await checkPaymentDueDates();
  console.log('✅ Verificação concluída.');
});