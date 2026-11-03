import { PrayerTimes } from '../types';

export interface CityConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  countryAr: string;
  countryEn: string;
  timezoneOffsetHours: number;
  baseTimes: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export const SUPPORTED_CITIES: CityConfig[] = [
  {
    id: 'rabat',
    nameAr: 'الرباط',
    nameEn: 'Rabat',
    nameFr: 'Rabat',
    countryAr: 'المغرب',
    countryEn: 'Morocco',
    timezoneOffsetHours: 1,
    baseTimes: {
      fajr: '05:45',
      sunrise: '07:15',
      dhuhr: '12:34',
      asr: '15:52',
      maghrib: '18:20',
      isha: '19:40',
    },
  },
  {
    id: 'makkah',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    nameFr: 'La Mecque',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    timezoneOffsetHours: 3,
    baseTimes: {
      fajr: '05:12',
      sunrise: '06:30',
      dhuhr: '12:18',
      asr: '15:38',
      maghrib: '18:05',
      isha: '19:35',
    },
  },
  {
    id: 'madinah',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah',
    nameFr: 'Médine',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    timezoneOffsetHours: 3,
    baseTimes: {
      fajr: '05:15',
      sunrise: '06:34',
      dhuhr: '12:19',
      asr: '15:39',
      maghrib: '18:04',
      isha: '19:34',
    },
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    nameFr: 'Le Caire',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    timezoneOffsetHours: 2,
    baseTimes: {
      fajr: '04:58',
      sunrise: '06:26',
      dhuhr: '11:54',
      asr: '15:10',
      maghrib: '17:22',
      isha: '18:42',
    },
  },
  {
    id: 'riyadh',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    nameFr: 'Riyad',
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    timezoneOffsetHours: 3,
    baseTimes: {
      fajr: '04:55',
      sunrise: '06:14',
      dhuhr: '11:47',
      asr: '15:03',
      maghrib: '17:21',
      isha: '18:51',
    },
  },
  {
    id: 'paris',
    nameAr: 'باريس',
    nameEn: 'Paris',
    nameFr: 'Paris',
    countryAr: 'فرنسا',
    countryEn: 'France',
    timezoneOffsetHours: 1,
    baseTimes: {
      fajr: '06:35',
      sunrise: '08:05',
      dhuhr: '12:56',
      asr: '15:22',
      maghrib: '17:47',
      isha: '19:15',
    },
  },
];

export function getPrayerTimesForCity(cityId: string = 'rabat', now: Date = new Date()): PrayerTimes {
  const city = SUPPORTED_CITIES.find((c) => c.id === cityId) || SUPPORTED_CITIES[0];
  const { fajr, sunrise, dhuhr, asr, maghrib, isha } = city.baseTimes;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const prayersList = [
    { name: 'الفجر', nameEn: 'Fajr', time: fajr, mins: toMinutes(fajr) },
    { name: 'الشروق', nameEn: 'Sunrise', time: sunrise, mins: toMinutes(sunrise) },
    { name: 'الظهر', nameEn: 'Dhuhr', time: dhuhr, mins: toMinutes(dhuhr) },
    { name: 'العصر', nameEn: 'Asr', time: asr, mins: toMinutes(asr) },
    { name: 'المغرب', nameEn: 'Maghrib', time: maghrib, mins: toMinutes(maghrib) },
    { name: 'العشاء', nameEn: 'Isha', time: isha, mins: toMinutes(isha) },
  ];

  // Determine next prayer
  let next = prayersList.find((p) => p.mins > currentMinutes);
  let diffMinutes = 0;

  if (next) {
    diffMinutes = next.mins - currentMinutes;
  } else {
    // Tomorrow's Fajr
    next = prayersList[0];
    diffMinutes = 24 * 60 - currentMinutes + next.mins;
  }

  const hoursRemaining = Math.floor(diffMinutes / 60);
  const minutesRemaining = diffMinutes % 60;
  const timeRemaining = `${hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}${minutesRemaining}m`;

  return {
    city: city.nameAr,
    country: city.countryAr,
    fajr,
    sunrise,
    dhuhr,
    asr,
    maghrib,
    isha,
    nextPrayer: next.name,
    timeRemaining,
  };
}
