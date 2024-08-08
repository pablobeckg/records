import Collection from "./models/Colletion";
import Record from "./models/Record";

const titleInput = document.getElementById('record-title') as HTMLInputElement;
const artistInput = document.getElementById('artist-name') as HTMLInputElement;
const yearInput = document.getElementById('record-year') as HTMLInputElement;
const formElement = document.getElementById('record-form') as HTMLFormElement;
const recordsWrapper = document.getElementById('records-wrapper') as HTMLDivElement;
const toggleButton = document.getElementById('edit-button') as HTMLButtonElement;
const imageInput = document.getElementById('image-input') as HTMLInputElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

const fullCollection: Collection = new Collection('Full collection');

const loadAndDisplayCollection = () => {
  fullCollection.loadCollection();
  fullCollection.showRecord(recordsWrapper, fullCollection.records);
};

window.addEventListener('load', loadAndDisplayCollection);


formElement.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    recordsWrapper.innerHTML = '';
    const newRecord: Record = new Record(titleInput.value, artistInput.value, yearInput.value, imageInput.value);
    fullCollection.pushRecord(newRecord);
    fullCollection.saveCollection();
    fullCollection.showRecord(recordsWrapper, fullCollection.records);
    console.log(newRecord.image);
    titleInput.value = '';
    artistInput.value = '';
    yearInput.value = '';
    imageInput.value = '';
});


toggleButton.addEventListener('click', () => {
  recordsWrapper.innerHTML = '';
  fullCollection.toggleButton(toggleButton);
  if (fullCollection.toggleOn) {
    fullCollection.saveCollection();
  }
  
  const recordsToShow = searchInput.value ? fullCollection.searchRecords(searchInput.value) : fullCollection.records;
  fullCollection.showRecord(recordsWrapper, recordsToShow);
});

searchInput.addEventListener('input', () => {
  recordsWrapper.innerHTML = '';
  const filteredRecords = searchInput.value ? fullCollection.searchRecords(searchInput.value) : fullCollection.records;
  fullCollection.showRecord(recordsWrapper, filteredRecords);
});



