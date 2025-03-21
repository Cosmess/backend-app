import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { randomInt } from 'crypto';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';

@Injectable()
export class EmailService {
    constructor(private readonly profissionalRepository: ProfissionalRepository) {}
    private ses = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    async enviarCodigoVerificacao(email: string): Promise<string> {
        try {
            console.log(process.env.AWS_REGION);
            console.log(process.env.AWS_ACCESS_KEY_ID);
            console.log(process.env.AWS_SECRET_ACCESS_KEY);
            console.log(process.env.AWS_EMAIL_FROM); 
            const codigo = randomInt(100000, 999999).toString(); // Gera um código  de 6 dígitos

            const params = {
                Source: process.env.AWS_EMAIL_FROM, // Ex: "noreply@seusite.com"
                Destination: { ToAddresses: [email] },
                Message: {
                    Subject: { Data: 'Código de Verificação' },
                    Body: {
                        Text: { Data: `Seu código de verificação é: ${codigo}` },
                    },
                },
            };

            await this.ses.send(new SendEmailCommand(params));

            return codigo; // Armazene este código temporariamente no banco de dados 
        } catch (error) {
            console.error(error.message);
            return "";
        }

    }

    async renviarCodigoVerificacao(email: string): Promise<string> {
        const profissional = await this.profissionalRepository.findByEmail(email);
        if (!profissional) {
            throw new Error('Profissional não encontrado');
        }

        const novoCodigo = await this.enviarCodigoVerificacao(email);
        await this.profissionalRepository.update(profissional.id, { codigo: novoCodigo });

        // Limpa o código após 5 minutos (300_000 ms)
        setTimeout(() => {
            this.profissionalRepository.update(profissional.id, { codigo: '' });
        }, 300_000);

        return novoCodigo;
    }

}
