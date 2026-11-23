import mealImage from '@/assets/meal-menu.jpg';
import snackAsset from '@/assets/weekly-snack-routine.jpeg.asset.json';
import { SITE_URL } from '@/lib/seo';

export const mealRoutineUrl = mealImage;
// Absolute hosted URLs also work when the website is deployed on another host.
export const snackRoutineUrl = new URL(snackAsset.url, SITE_URL).href;