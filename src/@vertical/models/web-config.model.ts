export interface IWebConfig {
    id?: number;
    activeFlag?: boolean;
    webThemeName?: string;
    webThemeId?: number;
}

export class WebConfig implements IWebConfig {
    constructor(public id?: number, public activeFlag?: boolean, public webThemeName?: string, public webThemeId?: number) {
        this.activeFlag = this.activeFlag || false;
    }
}
