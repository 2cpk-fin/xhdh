import type { Page, Slice } from './general';

export interface SupportRequest {
    content: string;
}

export interface SupportResponse {
    id: number;
    username: string;
    content: string;
    createTime: string;
}

export type SupportSlice = Slice<SupportResponse>;
export type SupportPage = Page<SupportResponse>;