// ═══════════════════════════════════════════════════════════════════════════
// Suwaika Dezad — Seed data
// All images use Unsplash (consistent with original) for demo purposes.
// When you connect a backend, replace these with API calls.
//
// Each product carries a `t` field with localized strings for:
//   name, description, seller, location, category, badge, unit
// Supported languages: ar, fr, en, tz (Tamazight)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Categories ────────────────────────────────────────────────────────────
// `ar` value is also used as the canonical category string on each product
// (so filtering still works in any language).
export const CATEGORIES = [
  { key: 'common.all',     ar: 'الكل' },
  { key: 'cat.vegetables', ar: 'خضروات' },
  { key: 'cat.fruits',     ar: 'فواكه' },
  { key: 'cat.dates',      ar: 'تمور' },
  { key: 'cat.bakery',     ar: 'مخبوزات' },
  { key: 'cat.meat',       ar: 'لحوم' },
  { key: 'cat.dairy',      ar: 'ألبان' },
  { key: 'cat.pickles',    ar: 'مخللات' },
  { key: 'cat.natural',    ar: 'منتجات طبيعية' },
  { key: 'cat.grains',     ar: 'حبوب' },
  { key: 'cat.dates',      ar: 'تمور' },
]

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.ar)

// ─── Products ──────────────────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: 1,
    deliveryAvailable: true,
    wilayaCode: 16,
    price: 45,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&h=380&fit=crop',
    distance: 1.2,
    expiry: 48,
    rating: 4.8,
    reviews: 124,
    stock: 50,
    sellerType: 'farmer',
    t: {
      ar: { name: 'طماطم عضوية طازجة', seller: 'مزرعة الخضراء',     location: 'الجزائر العاصمة', category: 'خضروات',         unit: 'كغ',   badge: 'عرض محدود',  description: 'طماطم عضوية طازجة من أفضل المزارع المحلية، غنية بالفيتامينات والمعادن، مثالية للطبخ والسلطات.' },
      fr: { name: 'Tomates bio fraîches', seller: 'Ferme El Khadra',  location: 'Alger',           category: 'Légumes',         unit: 'kg',   badge: 'Offre limitée', description: 'Tomates bio fraîches des meilleures fermes locales, riches en vitamines et minéraux, idéales pour la cuisine et les salades.' },
      en: { name: 'Fresh organic tomatoes', seller: 'Green Farm',     location: 'Algiers',         category: 'Vegetables',      unit: 'kg',   badge: 'Limited offer', description: 'Fresh organic tomatoes from the best local farms, rich in vitamins and minerals, perfect for cooking and salads.' },
      tz: { name: 'Tumatik n tneflin timaynutin', seller: 'Akerdu n Teẓḍert', location: 'Lezzayer Tamanaɣt', category: 'Tiẓedin', unit: 'kg', badge: 'Tafedniwt s talast', description: 'Tumatik n tneflin timaynutin seg yigerdan yifen, s tɣara n tvitaminin d yimɣuzen, tifawin i usegrew d tsebtin.' },
    },
  },
  {
    id: 2,
    deliveryAvailable: true,
    wilayaCode: 31,
    price: 120,
    discount: 60,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=380&fit=crop',
    distance: 0.8,
    expiry: 12,
    rating: 4.9,
    reviews: 89,
    stock: 30,
    sellerType: 'bakery',
    t: {
      ar: { name: 'خبز بلدي تقليدي', seller: 'مخبزة الأصالة',     location: 'وهران',       category: 'مخبوزات',       unit: 'كيس', badge: 'ينتهي قريباً', description: 'خبز بلدي أصيل مخبوز يومياً بالطريقة التقليدية الجزائرية، طازج ولذيذ.' },
      fr: { name: 'Pain traditionnel', seller: 'Boulangerie Al Asala', location: 'Oran',     category: 'Boulangerie',  unit: 'sac', badge: 'Expire bientôt', description: 'Pain traditionnel algérien cuit quotidiennement selon la méthode ancestrale, frais et savoureux.' },
      en: { name: 'Traditional bread', seller: 'Al Asala Bakery',  location: 'Oran',        category: 'Bakery',       unit: 'bag', badge: 'Expiring soon', description: 'Authentic traditional Algerian bread baked daily using ancestral methods, fresh and delicious.' },
      tz: { name: 'Aḍrum aqbur', seller: 'Taqendurt n Lεesla',     location: 'Wahran',      category: 'Aḍrum',        unit: 'sakku', badge: 'Ad ifak dɣa', description: 'Aḍrum aqbur n Lezzayer yettwaḥemmel yal ass s tarrayt n zik, amaynut d uẓidan.' },
    },
  },
  {
    id: 3,
    deliveryAvailable: false,
    wilayaCode: 25,
    price: 850,
    discount: 680,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&h=380&fit=crop',
    distance: 5.3,
    expiry: 720,
    rating: 5.0,
    reviews: 210,
    stock: 15,
    sellerType: 'farmer',
    t: {
      ar: { name: 'عسل جبلي طبيعي', seller: 'منحل الأطلس',         location: 'قسنطينة',     category: 'منتجات طبيعية', unit: 'كغ',  badge: 'الأكثر مبيعاً', description: 'عسل جبلي خالص 100% من مناطق الأطلس الجزائري، معالج يدوياً بدون إضافات.' },
      fr: { name: 'Miel de montagne naturel', seller: 'Rucher de l\'Atlas', location: 'Constantine', category: 'Produits naturels', unit: 'kg', badge: 'Best-seller', description: 'Miel de montagne pur à 100% des régions de l\'Atlas algérien, traité à la main sans additifs.' },
      en: { name: 'Natural mountain honey', seller: 'Atlas Apiary', location: 'Constantine', category: 'Natural Products', unit: 'kg', badge: 'Best seller', description: 'Pure 100% mountain honey from the Algerian Atlas regions, hand-processed without additives.' },
      tz: { name: 'Tifint n idurar n tagant', seller: 'Aniḍ n Waṭlas', location: 'Qsenṭina', category: 'Ifarisen n tagant', unit: 'kg', badge: 'D aɣurar yifen', description: 'Tifint n idurar d tilellit 100% seg temnaḍin n Waṭlas n Lezzayer, yettwaxdem s ufus war lmerni.' },
    },
  },
  {
    id: 4,
    deliveryAvailable: true,
    wilayaCode: 15,
    price: 200,
    discount: 120,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=380&fit=crop',
    distance: 3.1,
    expiry: 168,
    rating: 4.7,
    reviews: 67,
    stock: 80,
    sellerType: 'farmer',
    t: {
      ar: { name: 'زيتون أخضر مخلل', seller: 'بستان الزيتون',     location: 'تيزي وزو',     category: 'مخللات',        unit: 'كغ',  badge: '',            description: 'زيتون أخضر طبيعي مخلل بالطريقة الأمازيغية التقليدية، حار ولذيذ.' },
      fr: { name: 'Olives vertes marinées', seller: 'Verger d\'Olives', location: 'Tizi Ouzou', category: 'Conserves',    unit: 'kg',  badge: '',            description: 'Olives vertes naturelles marinées à la manière amazighe traditionnelle, épicées et savoureuses.' },
      en: { name: 'Pickled green olives', seller: 'Olive Grove',   location: 'Tizi Ouzou',  category: 'Pickles',       unit: 'kg',  badge: '',            description: 'Natural green olives pickled in the traditional Amazigh way, spicy and delicious.' },
      tz: { name: 'Tazart n tneflin tameqqrant', seller: 'Aɣrum n Tazart', location: 'Tizi Wezzu', category: 'Tisertiyin', unit: 'kg', badge: '', description: 'Tazart n tneflin tameqqrant yettwaḥerzen s tarrayt taqayurt n zik, d tameqqrant d teẓḍert.' },
    },
  },
  {
    id: 5,
    deliveryAvailable: true,
    wilayaCode: 9,
    price: 80,
    discount: 45,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=380&fit=crop',
    distance: 2.4,
    expiry: 96,
    rating: 4.6,
    reviews: 153,
    stock: 120,
    sellerType: 'farmer',
    t: {
      ar: { name: 'تفاح أحمر طازج', seller: 'بستان الفاكهة',       location: 'البليدة',      category: 'فواكه',         unit: 'كغ',  badge: 'جديد',        description: 'تفاح أحمر طازج من أحسن بساتين البليدة، حلو وعصري.' },
      fr: { name: 'Pommes rouges fraîches', seller: 'Verger de Fruits', location: 'Blida',   category: 'Fruits',       unit: 'kg',  badge: 'Nouveau',     description: 'Pommes rouges fraîches des meilleurs vergers de Blida, douces et juteuses.' },
      en: { name: 'Fresh red apples', seller: 'Fruit Orchard',     location: 'Blida',       category: 'Fruits',       unit: 'kg',  badge: 'New',         description: 'Fresh red apples from the finest orchards of Blida, sweet and juicy.' },
      tz: { name: 'Tiflihin timeqranin timaynutin', seller: 'Aɣrum n Tiflihin', location: 'Bleyḍa', category: 'Tiflihin', unit: 'kg', badge: 'Amaynut', description: 'Tiflihin timeqranin timaynutin seg yigerdan yifen n Bleyḍa, d tiẓidanin d ticeddanin.' },
    },
  },
  {
    id: 6,
    deliveryAvailable: false,
    wilayaCode: 19,
    price: 450,
    discount: 320,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=380&fit=crop',
    distance: 1.8,
    expiry: 24,
    rating: 4.9,
    reviews: 98,
    stock: 25,
    sellerType: 'farmer',
    t: {
      ar: { name: 'دجاج بلدي طازج', seller: 'مزرعة الدواجن',       location: 'سطيف',        category: 'لحوم',          unit: 'وحدة', badge: 'ينتهي قريباً', description: 'دجاج بلدي مرباه طبيعياً بدون هرمونات، طازج ومضمون الجودة.' },
      fr: { name: 'Poulet fermier frais', seller: 'Ferme Avicole',  location: 'Sétif',      category: 'Viandes',      unit: 'pièce', badge: 'Expire bientôt', description: 'Poulet fermier élevé naturellement sans hormones, frais et de qualité garantie.' },
      en: { name: 'Fresh free-range chicken', seller: 'Poultry Farm', location: 'Sétif',    category: 'Meat',         unit: 'unit', badge: 'Expiring soon', description: 'Free-range chicken raised naturally without hormones, fresh and quality-guaranteed.' },
      tz: { name: 'Adjadj n uğerbaz amaynut', seller: 'Akerdu n Yijjajen', location: 'Setif', category: 'Tifunasin', unit: 'tawin', badge: 'Ad ifak dɣa', description: 'Adjadj n uğerbaz yettwaremn s tagant war lahramunat, amaynut d tɣara yettwamanen.' },
    },
  },
  {
    id: 7,
    deliveryAvailable: true,
    wilayaCode: 23,
    price: 90,
    discount: 65,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=380&fit=crop',
    distance: 4.2,
    expiry: 36,
    rating: 4.8,
    reviews: 176,
    stock: 60,
    sellerType: 'farmer',
    t: {
      ar: { name: 'حليب بقري طازج', seller: 'مزرعة الحليب',       location: 'عنابة',       category: 'ألبان',         unit: 'لتر',  badge: '',           description: 'حليب بقري طازج مباشرة من المزرعة، غني بالكالسيوم والبروتين.' },
      fr: { name: 'Lait de vache frais', seller: 'Ferme Laitière', location: 'Annaba',     category: 'Produits laitiers', unit: 'litre', badge: '', description: 'Lait de vache frais directement de la ferme, riche en calcium et protéines.' },
      en: { name: 'Fresh cow milk', seller: 'Dairy Farm',          location: 'Annaba',     category: 'Dairy',         unit: 'liter', badge: '',           description: 'Fresh cow milk straight from the farm, rich in calcium and protein.' },
      tz: { name: 'Aklellay n tfunast amaynut', seller: 'Akerdu n Uklellay', location: 'Ɛenaba', category: 'Ifassen', unit: 'litr', badge: '', description: 'Aklellay n tfunast amaynut seg ukerdu, d aɛric s ukalsyum d uprutin.' },
    },
  },
  {
    id: 8,
    deliveryAvailable: true,
    wilayaCode: 7,
    price: 180,
    discount: 130,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=380&fit=crop',
    distance: 6.7,
    expiry: 2160,
    rating: 4.7,
    reviews: 241,
    stock: 200,
    sellerType: 'supplier',
    t: {
      ar: { name: 'كسكس تقليدي', seller: 'منتجات الجنوب',         location: 'بسكرة',       category: 'حبوب',          unit: 'كغ',   badge: 'الأفضل تقييماً', description: 'كسكس بلدي تقليدي من قمح صلب، مُعد يدوياً حسب الطريقة الأصيلة.' },
      fr: { name: 'Couscous traditionnel', seller: 'Produits du Sud', location: 'Biskra',  category: 'Céréales',      unit: 'kg',   badge: 'Mieux noté',  description: 'Couscous traditionnel algérien à base de blé dur, préparé à la main selon la méthode authentique.' },
      en: { name: 'Traditional couscous', seller: 'Southern Products', location: 'Biskra', category: 'Grains',       unit: 'kg',   badge: 'Top rated',   description: 'Traditional Algerian couscous made from durum wheat, hand-prepared using authentic methods.' },
      tz: { name: 'Seksu aqbur', seller: 'Ifarisen n Wenẓul',     location: 'Biskra',     category: 'Iɣan',          unit: 'kg',   badge: 'Yettwazmel yifen', description: 'Seksu aqbur n Lezzayer seg yiberkan iǧehdien, yettwaxdem s ufus s tarrayt n zik.' },
    },
  },
  // ─── Algerian desert dates (تمور) — Algeria is famous for these ──────────
  {
    id: 9,
    farmerEmail: 'farmer@sk.dz',
    postedAt: Date.now() - 6 * 3600_000,
    deliveryAvailable: true,
    wilayaCode: 7, // Biskra
    price: 600,
    discount: 450,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500&h=380&fit=crop',
    distance: 5.0,
    expiry: 2160,
    rating: 5.0,
    reviews: 312,
    stock: 80,
    sellerType: 'farmer',
    isDate: true,
    t: {
      ar: { name: 'تمر دڨلة نور الفاخر', seller: 'واحة سيدي عمر', location: 'بسكرة', category: 'تمور', unit: 'كغ', badge: 'الأكثر مبيعاً', description: 'تمر دڨلة نور الفاخر من واحات بسكرة، حلو وطري، يُقطف يدوياً في موسم الجني. من أفضل أنواع التمور الجزائرية.' },
      fr: { name: 'Dattes Deglet Nour premium', seller: 'Oasis Sidi Omar', location: 'Biskra', category: 'Dattes', unit: 'kg', badge: 'Best-seller', description: 'Dattes Deglet Nour premium des oasis de Biskra, douces et tendres, cueillies à la main en saison. Parmi les meilleures dattes algériennes.' },
      en: { name: 'Premium Deglet Nour dates', seller: 'Sidi Omar Oasis', location: 'Biskra', category: 'Dates', unit: 'kg', badge: 'Best seller', description: 'Premium Deglet Nour dates from the Biskra oases, sweet and tender, hand-picked in season. Among the finest Algerian dates.' },
      tz: { name: 'Tifeywin Deglet Nour', seller: 'Taxart n Sidi Ɛumar', location: 'Biskra', category: 'Tifeywin', unit: 'kg', badge: 'D aɣurar yifen', description: 'Tifeywin Deglet Nour seg txardin n Biskra, d tiẓidanin d teẓḍanin, yettwakerḍent s ufus deg tewsit.' },
    },
  },
  {
    id: 10,
    farmerEmail: 'farmer@sk.dz',
    postedAt: Date.now() - 12 * 3600_000,
    deliveryAvailable: true,
    wilayaCode: 39, // El Oued
    price: 800,
    discount: 650,
    image: 'https://images.unsplash.com/photo-1510130207-0361e7d1f9a6?w=500&h=380&fit=crop',
    distance: 6.5,
    expiry: 2160,
    rating: 4.9,
    reviews: 187,
    stock: 50,
    sellerType: 'farmer',
    isDate: true,
    t: {
      ar: { name: 'تمر غرس', seller: 'واحة الوادي', location: 'الوادي', category: 'تمور', unit: 'كغ', badge: 'جديد', description: 'تمر غرس من واحات الوادي، يُعرف بقشرته الرقيقة وحلاوته المركزة. مثالي للضيافة والمناسبات.' },
      fr: { name: 'Dattes Ghars', seller: 'Oasis El Oued', location: 'El Oued', category: 'Dattes', unit: 'kg', badge: 'Nouveau', description: 'Dattes Ghars des oasis d\'El Oued, connues pour leur peau fine et leur douceur concentrée. Idéales pour l\'hospitalité.' },
      en: { name: 'Ghars dates', seller: 'El Oued Oasis', location: 'El Oued', category: 'Dates', unit: 'kg', badge: 'New', description: 'Ghars dates from the El Oued oases, known for thin skin and concentrated sweetness. Perfect for hospitality.' },
      tz: { name: 'Tifeywin Ghars', seller: 'Taxart n Wehdi', location: 'Lweḥi', category: 'Tifeywin', unit: 'kg', badge: 'Amaynut', description: 'Tifeywin Ghars seg txardin n Lweḥi, ttwaɣent s teɣzut-nsent tenḍift d teẓidanin-nsent tiɣlayin.' },
    },
  },
  {
    id: 11,
    farmerEmail: 'farmer@sk.dz',
    postedAt: Date.now() - 24 * 3600_000,
    deliveryAvailable: false,
    wilayaCode: 11, // Tamanrasset
    price: 1200,
    discount: 950,
    image: 'https://images.unsplash.com/photo-1596707324227-6d3b0a3c8e3a?w=500&h=380&fit=crop',
    distance: 12.0,
    expiry: 2160,
    rating: 5.0,
    reviews: 95,
    stock: 25,
    sellerType: 'farmer',
    isDate: true,
    t: {
      ar: { name: 'تمر تمنراست الأصلي', seller: 'واحة الأہقار', location: 'تمنراست', category: 'تمور', unit: 'كغ', badge: 'الأفضل تقييماً', description: 'تمر نادر من جبال الأہقار في أقصى الجنوب الجزائري، طعمه فريد وقيمته الغذائية عالية. كنز صحراوي حقيقي.' },
      fr: { name: 'Dattes de Tamanrasset', seller: 'Oasis Ahaggar', location: 'Tamanrasset', category: 'Dattes', unit: 'kg', badge: 'Mieux noté', description: 'Dattes rares des monts Ahaggar dans l\'extrême sud algérien, goût unique et grande valeur nutritionnelle.' },
      en: { name: 'Tamanrasset rare dates', seller: 'Ahaggar Oasis', location: 'Tamanrasset', category: 'Dates', unit: 'kg', badge: 'Top rated', description: 'Rare dates from the Ahaggar mountains in far southern Algeria, unique taste and high nutritional value.' },
      tz: { name: 'Tifeywin n Tamanrasset', seller: 'Taxart n Uhaggar', location: 'Tamanrasset', category: 'Tifeywin', unit: 'kg', badge: 'Yettwazmel yifen', description: 'Tifeywin timeqranin seg idurar n Uhaggar deg unẓul aɛezyan n Lezzayer, d teẓidanin yifen.' },
    },
  },
]

// ─── Helper: pick the right translation for a product field ────────────────
// Usage: pt(product, lang, 'name')  → returns the localized name
//        pt(product, lang)          → returns the whole {name, description, ...} object
export function pt(product, lang = 'ar', field = null) {
  const langs = [lang, 'ar', 'en'] // fallback chain
  for (const l of langs) {
    if (product.t?.[l]) {
      return field ? product.t[l][field] : product.t[l]
    }
  }
  return field ? '' : {}
}

// ─── Stats ─────────────────────────────────────────────────────────────────
export const STATS = [
  { value: '12,450', labelKey: 'home.statFoodSaved',  iconKey: 'Leaf' },
  { value: '3,200+', labelKey: 'home.statFarmers',    iconKey: 'Tractor' },
  { value: '48,000', labelKey: 'home.statUsers',      iconKey: 'Users' },
  { value: '95%',    labelKey: 'home.statSatisfaction', iconKey: 'Star' },
]

// ─── Notifications ─────────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS = [
  { id: 1, textKey: 'notif.newOfferTomato',   time: 'منذ 5 دقائق', read: false, iconKey: 'Tag' },
  { id: 2, textKey: 'notif.orderConfirmed',   time: 'منذ ساعة',    read: false, iconKey: 'CheckCircle2' },
  { id: 3, textKey: 'notif.breadAvailable',   time: 'منذ 2 ساعة',  read: true,  iconKey: 'Wheat' },
  { id: 4, textKey: 'notif.honeyLastUnits',   time: 'منذ 3 ساعات', read: true,  iconKey: 'Droplet' },
]

export const NOTIF_TEXTS = {
  ar: {
    'notif.newOfferTomato':  'عرض جديد: طماطم عضوية بخصم 60%',
    'notif.orderConfirmed':  'تم تأكيد طلبك #2847',
    'notif.breadAvailable':  'خبز طازج متاح الآن في وهران',
    'notif.honeyLastUnits':  'عسل جبلي: آخر 5 وحدات!',
  },
  fr: {
    'notif.newOfferTomato':  'Nouvelle offre : tomates bio -60%',
    'notif.orderConfirmed':  'Commande #2847 confirmée',
    'notif.breadAvailable':  'Pain frais disponible à Oran',
    'notif.honeyLastUnits':  'Miel de montagne : 5 dernières unités !',
  },
  en: {
    'notif.newOfferTomato':  'New offer: organic tomatoes -60%',
    'notif.orderConfirmed':  'Order #2847 confirmed',
    'notif.breadAvailable':  'Fresh bread available in Oran',
    'notif.honeyLastUnits':  'Mountain honey: last 5 units!',
  },
  tz: {
    'notif.newOfferTomato':  'Tafedniwt tamaynut: tumatik n tneflin -60%',
    'notif.orderConfirmed':  'Taladna #2847 tettwasentem',
    'notif.breadAvailable':  'Aḍrum amaynut yella di Wahran',
    'notif.honeyLastUnits':  'Tifint n idurar: 5 n tɣawasin tineggura!',
  },
}

// ─── Team ──────────────────────────────────────────────────────────────────
export const TEAM = [
  { name: 'يوسرى برماق',    roleKey: 'team.ceo',        initials: 'ي.ب', color: '#1a6b3a' },
]

export const TEAM_ROLES = {
  ar: {
    'team.ceo':        'المؤسسة والمالكة الوحيدة',
  },
  fr: {
    'team.ceo':        'Fondatrice & Propriétaire unique',
  },
  en: {
    'team.ceo':        'Founder & Sole Owner',
  },
  tz: {
    'team.ceo':        'Tamedyazt d Tabbirt n tkebbanit',
  },
}

// ─── Sample Orders (Dashboard) ─────────────────────────────────────────────
export const SAMPLE_ORDERS = [
  { id: '#4821', productKey: 'p.tomato',  customer: 'أحمد بن علي',  qtyKey: '5kg', totalKey: '90dz',  status: 'completed',  dateKey: 'date.today' },
  { id: '#4820', productKey: 'p.olive',   customer: 'فاطمة مقدم',   qtyKey: '2kg', totalKey: '240dz', status: 'delivering', dateKey: 'date.today' },
  { id: '#4819', productKey: 'p.honey',   customer: 'كريم بلقاسم',  qtyKey: '1kg', totalKey: '680dz', status: 'processing', dateKey: 'date.yesterday' },
  { id: '#4818', productKey: 'p.apple',   customer: 'نور الهدى',    qtyKey: '3kg', totalKey: '135dz', status: 'completed',  dateKey: 'date.yesterday' },
]

export const ORDER_LABELS = {
  ar: {
    'p.tomato': 'طماطم عضوية', 'p.olive': 'زيتون مخلل', 'p.honey': 'عسل جبلي', 'p.apple': 'تفاح أحمر',
    'date.today': 'اليوم', 'date.yesterday': 'أمس',
  },
  fr: {
    'p.tomato': 'Tomates bio', 'p.olive': 'Olives marinés', 'p.honey': 'Miel de montagne', 'p.apple': 'Pommes rouges',
    'date.today': "Aujourd'hui", 'date.yesterday': 'Hier',
  },
  en: {
    'p.tomato': 'Organic tomatoes', 'p.olive': 'Pickled olives', 'p.honey': 'Mountain honey', 'p.apple': 'Red apples',
    'date.today': 'Today', 'date.yesterday': 'Yesterday',
  },
  tz: {
    'p.tomato': 'Tumatik n tneflin', 'p.olive': 'Tazart', 'p.honey': 'Tifint', 'p.apple': 'Tiflihin',
    'date.today': 'Ass-a', 'date.yesterday': 'Iḍelli',
  },
}

// Sample order qty & total strings (translated)
export const ORDER_QTY_TOTAL = {
  ar: { '5kg': '5 كغ', '2kg': '2 كغ', '1kg': '1 كغ', '3kg': '3 كغ', '90dz': '90 دج', '240dz': '240 دج', '680dz': '680 دج', '135dz': '135 دج' },
  fr: { '5kg': '5 kg', '2kg': '2 kg', '1kg': '1 kg', '3kg': '3 kg', '90dz': '90 DA', '240dz': '240 DA', '680dz': '680 DA', '135dz': '135 DA' },
  en: { '5kg': '5 kg', '2kg': '2 kg', '1kg': '1 kg', '3kg': '3 kg', '90dz': '90 DZD', '240dz': '240 DZD', '680dz': '680 DZD', '135dz': '135 DZD' },
  tz: { '5kg': '5 kg', '2kg': '2 kg', '1kg': '1 kg', '3kg': '3 kg', '90dz': '90 DA', '240dz': '240 DA', '680dz': '680 DA', '135dz': '135 DA' },
}

// ─── Brand collaborators (showcase section) ────────────────────────────────
// `empty: true` slots are invitation placeholders — they render as
// "Your Brand Here" cards so potential advertisers see the available space.
// Real brands use the iconKey + brandKey for localized names.
//
// iconKey: a Lucide icon component name (rendered via the ICONS map in the component).
// brandKey: i18n key for the brand name (see BRAND_NAMES below).
// taglineKey: i18n key for the brand's tagline (one short line).
// color: brand accent color for the card border / icon background.
// empty: if true, this slot is an invitation placeholder.
export const BRANDS = [
  { iconKey: 'Wheat',     brandKey: 'brand.cevital',     taglineKey: 'brand.cevitalTag',     color: '#1a6b3a', empty: false },
  { iconKey: 'Milk',      brandKey: 'brand.laiterie',    taglineKey: 'brand.laiterieTag',    color: '#3a7ab0', empty: false },
  { iconKey: 'Droplet',   brandKey: 'brand.bjora',       taglineKey: 'brand.bjoraTag',       color: '#c9a227', empty: false },
  { iconKey: 'Beef',      brandKey: 'brand.koutoubia',   taglineKey: 'brand.koutoubiaTag',   color: '#8a3a3a', empty: false },
  // ─── Empty invitation slots ───────────────────────────────────────────
  { empty: true },
  { empty: true },
  { empty: true },
  { empty: true },
]

// Localized brand names + taglines (random realistic Algerian/Maghreb food brands)
export const BRAND_NAMES = {
  ar: {
    'brand.cevital':       { name: 'سيفيتال',           tagline: 'عملاق الصناعات الغذائية الجزائرية' },
    'brand.laiterie':      { name: 'ألبان البليدة',      tagline: 'حليب طازج يومياً من قلب المزرعة' },
    'brand.bjora':         { name: 'بوجورة',             tagline: 'عصائر طبيعية 100% من بساتين الجزائر' },
    'brand.koutoubia':     { name: 'كوتوبيا',            tagline: 'لحوم ودواجن بجودة معتمدة' },
  },
  fr: {
    'brand.cevital':       { name: 'Cevital',            tagline: 'Géant de l\'agroalimentaire algérien' },
    'brand.laiterie':      { name: 'Laiterie de Blida',  tagline: 'Lait frais chaque jour, directement de la ferme' },
    'brand.bjora':         { name: 'Bjora',              tagline: 'Jus 100% naturels des vergers d\'Algérie' },
    'brand.koutoubia':     { name: 'Koutoubia',          tagline: 'Viandes et volailles de qualité certifiée' },
  },
  en: {
    'brand.cevital':       { name: 'Cevital',            tagline: 'Algerian food-industry giant' },
    'brand.laiterie':      { name: 'Blida Dairy',        tagline: 'Fresh milk daily, straight from the farm' },
    'brand.bjora':         { name: 'Bjora',              tagline: '100% natural juices from Algerian orchards' },
    'brand.koutoubia':     { name: 'Koutoubia',          tagline: 'Certified-quality meats & poultry' },
  },
  tz: {
    'brand.cevital':       { name: 'Cevital',            tagline: 'Ameqran n tsekkirt n učči n Lezzayer' },
    'brand.laiterie':      { name: 'Aklellay n Bleyḍa',  tagline: 'Aklellay amaynut yal ass seg ukerdu' },
    'brand.bjora':         { name: 'Bjora',              tagline: 'Asuf 100% n tagant seg yigerdan n Lezzayer' },
    'brand.koutoubia':     { name: 'Koutoubia',          tagline: 'Tifunasin d yijjajen s tɣara yettwamanen' },
  },
}
