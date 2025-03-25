export class Agenda {
    constructor(
      public id: string,
      public horario?: Date,
      public status?: string,
      public tomadorId?: string,
      public prestadorId?: string,
      public prestadorCheck?: string,
      public tomadorCheck?: string,
      public prestadorAceite?: string,
      public tomadorAceite?: string
    ) {}
  }
  