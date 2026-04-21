import api from './axios';
import type {
    MatchResponseDTO,
    SoloMatchReport,
    SoloChoiceRequest
} from '../types/SoloMatch';

export const soloMatchAPI = {
    /**
     * [CREATE] Starts a new solo duel match
     */
    startDuel: async (): Promise<MatchResponseDTO> => {
        const { data } = await api.post<MatchResponseDTO>('/api/matches/solo/start');
        return data;
    },

    /**
     * [CREATE/UPDATE] Submits the user's choice for the winner
     */
    chooseWinner: async (choice: SoloChoiceRequest): Promise<SoloMatchReport> => {
        const { data } = await api.post<SoloMatchReport>('/api/matches/solo/choose', choice);
        return data;
    }
};