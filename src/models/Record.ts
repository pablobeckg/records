import IRecords from "../contracts/IRecords";

class Record implements IRecords{
    title: string;
    artist: string;
    year: string;
    image?: string;
    songs?: string[];

    constructor(title: string, artist: string, year: string, image?: string) {
        this.title = title;
        this.artist = artist;
        this.year = year;
        this.image = image;
        this.songs = [];
    }
}

export default Record;