export type Project = {
  name: string;
  url: string;
  description: string;
  emoji: string;
  accent: "pink" | "sky" | "mint" | "sunny" | "grape";
};

// Add new projects here — they'll appear automatically on the page.
export const projects: Project[] = [
  {
    name: "cytaty.scooby.boo",
    url: "https://cytaty.scooby.boo",
    description:
      "Polski generator cytatów politycznych. Bez złych intencji — dla zabawy.",
    emoji: "🗣️",
    accent: "pink",
  },
  {
    name: "dowcipy.scooby.boo",
    url: "https://dowcipy.scooby.boo",
    description:
      "Baza dowcipów uratowana z nieistniejącej już aplikacji DowcipyXXL.",
    emoji: "😂",
    accent: "sunny",
  },
  {
    name: "polskieaudio.scooby.boo",
    url: "https://polskieaudio.scooby.boo",
    description:
      "Wyszukiwarka filmów i seriali z polskim dubbingiem lub lektorem.",
    emoji: "🎬",
    accent: "sky",
  },
];
