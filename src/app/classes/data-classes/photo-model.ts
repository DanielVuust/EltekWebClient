export class PhotoModel{
    id?: string;
    photoData?: string;
    createdUtc?: Date;
    constructor(id?: string, photoData?: string, createdUtc?: Date){
        this.id = id;
        this.photoData = photoData;
        this.createdUtc = createdUtc;
    }
}