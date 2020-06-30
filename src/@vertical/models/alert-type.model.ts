export enum AlertType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}

export interface IAlerts {
  type?: AlertType;
  message?: string;
  description?: string;
  showIcon?: boolean;
}

export class Alerts implements IAlerts {
  constructor(
    public type?: AlertType,
    public message?: string,
    public description?: string,
    public showIcon?: boolean
  ) { }
}
