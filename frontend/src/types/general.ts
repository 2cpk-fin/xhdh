export interface Slice<T> {
    content: T[];
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface Page<T> extends Slice<T> {
    totalElements: number;
    totalPages: number;
}