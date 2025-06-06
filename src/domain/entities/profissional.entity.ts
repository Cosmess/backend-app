export class Profissional {
    constructor(
      public id: string,
      public nome: string,
      public email: string,
      public celular: string,
      public cro: string,
      public endereco: string,
      public numero: string,
      public cep: string,
      public bairro: string,
      public cidade: string,
      public estado: string,
      public created: Date,
      public updated: Date,
      public descricao: string,
      public instagram: string,
      public link: string,
      public exibirNumero: boolean,
      public status: string,
      public paidStatus: boolean,
      public dateLastPayment: Date,
      public especialidades: string[],
      public comentariosId: string,
      public planoId: string,
      public emailVerificado: boolean,
      public senha: string,
      public foto?: string,
      public codigo?: string
    ) {}
  }
  