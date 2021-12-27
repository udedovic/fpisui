export interface IPresenceItem {
  worksheetId: number;
  redniBroj: number;
  vrstaPrisustva: number;
  opis: string;
  datum: Date;
}

export interface IAbsenceItem {
  worksheetId: number;
  redniBroj: number;
  brojOdluke: number;
  vrstaOdsustva: number;
  datumOd: Date;
  datumDo: Date;
}
