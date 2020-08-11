export class UploadCategory {
    mainCategoryEnglish?: string;
    subCategoryEnglish?: string;
    categoryEnglish?: string;
    mainCategoryMyanmar?: string;
    subCategoryMyanmar?: string;
    categoryMyanmar?: string;

    constructor(data) {
        {
            this.mainCategoryEnglish = data.MainCategoryEnglish.trim() || '';
            this.subCategoryEnglish = data.SubCategoryEnglish.trim() || '';
            this.categoryEnglish = data.CategoryEnglish.trim() || '';
            this.mainCategoryMyanmar = data.MainCategoryMyanmar.trim() || '';
            this.subCategoryMyanmar = data.SubCategoryMyanmar.trim() || '';
            this.categoryMyanmar = data.CategoryMyanmar.trim() || '';
        }
    }
}
