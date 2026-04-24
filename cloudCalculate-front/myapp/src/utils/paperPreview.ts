export const getPaperPreviewSearchParams = () => {
  if (typeof window === 'undefined') {
    return new URLSearchParams('');
  }
  return new URLSearchParams(window.location.search);
};

export const isPaperPreview = () => getPaperPreviewSearchParams().get('paper') === '1';

export const getPaperPreviewParam = (key: string) => getPaperPreviewSearchParams().get(key);
