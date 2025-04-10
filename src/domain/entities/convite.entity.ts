export class Convite {
    constructor(
      public id: string,
      public status?: string,
      public tomadorId?: string,
      public prestadorId?: string,
      public mensagem?: string,
      public agendaId?: string,
      public horario?: string,
    ) {}
  }
  