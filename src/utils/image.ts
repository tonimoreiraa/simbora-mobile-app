/**
 * Função utilitária para formatar URLs das imagens
 * Garante que as URLs das imagens sejam formatadas corretamente,
 * removendo duplicações e tratando diferentes formatos
 */
export const getCorrectImageUrl = (imageUrl: string): string => {
  if (!imageUrl) {
    return '';
  }

  // Remove duplicação de uploads/https://
  if (imageUrl.includes('uploads/https://')) {
    return imageUrl.replace('https://api.rapdo.app/uploads/', '');
  }

  // Se já é uma URL completa, retorna como está
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    return imageUrl;
  }

  // Caso padrão, retorna a URL como está
  return imageUrl;
};
