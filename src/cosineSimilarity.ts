import { similarity } from "ml-distance";

export const cosineSimilarity = (a: number[], b: number[]) => {
    return similarity.cosine(a, b);
};