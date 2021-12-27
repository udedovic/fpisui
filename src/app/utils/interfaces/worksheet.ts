import { IAbsenceItem, IPresenceItem } from './item';
import { IWorker } from './worker';

export interface IWorksheet {
  sifra: number;
  worker: IWorker;
  presenceItemList: IPresenceItem[];
  absenceItemList: IAbsenceItem[];
}
