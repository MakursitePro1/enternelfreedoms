import { usePublishedContent } from './institution-content';
import principalPhoto from '@/assets/eternal-9.jpg.asset.json';

export function usePrincipal() {
  const { items, loaded } = usePublishedContent('teacher');
  const item = items.find((record) => record.slug === 'institution-principal');
  return {
    name: item?.title ?? (loaded ? '' : 'মোঃ আনছারুল হক (আনছার)'),
    role: item?.detail ?? (loaded ? '' : 'Founder Principal & Director'),
    image: item?.image_url ?? (loaded ? '' : principalPhoto.url),
  };
}