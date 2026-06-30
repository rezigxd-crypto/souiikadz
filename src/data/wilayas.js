/**
 * All 58 Algerian wilayas (provinces) with Arabic / French / English names.
 * Source: official Algerian administrative division (2021 reform added 10 new wilayas).
 *
 * Each entry: { code: number, ar, fr, en, tz (Tamazight Latin) }
 *
 * Used for:
 *   - Buyer filter ("filter by wilaya")
 *   - Farmer signup ("select your wilaya")
 *   - Product wilayaCode (where the product is grown)
 *   - Admin dashboard user location
 */

export const WILAYAS = [
  { code: 1,  ar: 'أدرار',          fr: 'Adrar',           en: 'Adrar',           tz: 'Adrar' },
  { code: 2,  ar: 'الشلف',          fr: 'Chlef',           en: 'Chlef',           tz: 'Chlef' },
  { code: 3,  ar: 'الأغواط',        fr: 'Laghouat',        en: 'Laghouat',        tz: 'Laghouat' },
  { code: 4,  ar: 'أم البواقي',     fr: 'Oum El Bouaghi',  en: 'Oum El Bouaghi',  tz: 'Oum El Bouaghi' },
  { code: 5,  ar: 'باتنة',          fr: 'Batna',           en: 'Batna',           tz: 'Batna' },
  { code: 6,  ar: 'بجاية',          fr: 'Béjaïa',          en: 'Béjaïa',          tz: 'Bgayet' },
  { code: 7,  ar: 'بسكرة',          fr: 'Biskra',          en: 'Biskra',          tz: 'Biskra' },
  { code: 8,  ar: 'بشار',           fr: 'Béchar',          en: 'Béchar',          tz: 'Béchar' },
  { code: 9,  ar: 'البليدة',        fr: 'Blida',           en: 'Blida',           tz: 'Bleyḍa' },
  { code: 10, ar: 'البويرة',        fr: 'Bouira',          en: 'Bouira',          tz: 'Bouira' },
  { code: 11, ar: 'تمنراست',        fr: 'Tamanrasset',     en: 'Tamanrasset',     tz: 'Tamanrasset' },
  { code: 12, ar: 'تبسة',           fr: 'Tébessa',         en: 'Tébessa',         tz: 'Tébessa' },
  { code: 13, ar: 'تلمسان',         fr: 'Tlemcen',         en: 'Tlemcen',         tz: 'Tlemcen' },
  { code: 14, ar: 'تيارت',          fr: 'Tiaret',          en: 'Tiaret',          tz: 'Tiaret' },
  { code: 15, ar: 'تيزي وزو',       fr: 'Tizi Ouzou',      en: 'Tizi Ouzou',      tz: 'Tizi Wezzu' },
  { code: 16, ar: 'الجزائر العاصمة', fr: 'Alger',           en: 'Algiers',         tz: 'Lezzayer' },
  { code: 17, ar: 'الجلفة',         fr: 'Djelfa',          en: 'Djelfa',          tz: 'Djelfa' },
  { code: 18, ar: 'جيجل',           fr: 'Jijel',           en: 'Jijel',           tz: 'Jijel' },
  { code: 19, ar: 'سطيف',           fr: 'Sétif',           en: 'Sétif',           tz: 'Setif' },
  { code: 20, ar: 'سعيدة',          fr: 'Saïda',           en: 'Saïda',           tz: 'Saïda' },
  { code: 21, ar: 'سكيكدة',         fr: 'Skikda',          en: 'Skikda',          tz: 'Skikda' },
  { code: 22, ar: 'سيدي بلعباس',    fr: 'Sidi Bel Abbès',  en: 'Sidi Bel Abbès',  tz: 'Sidi Bel Abbès' },
  { code: 23, ar: 'عنابة',          fr: 'Annaba',          en: 'Annaba',          tz: 'Ɛenaba' },
  { code: 24, ar: 'قالمة',          fr: 'Guelma',          en: 'Guelma',          tz: 'Guelma' },
  { code: 25, ar: 'قسنطينة',        fr: 'Constantine',     en: 'Constantine',     tz: 'Qsenṭina' },
  { code: 26, ar: 'المدية',         fr: 'Médéa',           en: 'Médéa',           tz: 'Médéa' },
  { code: 27, ar: 'مستغانم',        fr: 'Mostaganem',      en: 'Mostaganem',      tz: 'Mostaganem' },
  { code: 28, ar: 'المسيلة',        fr: "M'Sila",          en: "M'Sila",          tz: "M'Sila" },
  { code: 29, ar: 'معسكر',          fr: 'Mascara',         en: 'Mascara',         tz: 'Mascara' },
  { code: 30, ar: 'ورقلة',          fr: 'Ouargla',         en: 'Ouargla',         tz: 'Ouargla' },
  { code: 31, ar: 'وهران',          fr: 'Oran',            en: 'Oran',            tz: 'Wehran' },
  { code: 32, ar: 'البيض',          fr: 'El Bayadh',       en: 'El Bayadh',       tz: 'El Bayadh' },
  { code: 33, ar: 'إليزي',          fr: 'Illizi',          en: 'Illizi',          tz: 'Illizi' },
  { code: 34, ar: 'برج بوعريريج',   fr: 'Bordj Bou Arréridj', en: 'Bordj Bou Arréridj', tz: 'Bordj Bou Arréridj' },
  { code: 35, ar: 'بومرداس',        fr: 'Boumerdès',       en: 'Boumerdès',       tz: 'Boumerdès' },
  { code: 36, ar: 'الطارف',         fr: 'El Tarf',         en: 'El Tarf',         tz: 'El Tarf' },
  { code: 37, ar: 'تندوف',          fr: 'Tindouf',         en: 'Tindouf',         tz: 'Tindouf' },
  { code: 38, ar: 'تيسمسيلت',       fr: 'Tissemsilt',      en: 'Tissemsilt',      tz: 'Tissemsilt' },
  { code: 39, ar: 'الوادي',         fr: 'El Oued',         en: 'El Oued',         tz: 'El Oued' },
  { code: 40, ar: 'خنشلة',          fr: 'Khenchela',       en: 'Khenchela',       tz: 'Khenchela' },
  { code: 41, ar: 'سوق أهراس',      fr: 'Souk Ahras',      en: 'Souk Ahras',      tz: 'Souk Ahras' },
  { code: 42, ar: 'تيبازة',         fr: 'Tipaza',          en: 'Tipaza',          tz: 'Tipaza' },
  { code: 43, ar: 'ميلة',           fr: 'Mila',            en: 'Mila',            tz: 'Mila' },
  { code: 44, ar: 'عين الدفلى',     fr: 'Aïn Defla',       en: 'Aïn Defla',       tz: 'Aïn Defla' },
  { code: 45, ar: 'النعامة',        fr: 'Naâma',           en: 'Naâma',           tz: 'Naâma' },
  { code: 46, ar: 'عين تموشنت',     fr: 'Aïn Témouchent',  en: 'Aïn Témouchent',  tz: 'Aïn Témouchent' },
  { code: 47, ar: 'غرداية',         fr: 'Ghardaïa',        en: 'Ghardaïa',        tz: 'Ghardaïa' },
  { code: 48, ar: 'غليزان',         fr: 'Relizane',        en: 'Relizane',        tz: 'Relizane' },
  // ─── 2019 reform — new wilayas (codes 49-58) ────────────────────────────
  { code: 49, ar: 'تيميمون',        fr: 'Timimoun',        en: 'Timimoun',        tz: 'Timimoun' },
  { code: 50, ar: 'برج باجي مختار', fr: 'Bordj Badji Mokhtar', en: 'Bordj Badji Mokhtar', tz: 'Bordj Badji Mokhtar' },
  { code: 51, ar: 'أولاد جلال',     fr: 'Ouled Djellal',   en: 'Ouled Djellal',   tz: 'Ouled Djellal' },
  { code: 52, ar: 'بني عباس',       fr: 'Béni Abbès',      en: 'Béni Abbès',      tz: 'Béni Abbès' },
  { code: 53, ar: 'عين صالح',       fr: 'In Salah',        en: 'In Salah',        tz: 'In Salah' },
  { code: 54, ar: 'عين قزام',       fr: 'In Guezzam',      en: 'In Guezzam',      tz: 'In Guezzam' },
  { code: 55, ar: 'تقرت',           fr: 'Touggourt',       en: 'Touggourt',       tz: 'Touggourt' },
  { code: 56, ar: 'جانت',           fr: 'Djanet',          en: 'Djanet',          tz: 'Djanet' },
  { code: 57, ar: 'المغير',         fr: 'El M\'Ghair',      en: 'El M\'Ghair',      tz: 'El M\'Ghair' },
  { code: 58, ar: 'المنيعة',        fr: 'El Meniaa',       en: 'El Meniaa',       tz: 'El Meniaa' },
]

// Helper: get the localized name of a wilaya by code
export function wilayaName(code, lang = 'ar') {
  const w = WILAYAS.find((x) => x.code === code)
  return w ? w[lang] || w.ar : ''
}

// Helper: dropdown options for Select
export function wilayaOptions(lang = 'ar') {
  return WILAYAS.map((w) => ({
    value: w.code,
    label: `${w.code.toString().padStart(2, '0')} — ${w[lang] || w.ar}`,
  }))
}
