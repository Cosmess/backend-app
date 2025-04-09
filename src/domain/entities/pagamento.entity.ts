export class Pagamento {
    constructor(
      public id: string,
      public email?: string,
      public status?: string,
      public atualizacao?: string,
      public pagamentoId?: string,
      public data?: string
    ) {}
  }
  