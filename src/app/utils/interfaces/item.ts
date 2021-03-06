export interface IPresenceItem {
  worksheetId?: number;
  redniBroj: number;
  vrstaPrisustva: any;
  opis: string;
  datum: Date;
  status?: string;
}

export interface IAbsenceItem {
  worksheetId?: number;
  redniBroj: number;
  brojOdluke: number;
  vrstaOdsustva: any;
  datumOd: Date;
  datumDo: Date;
  status?: string;
}
