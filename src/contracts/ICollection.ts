import IRecords from "./IRecords";

interface ICollection {
    name: string;
    records: IRecords[];
    toggleOn: boolean;
}

export default ICollection;