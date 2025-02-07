export class CommentModel{
    id?: string;
    comment?: string;
    userId?: string;
    createdUtc?: Date;
    constructor(id: string, comment: string, userId: string, createdUtc: Date){
        this.id = id;
        this.comment = comment;
        this.userId = userId;
        this.createdUtc = createdUtc;
    }
}