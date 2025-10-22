// store/uploadStore.ts
import { create } from "zustand";

export type ContentType = "story" | "reels" | "news";

export interface OverlayMetadata {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  fontSize: number;
  color: string;
}

export interface MusicMetadata {
  id: string | null;
  uri: string | null;
  startMs: number;
  endMs: number;
  volume: number;
}

interface UploadState {
  // --- Camera & Video ---
  videoUri: string | null;
  contentType: ContentType;

  // --- Trim ---
  trimStart: number;
  trimEnd: number;
  videoDuration: number;

  // --- Volume ---
  videoVolume: number;
  musicVolume: number;

  // --- Music ---
  selectedMusic: MusicMetadata;

  // --- Overlays ---
  overlays: OverlayMetadata[];

  // --- Filter ---
  filter: string;

  // --- Upload Metadata ---
  title: string;
  caption: string;
  hashtags: string;
  mentions: string;

  // --- Actions ---
  setVideoUri: (uri: string, type: ContentType) => void;
  setTrimRange: (start: number, end: number) => void;
  setVideoDuration: (duration: number) => void;
  setVideoVolume: (vol: number) => void;
  setMusicVolume: (vol: number) => void;
  selectMusic: (music: MusicMetadata) => void;
  addOverlay: (overlay: OverlayMetadata) => void;
  updateOverlay: (overlay: OverlayMetadata) => void;
  removeOverlay: (id: string) => void;
  setFilter: (filter: string) => void;
  setUploadMetadata: (data: { title: string; caption: string; hashtags: string; mentions: string }) => void;
  resetAll: () => void;
}

export const useUploadStore = create<UploadState>((set:any) => ({
  // --- Initial State ---
  videoUri: null,
  contentType: "reels",
  trimStart: 0,
  trimEnd: 0,
  videoDuration: 0,
  videoVolume: 100,
  musicVolume: 50,
  selectedMusic: { id: null, uri: null, startMs: 0, endMs: 0, volume: 50 },
  overlays: [],
  filter: "none",
  title: "",
  caption: "",
  hashtags: "",
  mentions: "",

  // --- Actions ---
  setVideoUri: (uri: string, type: ContentType) => set({ videoUri: uri, contentType: type }),
  setTrimRange: (start: number, end: number) => set({ trimStart: start, trimEnd: end }),
  setVideoDuration: (duration: number) => set({ videoDuration: duration }),
  setVideoVolume: (vol: number) => set({ videoVolume: vol }),
  setMusicVolume: (vol: number) =>
    set((state:any) => ({ musicVolume: vol, selectedMusic: { ...state.selectedMusic, volume: vol } })),
  selectMusic: (music: MusicMetadata) => set({ selectedMusic: music }),
  addOverlay: (overlay: OverlayMetadata) =>
    set((state:any) => ({ overlays: [...state.overlays, overlay] })),
  updateOverlay: (overlay: OverlayMetadata) =>
    set((state:any) => ({
      overlays: state.overlays.map((o:any) => (o.id === overlay.id ? overlay : o)),
    })),
  removeOverlay: (id: string) =>
    set((state:any) => ({ overlays: state.overlays.filter((o:any) => o.id !== id) })),
  setFilter: (filter: string) => set({ filter }),
  setUploadMetadata: (data: { title: string; caption: string; hashtags: string; mentions: string }) =>
    set({ ...data }),
  resetAll: () =>
    set({
      videoUri: null,
      contentType: "story",
      trimStart: 0,
      trimEnd: 0,
      videoDuration: 0,
      videoVolume: 100,
      musicVolume: 50,
      selectedMusic: { id: null, uri: null, startMs: 0, endMs: 0, volume: 50 },
      overlays: [],
      filter: "none",
      title: "",
      caption: "",
      hashtags: "",
      mentions: "",
    }),
}));