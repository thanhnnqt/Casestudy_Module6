import { imageHash } from "blockhash-core";

export const createImagePHash = async (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.crossOrigin = "anonymous";

        img.onload = async () => {
            try {
                const hash = await imageHash(img, 16, true); // 16 block pHash
                resolve(hash);
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = reject;
    });
};