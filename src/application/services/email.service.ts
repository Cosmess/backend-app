import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { randomInt } from 'crypto';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';
import { EstabelecimentoRepository } from 'src/domain/repositories/estabelecimento.repository';

@Injectable()
export class EmailService {
    constructor(private readonly profissionalRepository: ProfissionalRepository,
        private readonly estabelecimentoRepository: EstabelecimentoRepository,
    ) { }
    private ses = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });
    async enviarCodigoVerificacao(email: string): Promise<string> {
        try {
            const codigo = randomInt(100000, 999999).toString();

            const params = {
                Source: process.env.AWS_EMAIL_FROM,
                Destination: { ToAddresses: [email] },
                Message: {
                    Subject: { Data: 'Código de Verificação' },
                    Body: {
                        Html: {
                            Data: `
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Código de Verificação</title>
                                    <style>
                                        body {
                                            font-family: Arial, sans-serif;
                                            background-color: #f4f4f4;
                                            margin: 0;
                                            padding: 0;
                                        }
                                        .email-container {
                                            max-width: 600px;
                                            margin: 20px auto;
                                            background: #ffffff;
                                            padding: 20px;
                                            border-radius: 8px;
                                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                        }
                                        .header {
                                            text-align: center;
                                            margin-bottom: 20px;
                                        }
                                        .header img {
                                            max-width: 150px;
                                        }
                                        .content {
                                            text-align: center;
                                            color: #333333;
                                        }
                                        .content h1 {
                                            font-size: 24px;
                                            margin-bottom: 10px;
                                        }
                                        .content p {
                                            font-size: 16px;
                                            margin-bottom: 20px;
                                        }
                                        .code {
                                            display: inline-block;
                                            font-size: 20px;
                                            font-weight: bold;
                                            color: #ffffff;
                                            background-color: #007bff;
                                            padding: 10px 20px;
                                            border-radius: 5px;
                                            text-decoration: none;
                                        }
                                        .footer {
                                            text-align: center;
                                            margin-top: 20px;
                                            font-size: 12px;
                                            color: #777777;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="email-container">
                                        <div class="header">
                                            <img src="https://dentsfreela.s3.us-east-1.amazonaws.com/logo.png" alt="Logo">
                                        </div>
                                        <div class="content">
                                            <h1>Seu Código de Verificação</h1>
                                            <p>Olá,</p>
                                            <p>Seu código de verificação é:</p>
                                            <p class="code">${codigo}</p>
                                            <p>Este código é válido por 5 minutos.</p>
                                        </div>
                                        <div class="footer">
                                            <p>Se você não solicitou este código, ignore este email.</p>
                                        </div>
                                    </div>
                                </body>
                                </html>
                            `,
                        },
                    },
                },
            };

            await this.ses.send(new SendEmailCommand(params));

            return codigo;
        } catch (error) {
            console.error(error.message);
            return "";
        }
    }

    async renviarCodigoVerificacao(email: string): Promise<any> {
        let user: any
        let isProfissional = true;
        user = await this.profissionalRepository.findByEmail(email);
        if (!user) {
            user = await this.estabelecimentoRepository.findByEmail(email);
            isProfissional = false;
        }
        if (!user) {
            return { success: false, codigo: null };
        }


        const novoCodigo = await this.enviarCodigoVerificacao(email);

        if (isProfissional) {
            await this.profissionalRepository.update(user.id, { codigo: novoCodigo });
                    // Limpa o código após 5 minutos (300_000 ms)
        setTimeout(() => {
            this.profissionalRepository.update(user.id, { codigo: '' });
        }, 300_000);
        }
        else {
            await this.estabelecimentoRepository.update(user.id, { codigo: novoCodigo });
                    // Limpa o código após 5 minutos (300_000 ms)
        setTimeout(() => {
            this.profissionalRepository.update(user.id, { codigo: '' });
        }, 300_000);
        }

        return { success: true, codigo: novoCodigo };
    }

    async verificarCodigo(email: string, codigo: string): Promise<boolean> {

        let user: any
        let isProfissional = true;
        user = await this.profissionalRepository.findByEmail(email);
    
        if (!user) {
            user = await this.estabelecimentoRepository.findByEmail(email);
            isProfissional = false;
        }
        if (!user) {
            false
        }

        if (user.codigo === codigo) {
            return true;
        } else {
            return false;
        }
    }

}
