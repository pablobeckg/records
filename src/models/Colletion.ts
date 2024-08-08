import ICollection from "../contracts/ICollection";
import IRecords from "../contracts/IRecords";
import Record from "./Record";

const modal = document.getElementById('record-modal') as HTMLDivElement;
const closeButton = modal.querySelector('.close-button') as HTMLSpanElement;
const form = document.getElementById('edit-record-form') as HTMLDivElement;
const songsDiv = document.getElementById('songs-div') as HTMLDivElement;
songsDiv.style.display = 'none';

class Collection implements ICollection {
    name: string;
    records: IRecords[] = [];
    toggleOn: boolean = true;

    constructor(name: string) {
        this.name = name;
    }

    pushRecord(record: Record) {
        this.records.push(record);
    }

    removeRecord(record: Record) {
        const recordIndex = this.records.indexOf(record);
        this.records.splice(recordIndex, 1);
    }

    toggleButton(button: HTMLButtonElement): void {
        if (this.toggleOn) {
            button.textContent = 'Save';
            this.toggleOn = false;
        } else {
            button.textContent = 'Edit';
            this.toggleOn = true;
        }
    }

    showRecord(wrapper: HTMLDivElement, records: IRecords[]) {
        records.forEach(record => {
            const recordDiv = document.createElement('div');
            recordDiv.setAttribute('class', 'record-div');
            recordDiv.style.backgroundImage = `url("${record.image}")`;

            recordDiv.style.backgroundSize = 'cover';
            recordDiv.style.backgroundPosition = 'center';
            wrapper.appendChild(recordDiv);

            const recordTitle = document.createElement('h2');
            recordTitle.textContent = record.title;
            recordDiv.appendChild(recordTitle);

            const recordArtist = document.createElement('h3');
            recordArtist.textContent = record.artist;
            recordDiv.appendChild(recordArtist);

            const recordYear = document.createElement('h3');
            recordYear.textContent = record.year;
            recordDiv.appendChild(recordYear);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('class', 'delete-button');
            recordDiv.appendChild(deleteButton);

            deleteButton.addEventListener('click', (event: Event) => {
                event.preventDefault();
                this.removeRecord(record);
                recordDiv.remove();
            });

            recordDiv.addEventListener('click', () => {
                if (this.toggleOn) {
                    this.showModal(record);
                }
            });

            if (this.toggleOn) {
                deleteButton.style.display = 'none';
            } else {
                deleteButton.style.display = 'block';
            }
        });
    }
    
    showModal(record: IRecords) {
        (form.querySelector('#modal-album-title') as HTMLInputElement).innerText = record.title;
        (form.querySelector('#modal-artist-name') as HTMLInputElement).innerText = record.artist || '';
        (form.querySelector('#modal-album-year') as HTMLInputElement).innerText = (record.year?.toString() || '');
        (form.querySelector('#modal-image') as HTMLImageElement).src = (record.image?.toString() || '');
        modal.style.display = 'block';
    
        closeButton.onclick = () => {
            modal.style.display = 'none';
        };
    
        window.onclick = (event: MouseEvent) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    
        const playableSongsButton = document.getElementById('playable-songs') as HTMLButtonElement;
        const newSongNameInput = document.getElementById('new-song-name-input') as HTMLInputElement;
        const songsList = document.getElementById('songs-list') as HTMLUListElement;
        const songsDiv = document.getElementById('songs-div') as HTMLDivElement;
    
        playableSongsButton.textContent = 'Add playable songs';
        newSongNameInput.value = '';
        songsDiv.style.display = 'none';
        songsList.innerHTML = '';
    
        if (record.songs) {
            record.songs.forEach(song => {
                const li = document.createElement('li');
                li.textContent = song;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-song-button';
                li.appendChild(deleteButton);
                songsList.appendChild(li);
    
                deleteButton.addEventListener('click', () => {
                    const songIndex = record.songs!.indexOf(song);
                    if (songIndex !== -1) {
                        record.songs!.splice(songIndex, 1);
                        li.remove();
                        this.saveCollection();
                    }
                });
            });
        }
    
        playableSongsButton.onclick = () => {
            if (playableSongsButton.textContent === 'Add playable songs') {
                playableSongsButton.textContent = 'Save';
                songsDiv.style.display = 'block';
            } else {
                playableSongsButton.textContent = 'Add playable songs';
                songsDiv.style.display = 'none';
                const newSongName = newSongNameInput.value.trim();
                if (newSongName) {
                    if (!record.songs) {
                        record.songs = [];
                    }
                    record.songs.push(newSongName);
                    const li = document.createElement('li');
                    li.textContent = newSongName;
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-song-button';
                    li.appendChild(deleteButton);
                    songsList.appendChild(li);
                    newSongNameInput.value = '';
                    this.saveCollection();
                }
            }
        };
    }
    

    saveCollection() {
        const collectionJson = JSON.stringify(this.records);
        localStorage.setItem('collection', collectionJson);
    }

    loadCollection(): IRecords[] | null {
        const collectionJson = localStorage.getItem('collection');
        if (!collectionJson) {
            return null;
        }
        this.records = JSON.parse(collectionJson);
        return this.records;
    }

    searchRecords(term: string): IRecords[] {
        const lowerCaseTerm = term.toLowerCase();
        return this.records.filter(record => {
            return record.title.toLowerCase().includes(lowerCaseTerm) ||
                   record.artist.toLowerCase().includes(lowerCaseTerm) ||
                   record.year.toString().toLowerCase().includes(lowerCaseTerm);
        });
    }
}

export default Collection;
