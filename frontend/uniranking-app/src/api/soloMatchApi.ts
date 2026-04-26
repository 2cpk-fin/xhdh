import api from "./axios";
import type { SoloMatchReport, SoloMatchResponse } from "../types/soloMatch";

export const soloMatchApi = {
    startSoloMatch: async (): Promise<SoloMatchResponse> => {
        const { data } = await api.post<SoloMatchResponse>('/solo/matches/start');
        return data;
    },

    chooseWinner: async (publicMatchId: string, winnerId: number): Promise<SoloMatchReport> => {
        const { data } = await api.post<SoloMatchReport>('/solo/matches/choose', null, {
            params: { publicMatchId, winnerId }
        });
        return data;
    }
}