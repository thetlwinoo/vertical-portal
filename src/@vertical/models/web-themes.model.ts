export interface IWebThemes {
    id?: number;
    name?: string;
    fontSize?: number;
    fontColor?: number;
    fontWeight?: number;
    fontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export class WebThemes implements IWebThemes {
    constructor(
        public id?: number,
        public name?: string,
        public fontSize?: number,
        public fontColor?: number,
        public fontWeight?: number,
        public fontFamily?: string,
        public primaryColor?: string,
        public secondaryColor?: string
    ) { }
}
