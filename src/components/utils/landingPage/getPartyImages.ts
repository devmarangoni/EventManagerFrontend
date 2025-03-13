const images = import.meta.glob<{ default: string }>("@/assets/images/landingPage/gallery/*.jpg", { eager: true });

export const getPartyImages = (): string[] => {
  return Object.values(images).map((image) => image.default);
};