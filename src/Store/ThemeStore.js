import { create } from 'zustand';

const effects = ['RINGS', 'CLOUDS2', 'FOG', 'WAVES', 'NET', 'BIRDS', 'HALO'];

export const useThemeStore = create((set) => ({
    currentEffect: 'RINGS',
    changeEffect: () => set((state) => {
        const currentIndex = effects.indexOf(state.currentEffect);
        const nextIndex = (currentIndex + 1) % effects.length;
        return { currentEffect: effects[nextIndex] };
    }),
}));
