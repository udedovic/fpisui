export interface IPresenceItem {
  redniBroj: number;
  vrstaPrisustva: number;
  opisStavke: string;
  datum: Date;
}

export interface IAbsenceItem {
  redniBroj: number;
  brojOdluke: number;
  vrstaOdsustva: number;
  datumOd: Date;
  datumDo: Date;
}
