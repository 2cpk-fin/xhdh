import api from "./axios";
import { universityApi } from "./universityApi";
import type { SoloMatchReport, SoloMatchResponse } from "../types/soloMatch";

export const soloMatchApi = {
    startSoloMatch: async (): Promise<SoloMatchResponse> => {
        const allUniversities = await universityApi.getAllUniversities();

        if (!allUniversities || allUniversities.length < 2) {
            throw new Error("Not enough universities to start a match");
        }

        const randomIndex = Math.floor(Math.random() * allUniversities.length);
        const uni1 = allUniversities[randomIndex];

        let opponents = allUniversities.filter(u => u.id !== uni1.id);

        const uni1Tags = uni1.tags || [];
        const opponentsWithSharedTags = opponents.filter(u =>
            Array.isArray(u.tags) && u.tags.some(tag => uni1Tags.includes(tag))
        );

        if (opponentsWithSharedTags.length > 0) {
            opponents = opponentsWithSharedTags;
        }

        opponents.sort((a, b) => {
            const eloDiffA = Math.abs((a.elo || 0) - (uni1.elo || 0));
            const eloDiffB = Math.abs((b.elo || 0) - (uni1.elo || 0));
            return eloDiffA - eloDiffB;
        });

        const poolSize = Math.min(5, opponents.length);
        const randomOpponentIndex = Math.floor(Math.random() * poolSize);
        const uni2 = opponents[randomOpponentIndex];

        return {
            id: crypto.randomUUID(),
            university1: uni1,
            university2: uni2
        } as unknown as SoloMatchResponse;
    },

    chooseWinner: async (winnerId: number, loserId: number): Promise<SoloMatchReport> => {
        const { data } = await api.post<SoloMatchReport>('/solo/matches/choose', null, {
            params: { winnerId, loserId }
        });
        return data;
    }
}