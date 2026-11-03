import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_SURAHS, RECITERS, getAudioUrl } from './quranData';
import { formatAudioTime, getNextSurahNumber, getPreviousSurahNumber, getNextRepeatMode, calculateKhatmaProgress } from './audioEngine';
import { getPrayerTimesForCity, SUPPORTED_CITIES } from './prayerTimes';

test('Surahs library has all 114 Surahs', () => {
  assert.equal(ALL_SURAHS.length, 114);
  assert.equal(ALL_SURAHS[0].nameAr, 'الفاتحة');
  assert.equal(ALL_SURAHS[0].versesCount, 7);
  assert.equal(ALL_SURAHS[113].nameAr, 'الناس');
  assert.equal(ALL_SURAHS[113].versesCount, 6);
});

test('Reciters library has featured reciters with proper metadata', () => {
  assert.ok(RECITERS.length >= 10);
  const dosari = RECITERS.find((r) => r.id === 'yasser_dosari');
  assert.ok(dosari);
  assert.equal(dosari.nameAr, 'الشيخ ياسر الدوسري');
  assert.ok(dosari.serverUrl.startsWith('http'));
});

test('getAudioUrl produces zero-padded 3-digit URLs', () => {
  const dosari = RECITERS.find((r) => r.id === 'yasser_dosari')!;
  const urlFatihah = getAudioUrl(dosari, 1);
  assert.equal(urlFatihah, 'https://server11.mp3quran.net/yasser/001.mp3');

  const urlKahf = getAudioUrl(dosari, 18);
  assert.equal(urlKahf, 'https://server11.mp3quran.net/yasser/018.mp3');

  const urlNas = getAudioUrl(dosari, 114);
  assert.equal(urlNas, 'https://server11.mp3quran.net/yasser/114.mp3');
});

test('formatAudioTime formats seconds into mm:ss and hh:mm:ss', () => {
  assert.equal(formatAudioTime(0), '00:00');
  assert.equal(formatAudioTime(84), '01:24');
  assert.equal(formatAudioTime(432), '07:12');
  assert.equal(formatAudioTime(3665), '1:01:05');
  assert.equal(formatAudioTime(-5), '00:00');
});

test('Audio queue calculates next and previous Surahs correctly', () => {
  assert.equal(getNextSurahNumber(1, 114, false, 'none'), 2);
  assert.equal(getPreviousSurahNumber(2, 114), 1);
  assert.equal(getPreviousSurahNumber(1, 114), 114);
  // Loop one mode
  assert.equal(getNextSurahNumber(5, 114, false, 'one'), 5);
  // Loop all mode at end
  assert.equal(getNextSurahNumber(114, 114, false, 'all'), 1);
  assert.equal(getNextSurahNumber(114, 114, false, 'none'), 114);
});

test('Repeat mode transitions properly', () => {
  assert.equal(getNextRepeatMode('none'), 'all');
  assert.equal(getNextRepeatMode('all'), 'one');
  assert.equal(getNextRepeatMode('one'), 'none');
});

test('Khatma progress calculations', () => {
  const half = calculateKhatmaProgress(15, 30);
  assert.equal(half.percentage, 50);
  assert.equal(half.remainingJuz, 15);

  const complete = calculateKhatmaProgress(30, 30);
  assert.equal(complete.percentage, 100);
  assert.equal(complete.remainingJuz, 0);
});

test('Prayer times for city return expected prayer names and times', () => {
  const fixedDate = new Date('2026-11-03T10:00:00');
  const rabatTimes = getPrayerTimesForCity('rabat', fixedDate);
  assert.equal(rabatTimes.city, 'الرباط');
  assert.equal(rabatTimes.fajr, '05:45');
  assert.equal(rabatTimes.dhuhr, '12:34');
  assert.equal(rabatTimes.nextPrayer, 'الظهر');
});
