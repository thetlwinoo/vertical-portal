export class UploadCategory {
    rootName?: string;
    rootNameMyanmar?: string;
    parentName?: string;
    parentNameMyanmar?: string;
    name?: string;
    nameMyanmar?: string;

    constructor(data) {
        {
            this.rootName = data['Root Name'] || '';
            this.rootNameMyanmar = data['Root Name Myanmar'] || '';
            this.parentName = data['Parent Name'] || '';
            this.parentNameMyanmar = data['Parent Name Myanmar'] || '';
            this.name = data.Name || '';
            this.nameMyanmar = data['Name Myanmar'] || '';
        }
    }
}
