import api from './axios';
import type { MatchResponseDTO, SoloMatchReport, SoloChoiceRequest } from '../types/SoloMatch';

export const soloMatchAPI = {
    startDuel: async (): Promise<MatchResponseDTO> => {
        const { data } = await api.post<MatchResponseDTO>('/api/duel/matches/start');
        return data;
    },

    chooseWinner: async (choice: SoloChoiceRequest): Promise<SoloMatchReport> => {
        const { data } = await api.post<SoloMatchReport>('/api/duel/matches/choose', choice);
        return data;
    }
};