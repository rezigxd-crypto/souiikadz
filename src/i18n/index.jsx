/**
 * Suwaika Dezad — Internationalization (i18n)
 *
 * Supported languages:
 *   ar  — Arabic (default, RTL)
 *   fr  — French (Algeria's second administrative language)
 *   en  — English
 *   tz  — Tamazight (Latin script / Tifinagh fallback)
 *
 * Lightweight: a tiny custom implementation (no external deps),
 * so we keep the bundle small and have full control. When the
 * project migrates to Firebase later, this layer stays unchanged.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// ═══════════════════════════════════════════════════════════════════════════
// Dictionary
// ═══════════════════════════════════════════════════════════════════════════

export const LANGUAGES = [
  { code: 'ar', label: 'العربية',     english: 'Arabic',     dir: 'rtl', flag: '🇩🇿' },
  { code: 'fr', label: 'Français',    english: 'French',     dir: 'ltr', flag: '🇫🇷' },
  { code: 'en', label: 'English',     english: 'English',    dir: 'ltr', flag: '🇬🇧' },
  { code: 'tz', label: 'Tamazight',   english: 'Tamazight',  dir: 'ltr', flag: '🇩🇿' },
]

const dict = {
  // ── Common ──────────────────────────────────────────────────────────────
  'common.brandName':       { ar: 'سويقة ديزاد',       fr: 'Suwaika Dezad',     en: 'Suwaika Dezad',     tz: 'Suwaika Dezad' },
  'common.brandSub':        { ar: 'بورصة الغذاء',      fr: 'Bourse alimentaire',en: 'Food Exchange',     tz: 'Tilin n učči' },
  'common.loading':         { ar: 'جارٍ التحميل...',    fr: 'Chargement...',     en: 'Loading...',        tz: 'Asali...' },
  'common.save':            { ar: 'حفظ',                fr: 'Enregistrer',       en: 'Save',              tz: 'Sekles' },
  'common.cancel':          { ar: 'إلغاء',              fr: 'Annuler',           en: 'Cancel',            tz: 'Sefsex' },
  'common.close':           { ar: 'إغلاق',              fr: 'Fermer',            en: 'Close',             tz: 'Mdel' },
  'common.back':            { ar: 'رجوع',               fr: 'Retour',            en: 'Back',              tz: 'Uɣal' },
  'common.search':          { ar: 'بحث',                fr: 'Rechercher',        en: 'Search',            tz: 'Nadi' },
  'common.filter':          { ar: 'فلتر',               fr: 'Filtrer',           en: 'Filter',            tz: 'Sizdeg' },
  'common.all':             { ar: 'الكل',               fr: 'Tous',              en: 'All',               tz: 'Akk' },
  'common.currency':        { ar: 'دج',                 fr: 'DA',                en: 'DZD',               tz: 'DA' },

  // ── Navbar ──────────────────────────────────────────────────────────────
  'nav.home':               { ar: 'الرئيسية',           fr: 'Accueil',           en: 'Home',              tz: 'Agejdan' },
  'nav.market':             { ar: 'السوق',              fr: 'Marché',            en: 'Market',            tz: 'Lḥal' },
  'nav.about':              { ar: 'عن المنصة',          fr: 'À propos',          en: 'About',             tz: 'Ɣef' },
  'nav.dashboard':          { ar: 'لوحة التحكم',        fr: 'Tableau de bord',   en: 'Dashboard',         tz: 'Tafelwit n usefrek' },
  'nav.cart':               { ar: 'السلة',              fr: 'Panier',            en: 'Cart',              tz: 'Taqecwalt' },
  'nav.notifications':      { ar: 'الإشعارات',          fr: 'Notifications',     en: 'Notifications',     tz: 'Ilɣa' },
  'nav.account':            { ar: 'الحساب',             fr: 'Compte',            en: 'Account',           tz: 'Amiḍan' },
  'nav.menu':               { ar: 'القائمة',            fr: 'Menu',              en: 'Menu',              tz: 'Umuɣ' },
  'nav.markAllRead':        { ar: 'تعليم الكل كمقروء',  fr: 'Tout marquer comme lu', en: 'Mark all as read', tz: 'Creḍ akk d yɣran' },

  // ── Home ────────────────────────────────────────────────────────────────
  'home.badge':             { ar: 'منصة الغذاء الذكية في الجزائر', fr: 'La plateforme alimentaire intelligente d\'Algérie', en: 'The smart food platform of Algeria', tz: 'Tilin tazelɣant n učči di Lezzayer' },
  'home.heroTitle':         { ar: 'قاوم الهدر، وفّر أكثر', fr: 'Luttez contre le gaspillage, économisez plus', en: 'Fight waste, save more', tz: 'Nnaɣ akked uxṣef, twizi ugar' },
  'home.heroDesc':          { ar: 'سويقة ديزاد تربط المزارعين والموردين المحليين بالمطاعم والمستهلكين عبر سوق رقمي ذكي — حيث يصبح فائض الإنتاج فرصة وليس نفاية.', fr: 'Suwaika Dezad connecte les agriculteurs et fournisseurs locaux aux restaurants et consommateurs via un marché numérique intelligent — où l\'excédent devient une opportunité, pas un déchet.', en: 'Suwaika Dezad connects local farmers and suppliers with restaurants and consumers via a smart digital marketplace — where surplus becomes opportunity, not waste.', tz: 'Suwaika Dezad yettunez ifunasen d yimakbaren idiganen d teẓḍunin d yimẓeẓẓu d teǧǧaɛt s yiwet n tezdelɣa tileẓyant — anida tirḍaqqelt d tigert, mačči d axṣef.' },
  'home.browseMarket':      { ar: 'تصفح السوق',         fr: 'Parcourir le marché', en: 'Browse Market',    tz: 'Wali lḥal' },
  'home.joinFree':          { ar: 'انضم مجاناً',         fr: 'Rejoindre gratuitement', en: 'Join Free',     tz: 'Ddu s waneẓẓi' },
  'home.secure':            { ar: 'آمن ومضمون',         fr: 'Sécurisé',          en: 'Secure & Guaranteed', tz: 'D aɣelsan' },
  'home.fastDelivery':      { ar: 'توصيل سريع',         fr: 'Livraison rapide',  en: 'Fast Delivery',     tz: 'Asiweḍ tarawt' },
  'home.quality':           { ar: 'جودة مضمونة',        fr: 'Qualité garantie',  en: 'Guaranteed Quality', tz: 'Taɣara yettwamanen' },
  'home.savedToday':        { ar: 'تم توفيره اليوم',    fr: 'Sauvé aujourd\'hui', en: 'Saved Today',      tz: 'Yettwasekles ass-a' },
  'home.farmersSuppliers':  { ar: 'مزارع ومورد',        fr: 'Agriculteurs et fournisseurs', en: 'Farmers & Suppliers', tz: 'Ifunasen d yimakbaren' },
  'home.acrossAlgeria':     { ar: 'عبر الجزائر',        fr: 'À travers l\'Algérie', en: 'Across Algeria',  tz: 'Di Lezzayer' },
  'home.fromFoodWaste':     { ar: 'من هدر الطعام',      fr: 'de gaspillage alimentaire', en: 'of food waste', tz: 'seg uxṣef n učči' },
  'home.statsTitle':        { ar: 'أرقام تتحدث عن نفسها', fr: 'Des chiffres qui parlent', en: 'Numbers that speak for themselves', tz: 'Imḍanen i yettmeslayen' },
  'home.statsSub':          { ar: 'نحن نقيس أثرنا كل يوم', fr: 'Nous mesurons notre impact chaque jour', en: 'We measure our impact every day', tz: 'Nsektay ayen nxeddem yal ass' },
  'home.featuredTitle':     { ar: 'أفضل العروض الآن',   fr: 'Meilleures offres maintenant', en: 'Best Offers Now', tz: 'Tifedniwin yifen tura' },
  'home.featuredSub':       { ar: 'عروض محدودة من المزارعين المحليين', fr: 'Offres limitées des agriculteurs locaux', en: 'Limited offers from local farmers', tz: 'Tifedniwin s talast seg ifunasen idiganen' },
  'home.viewAll':           { ar: 'عرض الكل',           fr: 'Voir tout',         en: 'View All',          tz: 'Wali akk' },
  'home.howTitle':          { ar: 'كيف تعمل المنصة؟',   fr: 'Comment fonctionne la plateforme ?', en: 'How does it work?', tz: 'Amek iteddu unagraw?' },
  'home.howSub':            { ar: 'أربع خطوات بسيطة لتجربة مختلفة', fr: 'Quatre étapes simples pour une expérience différente', en: 'Four simple steps for a different experience', tz: 'Kraḍ n tḥulaẓin fessasen i tirmit nniden' },
  'home.step1Title':        { ar: 'المزارع يضيف المنتج', fr: 'L\'agriculteur ajoute le produit', en: 'Farmer adds product', tz: 'Afunas yernu afaris' },
  'home.step1Desc':         { ar: 'يُدرج المزارع منتجاته الفائضة بأسعار مخفضة بدلاً من التخلص منها', fr: 'L\'agriculteur liste ses excédents à prix réduits plutôt que de les jeter', en: 'The farmer lists surplus stock at reduced prices instead of discarding it', tz: 'Afunas yettarra lǧehd-is s temsirt yuẓilen deg umḍiq n tḍemḍemt' },
  'home.step2Title':        { ar: 'المستهلك يكتشف العروض', fr: 'Le consommateur découvre les offres', en: 'Consumer discovers offers', tz: 'Ameẓwar yettwali tifedniwin' },
  'home.step2Desc':         { ar: 'تصفح العروض القريبة منك وفلتر حسب النوع والسعر والمسافة', fr: 'Parcourez les offres à proximité et filtrez par type, prix et distance', en: 'Browse nearby offers and filter by type, price, and distance', tz: 'Wali tifedniwin iqerben ad yilin d usizdeg s wanaw, ssuma, d teɣzi' },
  'home.step3Title':        { ar: 'اشتري وادفع',         fr: 'Achetez et payez',  en: 'Buy & Pay',         tz: 'Aɣ d xelleṣ' },
  'home.step3Desc':         { ar: 'أضف للسلة وأكمل الطلب بخطوات بسيطة وآمنة', fr: 'Ajoutez au panier et finalisez la commande en quelques étapes simples et sûres', en: 'Add to cart and checkout in simple, secure steps', tz: 'Rnu ɣer teqecwalt d fakka tladna s tḥulaẓin fessasin d yifenẓanen' },
  'home.step4Title':        { ar: 'معاً نقاوم الهدر',    fr: 'Ensemble, luttonons contre le gaspillage', en: 'Together we fight waste', tz: 'S tidet nnaɣ akked uxṣef' },
  'home.step4Desc':         { ar: 'كل عملية شراء تُسهم في تقليل هدر الطعام وتدعم المزارعين', fr: 'Chaque achat contribue à réduire le gaspillage et soutient les agriculteurs', en: 'Every purchase helps reduce food waste and supports farmers', tz: 'Yal tiɣin yettalluy deg usemẓi uxṣef d useḥbiber n ifunasen' },
  'home.ctaTitle':          { ar: 'انضم إلى الثورة الغذائية', fr: 'Rejoignez la révolution alimentaire', en: 'Join the food revolution', tz: 'Ddu ɣer tegrawt n učči' },
  'home.ctaDesc':           { ar: 'سواء كنت مزارعاً يريد بيع فائضه، أو مستهلكاً يبحث عن أسعار معقولة، أو مطعماً يريد توفير تكاليفه — سويقة ديزاد هي وجهتك.', fr: 'Que vous soyez agriculteur voulant vendre son excédent, consommateur cherchant des prix abordables, ou restaurant voulant réduire ses coûts — Suwaika Dezad est votre destination.', en: 'Whether you\'re a farmer wanting to sell surplus, a consumer seeking fair prices, or a restaurant looking to cut costs — Suwaika Dezad is your destination.', tz: 'Ma d afunas yebɣa ad isnuzmen tirḍaqqelt, neɣ d ameẓwar anadi ɣef tsumin tinemrawin, neɣ d taẓḍunt tebɣa ad ternu tiseqqitin — Suwaika Dezad d anida-ik.' },
  'home.ctaStart':          { ar: 'ابدأ الآن مجاناً',   fr: 'Commencer gratuitement', en: 'Start for Free', tz: 'Bdu s waneẓẓi' },
  'home.ctaLearnMore':      { ar: 'اعرف أكثر',          fr: 'En savoir plus',    en: 'Learn More',        tz: 'Issin ugar' },

  // ── Product card ────────────────────────────────────────────────────────
  'product.details':        { ar: 'تفاصيل',             fr: 'Détails',           en: 'Details',           tz: 'Talqayt' },
  'product.buyNow':         { ar: 'اشتري الآن',         fr: 'Acheter maintenant', en: 'Buy Now',          tz: 'Aɣ tura' },
  'product.remaining':      { ar: 'متبقي',              fr: 'Restant',           en: 'Left',              tz: 'Yeggra' },
  'product.perUnit':        { ar: 'دج',                 fr: 'DA',                en: 'DZD',               tz: 'DA' },
  'product.wishlist':       { ar: 'إضافة للمفضلة',      fr: 'Ajouter aux favoris', en: 'Add to wishlist', tz: 'Rnu ɣer yifenẓanen' },
  'product.addedToCart':    { ar: 'تمت الإضافة إلى السلة', fr: 'Ajouté au panier', en: 'Added to cart',   tz: 'Yettwarna ɣer teqecwalt' },

  // ── Market page ─────────────────────────────────────────────────────────
  'market.title':           { ar: 'سوق الغذاء',         fr: 'Marché alimentaire', en: 'Food Market',     tz: 'Lḥal n učči' },
  'market.subtitle':        { ar: 'اكتشف أفضل العروض من المزارعين والموردين المحليين', fr: 'Découvrez les meilleures offres des agriculteurs et fournisseurs locaux', en: 'Discover the best offers from local farmers and suppliers', tz: 'Wali tiqwan yifen seg ifunasen d yimakbaren idiganen' },
  'market.searchPlaceholder': { ar: 'ابحث عن منتج، بائع، أو منطقة...', fr: 'Rechercher un produit, vendeur ou région...', en: 'Search for a product, seller, or area...', tz: 'Nadi afaris, aberr, neɣ tamnaḍt...' },
  'market.sortBy':          { ar: 'ترتيب حسب',          fr: 'Trier par',         en: 'Sort by',           tz: 'Sizdeg s' },
  'market.sortDefault':     { ar: 'الافتراضي',          fr: 'Par défaut',        en: 'Default',           tz: 'S uwennez n tazwara' },
  'market.sortPriceAsc':    { ar: 'السعر: الأقل أولاً', fr: 'Prix : croissant',  en: 'Price: Low to High', tz: 'Ssuma: D ameẓyan' },
  'market.sortPriceDesc':   { ar: 'السعر: الأعلى أولاً', fr: 'Prix : décroissant', en: 'Price: High to Low', tz: 'Ssuma: D ameqqran' },
  'market.sortRating':      { ar: 'التقييم الأعلى',     fr: 'Meilleure note',    en: 'Top Rated',         tz: 'Tazmilt yifen' },
  'market.sortExpiry':      { ar: 'ينتهي قريباً',       fr: 'Expire bientôt',    en: 'Expiring Soon',     tz: 'Ad ifak dɣa' },
  'market.maxPrice':        { ar: 'الحد الأقصى للسعر',  fr: 'Prix maximum',      en: 'Max Price',         tz: 'Ssuma tafellayt' },
  'market.productsCount':   { ar: 'منتج متاح',          fr: 'produits disponibles', en: 'products available', tz: 'ifarisen llan' },
  'market.noResults':       { ar: 'لا توجد نتائج',      fr: 'Aucun résultat',    en: 'No results found',  tz: 'Ulac igmad' },
  'market.tryDifferent':    { ar: 'جرّب البحث بكلمات مختلفة أو غيّر الفئة', fr: 'Essayez d\'autres mots-clés ou changez de catégorie', en: 'Try different keywords or change category', tz: 'Ɛreḍ awalen nniden neɣ snifel taggayt' },

  // ── Cart ────────────────────────────────────────────────────────────────
  'cart.title':             { ar: 'سلة التسوق',         fr: 'Panier',            en: 'Shopping Cart',     tz: 'Taqecwalt' },
  'cart.empty':             { ar: 'سلتك فارغة',         fr: 'Votre panier est vide', en: 'Your cart is empty', tz: 'Taqecwalt-ik d tilemt' },
  'cart.emptyDesc':         { ar: 'اكتشف العروض المتاحة وأضف ما يعجبك', fr: 'Découvrez les offres disponibles et ajoutez ce qui vous plaît', en: 'Discover available offers and add what you like', tz: 'Wali tifedniwin yellan d rnu ayen i k-yeɛǧeben' },
  'cart.subtotal':          { ar: 'المجموع الفرعي',     fr: 'Sous-total',        en: 'Subtotal',          tz: 'Aḍebsi anḍar' },
  'cart.discount':          { ar: 'الخصم',              fr: 'Remise',            en: 'Discount',          tz: 'Tuǧǧin' },
  'cart.delivery':          { ar: 'التوصيل',            fr: 'Livraison',         en: 'Delivery',          tz: 'Asiweḍ' },
  'cart.free':              { ar: 'مجاني',              fr: 'Gratuit',           en: 'Free',              tz: 'S waneẓẓi' },
  'cart.total':             { ar: 'الإجمالي',           fr: 'Total',             en: 'Total',             tz: 'Asemday' },
  'cart.saved':             { ar: 'وفّرت',              fr: 'Vous avez économisé', en: 'You saved',       tz: 'Ttwiẓẓel-ik' },
  'cart.savedDesc':         { ar: 'دج وساهمت في تقليل هدر الطعام!', fr: 'DA et contribué à réduire le gaspillage alimentaire !', en: 'DZD and helped reduce food waste!', tz: 'DA d temɛawent deg usemẓi n uxṣef n učči!' },
  'cart.checkout':          { ar: 'تأكيد الطلب',        fr: 'Confirmer la commande', en: 'Confirm Order', tz: 'Sentem taladna' },
  'cart.orderConfirmed':    { ar: 'تم تقديم طلبك بنجاح!', fr: 'Votre commande a été passée avec succès !', en: 'Your order has been placed successfully!', tz: 'Taladna-ik tettwafk akken ilaq!' },
  'cart.browseMarket':      { ar: 'تصفح السوق',         fr: 'Parcourir le marché', en: 'Browse Market',   tz: 'Wali lḥal' },

  // ── Auth ────────────────────────────────────────────────────────────────
  'auth.login':             { ar: 'تسجيل الدخول',       fr: 'Connexion',         en: 'Sign In',           tz: 'Kcem' },
  'auth.register':          { ar: 'إنشاء حساب',         fr: 'Créer un compte',   en: 'Sign Up',           tz: 'Rnu amiḍan' },
  'auth.fullName':          { ar: 'الاسم الكامل',       fr: 'Nom complet',       en: 'Full Name',         tz: 'Isem umḍin' },
  'auth.email':             { ar: 'البريد الإلكتروني',  fr: 'Adresse e-mail',    en: 'Email Address',     tz: 'Tansa n yimayl' },
  'auth.password':          { ar: 'كلمة المرور',        fr: 'Mot de passe',      en: 'Password',          tz: 'Awal uffir' },
  'auth.forgotPassword':    { ar: 'نسيت كلمة المرور؟',  fr: 'Mot de passe oublié ?', en: 'Forgot password?', tz: 'Tettuḍ awal uffir?' },
  'auth.role':              { ar: 'أنا...',             fr: 'Je suis...',        en: 'I am a...',         tz: 'Nekk d...' },
  'auth.roleConsumer':      { ar: 'مستهلك',             fr: 'Consommateur',      en: 'Consumer',          tz: 'Ameẓwar' },
  'auth.roleFarmer':        { ar: 'مزارع',              fr: 'Agriculteur',       en: 'Farmer',            tz: 'Afunas' },
  'auth.roleRestaurant':    { ar: 'مطعم',               fr: 'Restaurant',        en: 'Restaurant',        tz: 'Taẓḍunt' },
  'auth.google':            { ar: 'المتابعة عبر Google', fr: 'Continuer avec Google', en: 'Continue with Google', tz: 'Kemmel s Google' },
  'auth.processing':        { ar: 'جارٍ المعالجة...',   fr: 'Traitement...',     en: 'Processing...',     tz: 'Asali...' },
  'auth.welcomeBack':       { ar: 'مرحباً بعودتك!',     fr: 'Bon retour !',      en: 'Welcome back!',     tz: 'Ansuf-d tikkelt-nniḍen!' },
  'auth.accountCreated':    { ar: 'تم إنشاء حسابك بنجاح', fr: 'Compte créé avec succès', en: 'Account created successfully', tz: 'Amiḍan yettwarna akken ilaq' },
  'auth.fillFields':        { ar: 'يرجى ملء جميع الحقول المطلوبة', fr: 'Veuillez remplir tous les champs obligatoires', en: 'Please fill in all required fields', tz: 'Ma ulac aɣilif, ččar akk urtan yettwasran' },
  'auth.invalidEmail':      { ar: 'البريد الإلكتروني غير صحيح', fr: 'Adresse e-mail invalide', en: 'Invalid email address', tz: 'Tansa n yimayl ur tgid ara' },
  'auth.shortPassword':     { ar: 'كلمة المرور قصيرة جداً (6 أحرف على الأقل)', fr: 'Mot de passe trop court (6 caractères minimum)', en: 'Password too short (min 6 characters)', tz: 'Awal uffir d aameẓyan aṭas (6 n yisekkilen)'},
  'auth.haveAccount':       { ar: 'لديك حساب؟',         fr: 'Vous avez un compte ?', en: 'Have an account?', tz: 'Ɣur-k amiḍan?' },
  'auth.noAccount':         { ar: 'ليس لديك حساب؟',     fr: 'Pas de compte ?',   en: 'No account yet?',   tz: 'Ulac amiḍan?' },
  'auth.welcomeTo':         { ar: 'مرحباً بك في',       fr: 'Bienvenue sur',     en: 'Welcome to',        tz: 'Ansuf ɣer' },
  'auth.subTitle':          { ar: 'بورصة الغذاء الذكية', fr: 'La bourse alimentaire intelligente', en: 'The Smart Food Exchange', tz: 'Tilin tazelɣant n učči' },
  'auth.orContinue':        { ar: 'أو تابع عبر',        fr: 'Ou continuer avec', en: 'or continue with',  tz: 'neɣ kemmel s' },
  'auth.googleSoon':        { ar: 'بياناتك محمية ومشفّرة — نستخدم Google فقط للتحقق من هويتك', fr: 'Vos données sont protégées — Google sert uniquement à vérifier votre identité', en: 'Your data is protected — Google is only used to verify your identity', tz: 'Isefka-ik ttwaḥerzen — Google yettusemqar i useɣzen n tmagit-ik kan' },
  'auth.demoNote':          { ar: 'بياناتك محفوظة بأمان على خوادم في الجزائر', fr: 'Vos données sont stockées en sécurité', en: 'Your data is stored securely', tz: 'Isefka-ik ttwaḥerzen s wudem aɣelsan' },

  // ── Dashboard ───────────────────────────────────────────────────────────
  'dash.overview':          { ar: 'نظرة عامة',          fr: 'Vue d\'ensemble',   en: 'Overview',          tz: 'Tamuɣli' },
  'dash.products':          { ar: 'منتجاتي',            fr: 'Mes produits',      en: 'My Products',       tz: 'Ifarisen-inu' },
  'dash.orders':            { ar: 'الطلبات',            fr: 'Commandes',         en: 'Orders',            tz: 'Tiludna' },
  'dash.analytics':         { ar: 'الإحصائيات',         fr: 'Statistiques',      en: 'Analytics',         tz: 'Tidaddanin' },
  'dash.addProduct':        { ar: 'إضافة منتج',         fr: 'Ajouter un produit', en: 'Add Product',      tz: 'Rnu afaris' },
  'dash.totalSales':        { ar: 'إجمالي المبيعات',    fr: 'Ventes totales',    en: 'Total Sales',       tz: 'Tiɣin s usemday' },
  'dash.activeOrders':      { ar: 'الطلبات النشطة',     fr: 'Commandes actives', en: 'Active Orders',     tz: 'Tiludna turdimin' },
  'dash.listedProducts':    { ar: 'المنتجات المُدرجة',  fr: 'Produits listés',   en: 'Listed Products',   tz: 'Ifarisen yettwaḍefren' },
  'dash.storeRating':       { ar: 'تقييم المتجر',       fr: 'Note du magasin',   en: 'Store Rating',      tz: 'Tazmilt n leḥḥer' },
  'dash.thisMonth':         { ar: 'هذا الشهر',          fr: 'Ce mois',           en: 'This month',        tz: 'Yeggwa-agi' },
  'dash.recentOrders':      { ar: 'آخر الطلبات',        fr: 'Dernières commandes', en: 'Recent Orders',   tz: 'Tiludna tineggura' },
  'dash.orderId':           { ar: 'رقم الطلب',          fr: 'N° Commande',       en: 'Order ID',          tz: 'Uṭṭun n tludna' },
  'dash.product':           { ar: 'المنتج',             fr: 'Produit',           en: 'Product',           tz: 'Afaris' },
  'dash.customer':          { ar: 'العميل',             fr: 'Client',            en: 'Customer',          tz: 'Amsaɣ' },
  'dash.quantity':          { ar: 'الكمية',             fr: 'Quantité',          en: 'Quantity',          tz: 'Tasmekta' },
  'dash.total':             { ar: 'المجموع',            fr: 'Total',             en: 'Total',             tz: 'Asemday' },
  'dash.status':            { ar: 'الحالة',             fr: 'Statut',            en: 'Status',            tz: 'Addad' },
  'dash.date':              { ar: 'التاريخ',            fr: 'Date',              en: 'Date',              tz: 'Azemz' },
  'dash.statusCompleted':  { ar: 'مكتمل',              fr: 'Complété',          en: 'Completed',         tz: 'Immed' },
  'dash.statusDelivering': { ar: 'قيد التوصيل',        fr: 'En livraison',      en: 'Delivering',        tz: 'Deg usiweḍ' },
  'dash.statusProcessing': { ar: 'قيد المعالجة',       fr: 'En traitement',     en: 'Processing',        tz: 'Deg useggas' },
  'dash.weeklySales':       { ar: 'المبيعات هذا الأسبوع', fr: 'Ventes de la semaine', en: 'Sales this week', tz: 'Tiɣin dduṛt-agi' },
  'dash.topProducts':       { ar: 'أكثر المنتجات مبيعاً', fr: 'Produits les plus vendus', en: 'Top Selling Products', tz: 'Ifarisen i d-yettuɣalen' },
  'dash.verifiedSeller':    { ar: 'بائع موثّق',         fr: 'Vendeur vérifié',   en: 'Verified Seller',   tz: 'Aberr yettwamanen' },
  'dash.editProduct':       { ar: 'يمكنك تعديل المنتج هنا', fr: 'Modifier le produit ici', en: 'Edit the product here', tz: 'Ẓreg afaris dagi' },
  'dash.deleteProduct':     { ar: 'تم حذف المنتج',      fr: 'Produit supprimé',  en: 'Product deleted',   tz: 'Afaris yettwakkes' },
  'dash.noProducts':        { ar: 'لا توجد منتجات بعد. أضف منتجك الأول!', fr: 'Aucun produit. Ajoutez votre premier produit !', en: 'No products yet. Add your first one!', tz: 'Ulac afarisen. Rnu yiwen deg amezwaru!' },
  'dash.productAdded':      { ar: 'تمت إضافة المنتج بنجاح', fr: 'Produit ajouté avec succès', en: 'Product added successfully', tz: 'Afaris yettwarna akken ilaq' },
  'dash.productName':       { ar: 'اسم المنتج',         fr: 'Nom du produit',    en: 'Product Name',      tz: 'Isem n ufarris' },
  'dash.originalPrice':     { ar: 'السعر الأصلي',       fr: 'Prix d\'origine',   en: 'Original Price',    tz: 'Ssuma n tazwara' },
  'dash.discountedPrice':   { ar: 'السعر المخفض',       fr: 'Prix réduit',       en: 'Discounted Price',  tz: 'Ssuma yettwakksen' },
  'dash.category':          { ar: 'الفئة',              fr: 'Catégorie',         en: 'Category',          tz: 'Taggayt' },
  'dash.availableQty':      { ar: 'الكمية المتاحة',     fr: 'Quantité disponible', en: 'Available Quantity', tz: 'Tasmekta yellan' },
  'dash.expiry':            { ar: 'الصلاحية (ساعة)',    fr: 'Expiration (heures)', en: 'Expiry (hours)',  tz: 'Tignit (isragen)' },
  'dash.location':          { ar: 'الموقع',             fr: 'Emplacement',       en: 'Location',          tz: 'Tanɣa' },
  'dash.description':       { ar: 'الوصف',              fr: 'Description',       en: 'Description',       tz: 'Aglam' },
  'dash.saveProduct':       { ar: 'حفظ المنتج',         fr: 'Enregistrer le produit', en: 'Save Product', tz: 'Sekles afaris' },
  'dash.addNewProduct':     { ar: 'إضافة منتج جديد',    fr: 'Ajouter un nouveau produit', en: 'Add New Product', tz: 'Rnu afaris amaynut' },

  // ── About ───────────────────────────────────────────────────────────────
  'about.heroTitle':        { ar: 'سويقة ديزاد',        fr: 'Suwaika Dezad',     en: 'Suwaika Dezad',     tz: 'Suwaika Dezad' },
  'about.heroDesc':         { ar: 'منصة جزائرية رائدة تحارب هدر الغذاء وتدعم المزارعين المحليين من خلال سوق رقمي ذكي وشامل', fr: 'Une plateforme algérienne pionnière qui lutte contre le gaspillage alimentaire et soutient les agriculteurs locaux via un marché numérique intelligent et inclusif', en: 'A pioneering Algerian platform fighting food waste and supporting local farmers through a smart, inclusive digital marketplace', tz: 'Tilin tazelɣant tamezwarut n Lezzayer i yennuɣen mgal uxṣef n učči d useḥbiber n ifunasen idiganen s yiwet n tezdelɣa tileẓyant' },
  'about.visionTitle':      { ar: 'رؤيتنا',             fr: 'Notre vision',      en: 'Our Vision',        tz: 'Tamuɣli-nneɣ' },
  'about.visionText':       { ar: 'أن نكون المنصة الغذائية الأولى في الجزائر والمغرب العربي التي تحقق نظاماً غذائياً دائراً متكاملاً، حيث لا يُهدر أي غذاء صالح للاستهلاك.', fr: 'Être la première plateforme alimentaire en Algérie et au Maghreb réalisant un système alimentaire circulaire intégré, où aucun aliment comestible n\'est gaspillé.', en: 'To be the leading food platform in Algeria and the Maghreb, achieving an integrated circular food system where no edible food is wasted.', tz: 'Ad nili d tilin tamezwarut n učči di Lezzayer d Umerruk, anida ulac acu yettuxṣefen.' },
  'about.missionTitle':     { ar: 'مهمتنا',             fr: 'Notre mission',     en: 'Our Mission',       tz: 'Tawuri-nneɣ' },
  'about.missionText':      { ar: 'ربط المزارعين والموردين المحليين بالمستهلكين والمطاعم عبر تقنية ذكية تجعل فائض الإنتاج فرصة اقتصادية وليس عبئاً بيئياً.', fr: 'Connecter les agriculteurs et fournisseurs locaux aux consommateurs et restaurants via une technologie intelligente qui transforme l\'excédent en opportunité économique plutôt qu\'en fardeau environnemental.', en: 'Connect local farmers and suppliers with consumers and restaurants via smart technology that turns surplus into economic opportunity rather than environmental burden.', tz: 'Yezuz ifunasen d yimakbaren idiganen d yimeẓwara d teẓḍunin s teknulujit tazelɣant i yerran tirḍaqqelt d tigert tudmist mačči d tabaḍt tamagnut.' },
  'about.valuesTitle':      { ar: 'قيمنا الأساسية',     fr: 'Nos valeurs',       en: 'Our Core Values',   tz: 'Azal-nneɣ' },
  'about.teamTitle':        { ar: 'فريقنا',             fr: 'Notre équipe',      en: 'Our Team',          tz: 'Tarbaɛt-nneɣ' },
  'about.impactTitle':      { ar: 'أثرنا البيئي',       fr: 'Notre impact écologique', en: 'Our Environmental Impact', tz: 'Aẓayar-nneɣ n tgemmin' },
  'about.impactDesc':       { ar: 'منذ انطلاقنا، نجحنا في إنقاذ آلاف الأطنان من الغذاء من الهدر، مما يعادل تخفيضاً ملموساً في انبعاثات ثاني أكسيد الكربون', fr: 'Depuis notre lancement, nous avons sauvé des milliers de tonnes de nourriture du gaspillage, équivalant à une réduction tangible des émissions de CO₂', en: 'Since launch, we\'ve saved thousands of tons of food from waste, equivalent to a tangible reduction in CO₂ emissions', tz: 'Si tagra, nesseḥbes ifadden n tṛuzin n učči seg uxṣef, ayen d-yemmalen semẓi n trujja n CO₂' },
  'about.foodSaved':        { ar: 'غذاء مُنقذ',         fr: 'Nourriture sauvée', en: 'Food Saved',        tz: 'Ačči yettwaḥerzen' },
  'about.co2Reduced':       { ar: 'CO₂ مُخفَّض',         fr: 'CO₂ réduit',        en: 'CO₂ Reduced',       tz: 'CO₂ yettwasemẓen' },
  'about.familiesHelped':   { ar: 'عائلة مستفيدة',      fr: 'Familles aidées',   en: 'Families Helped',   tz: 'Tawacwin yettwallhen' },

  // ── Footer ──────────────────────────────────────────────────────────────
  'footer.links':           { ar: 'الروابط',            fr: 'Liens',             en: 'Links',             tz: 'Iseɣwan' },
  'footer.forSellers':      { ar: 'للبائعين',           fr: 'Pour les vendeurs', en: 'For Sellers',       tz: 'I yiberna' },
  'footer.contact':         { ar: 'تواصل معنا',         fr: 'Contact',           en: 'Contact Us',        tz: 'Nermes-aɣ' },
  'footer.desc':            { ar: 'منصة جزائرية تربط المزارعين بالمستهلكين لتقليل هدر الغذاء وبناء اقتصاد غذائي مستدام.', fr: 'Une plateforme algérienne connectant agriculteurs et consommateurs pour réduire le gaspillage alimentaire et bâtir une économie alimentaire durable.', en: 'An Algerian platform connecting farmers with consumers to reduce food waste and build a sustainable food economy.', tz: 'Tilin n Lezzayer yezuzn ifunasen d yimeẓwara i usemẓi n uxṣef d lebni n tMANA n učči iweḥcen.' },
  'footer.rights':          { ar: '© 2025 سويقة ديزاد. جميع الحقوق محفوظة.', fr: '© 2025 Suwaika Dezad. Tous droits réservés.', en: '© 2025 Suwaika Dezad. All rights reserved.', tz: '© 2025 Suwaika Dezad. Akk izerfan ttwaḥerzen.' },
  'footer.madeIn':          { ar: 'صُنع في الجزائر',    fr: 'Fait en Algérie',   en: 'Made in Algeria',   tz: 'Yettwaxdem di Lezzayer' },
  'footer.registerAsSeller':{ ar: 'سجّل كبائع',         fr: 'S\'inscrire comme vendeur', en: 'Register as Seller', tz: 'Ddu d aberr' },
  'footer.addProduct':      { ar: 'إضافة منتج',         fr: 'Ajouter un produit', en: 'Add Product',      tz: 'Rnu afaris' },
  'footer.manageOrders':    { ar: 'إدارة الطلبات',      fr: 'Gérer les commandes', en: 'Manage Orders',   tz: 'Sefrek tiludna' },

  // ── Product detail ──────────────────────────────────────────────────────
  'detail.breadcrumb':      { ar: 'الرئيسية',           fr: 'Accueil',           en: 'Home',              tz: 'Agejdan' },
  'detail.market':          { ar: 'السوق',              fr: 'Marché',            en: 'Market',            tz: 'Lḥal' },
  'detail.notFound':        { ar: 'المنتج غير موجود',   fr: 'Produit introuvable', en: 'Product not found', tz: 'Afaris ur yettwaf ara' },
  'detail.backToMarket':    { ar: 'العودة للسوق',       fr: 'Retour au marché',  en: 'Back to Market',    tz: 'Uɣal ɣer lḥal' },
  'detail.savePercent':     { ar: 'وفّر',               fr: 'Économisez',        en: 'Save',              tz: 'Twizi' },
  'detail.originalPrice':   { ar: 'السعر الأصلي',       fr: 'Prix d\'origine',   en: 'Original Price',    tz: 'Ssuma n tazwara' },
  'detail.verified':        { ar: 'موثّق',              fr: 'Vérifié',           en: 'Verified',          tz: 'Yettwaman' },
  'detail.fromYou':         { ar: 'كم منك',             fr: 'km de vous',        en: 'km from you',       tz: 'km seg kečč' },
  'detail.quantity':        { ar: 'الكمية:',            fr: 'Quantité :',        en: 'Quantity:',         tz: 'Tasmekta:' },
  'detail.available':       { ar: 'متاح',               fr: 'disponible',        en: 'available',         tz: 'yellan' },
  'detail.addToCart':       { ar: 'أضف للسلة',          fr: 'Ajouter au panier', en: 'Add to Cart',       tz: 'Rnu ɣer teqecwalt' },
  'detail.share':           { ar: 'مشاركة',             fr: 'Partager',          en: 'Share',             tz: 'Bḍu' },
  'detail.shareSuccess':    { ar: 'تم نسخ الرابط',      fr: 'Lien copié',        en: 'Link copied',       tz: 'Aseɣwen yettwanɣel' },
  'detail.fastDelivery':    { ar: 'توصيل سريع',         fr: 'Livraison rapide',  en: 'Fast Delivery',     tz: 'Asiweḍ tarawt' },
  'detail.qualityGuaranteed': { ar: 'جودة مضمونة',      fr: 'Qualité garantie',  en: 'Quality Guaranteed', tz: 'Taɣara yettwamanen' },
  'detail.bestPrice':       { ar: 'أفضل سعر',           fr: 'Meilleur prix',     en: 'Best Price',        tz: 'Ssuma yifen' },
  'detail.refund':          { ar: 'استرداد مضمون',      fr: 'Remboursement garanti', en: 'Refund Guaranteed', tz: 'Tafaturt yettwamanen' },
  'detail.tabDescription':  { ar: 'التفاصيل',           fr: 'Description',       en: 'Description',       tz: 'Aglam' },
  'detail.tabReviews':      { ar: 'التقييمات',          fr: 'Avis',              en: 'Reviews',           tz: 'Tizmilin' },
  'detail.reviewsCount':    { ar: 'تقييم',              fr: 'avis',              en: 'reviews',           tz: 'tizmilin' },
  'detail.relatedProducts': { ar: 'منتجات مشابهة',      fr: 'Produits similaires', en: 'Related Products', tz: 'Ifarisen nniden' },

  // ── Home stats ──────────────────────────────────────────────────────────
  'home.statFoodSaved':     { ar: 'كيلوغرام محفوظ من الهدر', fr: 'kg sauvés du gaspillage', en: 'kg saved from waste', tz: 'kg yettwaḥerzen seg uxṣef' },
  'home.statFarmers':       { ar: 'مزارع وموردين محليين',   fr: 'agriculteurs et fournisseurs locaux', en: 'local farmers & suppliers', tz: 'ifunasen d yimakbaren idiganen' },
  'home.statUsers':         { ar: 'مستخدم نشط شهرياً',       fr: 'utilisateurs actifs mensuels', en: 'monthly active users', tz: 'iseqdacen urminen s waggur' },
  'home.statSatisfaction':  { ar: 'رضا العملاء',             fr: 'satisfaction client',       en: 'customer satisfaction', tz: 'ṛḍa n yimsaɣen' },

  // ── Categories ──────────────────────────────────────────────────────────
  'cat.vegetables':  { ar: 'خضروات',          fr: 'Légumes',         en: 'Vegetables',        tz: 'Tiẓedin' },
  'cat.fruits':      { ar: 'فواكه',            fr: 'Fruits',          en: 'Fruits',            tz: 'Tiflihin' },
  'cat.bakery':      { ar: 'مخبوزات',          fr: 'Boulangerie',     en: 'Bakery',            tz: 'Aḍrum' },
  'cat.meat':        { ar: 'لحوم',             fr: 'Viandes',         en: 'Meat',              tz: 'Tifunasin' },
  'cat.dairy':       { ar: 'ألبان',            fr: 'Produits laitiers', en: 'Dairy',          tz: 'Ifassen' },
  'cat.pickles':     { ar: 'مخللات',           fr: 'Conserves',       en: 'Pickles',           tz: 'Tisertiyin' },
  'cat.natural':     { ar: 'منتجات طبيعية',    fr: 'Produits naturels', en: 'Natural Products', tz: 'Ifarisen n tagant' },
  'cat.grains':      { ar: 'حبوب',             fr: 'Céréales',        en: 'Grains',            tz: 'Iɣan' },
  'cat.dates':       { ar: 'تمور',             fr: 'Dattes',          en: 'Dates',             tz: 'Tifeywin' },

  // ── Cart per-unit suffix ────────────────────────────────────────────────
  'unit.kg':         { ar: 'كغ',  fr: 'kg',  en: 'kg',  tz: 'kg' },
  'unit.bag':        { ar: 'كيس', fr: 'sac', en: 'bag', tz: 'sakku' },
  'unit.unit':       { ar: 'وحدة', fr: 'pièce', en: 'unit', tz: 'tawin' },
  'unit.liter':      { ar: 'لتر', fr: 'litre', en: 'liter', tz: 'litr' },

  // ── 404 ─────────────────────────────────────────────────────────────────
  'notfound.title':         { ar: 'الصفحة غير موجودة',  fr: 'Page introuvable',  en: 'Page not found',    tz: 'Asebter ur yettwaf ara' },
  'notfound.back':          { ar: 'العودة للرئيسية',    fr: 'Retour à l\'accueil', en: 'Back to Home',    tz: 'Uɣal ɣer ugejdan' },

  // ── Brand showcase (partners / collaborators) ───────────────────────────
  'brands.title':           { ar: 'شركاؤنا في النجاح',  fr: 'Nos partenaires de confiance', en: 'Our Trusted Partners', tz: 'Imendaden-nneɣ n tmorellt' },
  'brands.subtitle':        { ar: 'علامات تجارية رائدة في مجال الغذاء والزراعة تشاركنا الرؤية نحو مستقبل غذائي مستدام', fr: 'Des marques leaders de l\'agroalimentaire qui partagent notre vision d\'un avenir alimentaire durable', en: 'Leading food & agriculture brands that share our vision for a sustainable food future', tz: 'Ticermiyin timeqranin deg učči d tkerza yebḍan d-nneɣ ti muɣli ɣer yimal n učči iweḥcen' },
  'brands.yourBrandHere':   { ar: 'علامتك التجارية هنا', fr: 'Votre marque ici', en: 'Your Brand Here', tz: 'Tacerkit-ik dagi' },
  'brands.collabWithUs':    { ar: 'تعاون معنا',          fr: 'Collaborez avec nous', en: 'Collaborate with Us', tz: 'Seddu d-nneɣ' },
  'brands.collabDesc':      { ar: 'انضم إلى علامات تجارية رائدة تصل إلى آلاف المستهلكين الجزائريين يومياً عبر منصة سويقة ديزاد', fr: 'Rejoignez les marques leaders qui touchent chaque jour des milliers de consommateurs algériens via Suwaika Dezad', en: 'Join leading brands reaching thousands of Algerian consumers daily through Suwaika Dezad', tz: 'Ddu d tcerkiyin timeqranin i yebṭan yal ass ɣer wagim n yimeẓwara n Lezzayer s Suwaika Dezad' },
  'brands.contactUs':       { ar: 'تواصل معنا',          fr: 'Contactez-nous',    en: 'Contact Us',        tz: 'Nermes-aɣ' },
  'brands.sponsored':       { ar: 'إعلان',               fr: 'Sponsorisé',        en: 'Sponsored',         tz: 'SleDben' },
  'brands.emptySlot':       { ar: 'مساحة متاحة للإعلان',  fr: 'Espace publicitaire disponible', en: 'Advertising slot available', tz: 'Tallunt n usiẓreg yellan' },

  // ── Chat (client ↔ farmer negotiation) ──────────────────────────────────
  'chat.title':             { ar: 'محادثة مع البائع',     fr: 'Discussion avec le vendeur', en: 'Chat with seller', tz: 'Awal d uberr' },
  'chat.withFarmer':        { ar: 'تواصل مع المزارع',     fr: 'Contacter l\'agriculteur', en: 'Chat with farmer', tz: 'Meslay d ufunas' },
  'chat.sendMessage':       { ar: 'إرسال',                fr: 'Envoyer',           en: 'Send',              tz: 'Azen' },
  'chat.typeMessage':       { ar: 'اكتب رسالتك...',       fr: 'Écrivez votre message...', en: 'Type your message...', tz: 'Aru izen-ik...' },
  'chat.suggestedPrices':   { ar: 'أسعار مقترحة للتفاوض', fr: 'Prix suggérés pour négocier', en: 'Suggested prices to negotiate', tz: 'Tisumin yettwasumren i usemsizdeg' },
  'chat.boldOffer':         { ar: 'عرض جريء',             fr: 'Offre audacieuse',  en: 'Bold offer',        tz: 'Tafedniwt tazerfant' },
  'chat.smartOffer':        { ar: 'سعر ذكي',              fr: 'Prix intelligent',  en: 'Smart price',       tz: 'Ssuma tazelɣant' },
  'chat.safeOffer':         { ar: 'عرض آمن',              fr: 'Offre prudente',    en: 'Safe offer',        tz: 'Tafedniwt taɣelsant' },
  'chat.offerSent':         { ar: 'تم إرسال العرض',       fr: 'Offre envoyée',     en: 'Offer sent',        tz: 'Tafedniwt tettwazen' },
  'chat.accept':            { ar: 'قبول',                 fr: 'Accepter',          en: 'Accept',            tz: 'Qbel' },
  'chat.reject':            { ar: 'رفض',                  fr: 'Refuser',           en: 'Reject',            tz: 'Agi' },
  'chat.offerAccepted':     { ar: 'تم قبول العرض!',       fr: 'Offre acceptée !',  en: 'Offer accepted!',   tz: 'Tafedniwt tettwaqbel!' },
  'chat.offerRejected':     { ar: 'تم رفض العرض',         fr: 'Offre refusée',     en: 'Offer rejected',    tz: 'Tafedniwt tettwagi' },
  'chat.noMessages':        { ar: 'لا توجد رسائل بعد. ابدأ التفاوض!', fr: 'Aucun message. Commencez la négociation !', en: 'No messages yet. Start negotiating!', tz: 'Ulac iznan. Bdu usemsizdeg!' },
  'chat.loginToChat':       { ar: 'سجّل الدخول لبدء المحادثة', fr: 'Connectez-vous pour discuter', en: 'Sign in to start chatting', tz: 'Kcem i tbid n umeslay' },
  'chat.private':           { ar: 'محادثة خاصة بينك وبين البائع فقط', fr: 'Conversation privée entre vous et le vendeur', en: 'Private chat between you and the seller only', tz: 'Ameslay uslig gar-ik d uberr' },
  'chat.conversations':     { ar: 'المحادثات',            fr: 'Conversations',     en: 'Conversations',     tz: 'Imsiwalen' },
  'chat.noConversations':   { ar: 'لا توجد محادثات بعد',  fr: 'Aucune conversation', en: 'No conversations yet', tz: 'Ulac imsiwalen' },
  'chat.offerLabel':        { ar: 'عرض',                  fr: 'Offre',             en: 'Offer',             tz: 'Tafedniwt' },
  'chat.smartPriceExplain': { ar: 'السعر الذكي يتناقص كلما اقترب موعد انتهاء الصلاحية', fr: 'Le prix intelligent baisse à mesure que l\'expiration approche', en: 'Smart price decreases as expiry approaches', tz: 'Ssuma tazelɣant tnuddid mi ara yeqqim wakud n tignit' },

  // ── Subscription / dynamic pricing plans ─────────────────────────────────
  'sub.title':              { ar: 'باقة التسعير الديناميكي', fr: 'Plan de tarification dynamique', en: 'Dynamic Pricing Plan', tz: 'Aɣawas n tsumin tazelɣant' },
  'sub.subtitle':           { ar: 'تخصص المنصة تلقائياً سعراً ذكياً لكل منتج يتناقص مع اقتراب موعد انتهاء الصلاحية', fr: 'La plateforme suggère automatiquement un prix intelligent qui baisse à l\'approche de l\'expiration', en: 'The platform auto-suggests a smart price that drops as expiry approaches', tz: 'Tilin tettel s wudem awurman ssuma tazelɣant i yal afaris' },
  'sub.farmerOnly':         { ar: 'هذه الميزة مخصصة للمزارعين فقط', fr: 'Réservé aux agriculteurs', en: 'For farmers only', tz: 'I yifunasen kan' },
  'sub.monthly':            { ar: 'شهري',                  fr: 'Mensuel',           en: 'Monthly',           tz: 'S waggur' },
  'sub.seasonal':           { ar: 'موسمي (3 أشهر)',         fr: 'Saisonnier (3 mois)', en: 'Seasonal (3 months)', tz: 'S tewsit (3 n wagguren)' },
  'sub.annual':             { ar: 'سنوي',                  fr: 'Annuel',            en: 'Annual',            tz: 'S useggas' },
  'sub.perMonth':           { ar: '/ شهرياً',              fr: '/ mois',            en: '/ month',           tz: '/ aggur' },
  'sub.per3Months':         { ar: '/ 3 أشهر',              fr: '/ 3 mois',          en: '/ 3 months',        tz: '/ 3 n wagguren' },
  'sub.perYear':            { ar: '/ سنوياً',              fr: '/ an',              en: '/ year',            tz: '/ useggas' },
  'sub.savePercent':        { ar: 'وفّر',                  fr: 'Économisez',        en: 'Save',              tz: 'Twizi' },
  'sub.popular':            { ar: 'الأكثر شيوعاً',         fr: 'Le plus populaire', en: 'Most popular',      tz: 'Yettwaxedmen aṭas' },
  'sub.subscribe':          { ar: 'اشترك الآن',            fr: 'S\'abonner',        en: 'Subscribe',         tz: 'Multeɣ' },
  'sub.currentPlan':        { ar: 'باقتك الحالية',         fr: 'Votre plan actuel', en: 'Your current plan', tz: 'Aɣawas-ik n tura' },
  'sub.subscribed':         { ar: 'تم الاشتراك بنجاح!',   fr: 'Abonnement réussi !', en: 'Subscribed successfully!', tz: 'Multeɣ yedda!' },
  'sub.featureDynamic':     { ar: 'تسعير ديناميكي تلقائي لكل منتج', fr: 'Tarification dynamique automatique', en: 'Automatic dynamic pricing', tz: 'Tasumint tazelɣant tawurmant' },
  'sub.featureChat':        { ar: 'محادثة وتفاوض مباشر مع العملاء', fr: 'Chat et négociation directs', en: 'Direct chat & negotiation', tz: 'Ameslay d usemsizdeg usrid' },
  'sub.featureAnalytics':   { ar: 'تحليلات المبيعات والتسعير', fr: 'Analyses de ventes', en: 'Sales analytics', tz: 'Tlellit n tiɣin' },
  'sub.featureBadge':       { ar: 'شارة "بائع موثّق" على منتجاتك', fr: 'Badge "Vendeur vérifié"', en: '"Verified Seller" badge', tz: 'Tacreḍt "Aberr yettwamanen"' },
  'sub.featurePriority':    { ar: 'ظهور أولوي في نتائج البحث', fr: 'Affichage prioritaire', en: 'Priority placement', tz: 'Beqqeḍ amezwaru' },
  'sub.featureSupport':     { ar: 'دعم فني مخصص على مدار الساعة', fr: 'Support dédié 24/7', en: 'Dedicated 24/7 support', tz: 'Tallelt 24/7' },
  'sub.loginToSubscribe':   { ar: 'سجّل الدخول كمزارع للاشتراك', fr: 'Connectez-vous en tant qu\'agriculteur', en: 'Sign in as a farmer to subscribe', tz: 'Kcem d afunas i wakken ad multeɣ' },
  'sub.alreadySubscribed':  { ar: 'أنت مشترك بالفعل في باقة', fr: 'Vous êtes déjà abonné', en: 'You\'re already subscribed', tz: 'Tellemdeḍ yakan' },
  'sub.switchPlan':         { ar: 'تبديل الباقة',         fr: 'Changer de plan',   en: 'Switch plan',       tz: 'Snifel aɣawas' },
  'sub.viewPlans':          { ar: 'عرض الباقات',          fr: 'Voir les plans',    en: 'View plans',        tz: 'Wali iɣawasen' },
  'sub.dynamicPricing':     { ar: 'التسعير الديناميكي',   fr: 'Tarification dynamique', en: 'Dynamic Pricing', tz: 'Tasumint tazelɣant' },
  'sub.smartPriceNow':      { ar: 'السعر الذكي الآن',     fr: 'Prix intelligent maintenant', en: 'Smart price now', tz: 'Ssuma tazelɣant tura' },

  // ── Role labels + extended dashboard ─────────────────────────────────────
  'role.admin':             { ar: 'مدير المنصة',          fr: 'Administrateur',    en: 'Admin',             tz: 'Anedbal' },
  'role.farmer':            { ar: 'مزارع',                fr: 'Agriculteur',       en: 'Farmer',            tz: 'Afunas' },
  'role.consumer':          { ar: 'عميل',                 fr: 'Client',            en: 'Customer',          tz: 'Amsaɣ' },
  'dash.adminUsers':        { ar: 'المستخدمون',           fr: 'Utilisateurs',      en: 'Users',             tz: 'Iseqdacen' },
  'dash.adminProducts':     { ar: 'كل المنتجات',          fr: 'Tous les produits', en: 'All Products',      tz: 'Akk ifarisen' },
  'dash.adminOrders':       { ar: 'كل الطلبات',           fr: 'Toutes les commandes', en: 'All Orders',     tz: 'Akk tiludna' },
  'dash.totalUsers':        { ar: 'إجمالي المستخدمين',    fr: 'Total utilisateurs', en: 'Total Users',      tz: 'Asemday n yiseqdacen' },
  'dash.totalRevenue':      { ar: 'إجمالي الإيرادات',     fr: 'Revenus totaux',    en: 'Total Revenue',     tz: 'Asemday n yidrimen' },
  'dash.clientOrders':      { ar: 'طلباتي',               fr: 'Mes commandes',     en: 'My Orders',         tz: 'Tiludna-inu' },
  'dash.clientWishlist':    { ar: 'مفضلتي',               fr: 'Mes favoris',       en: 'My Wishlist',       tz: 'Ismaden-inu' },
  'dash.clientChats':       { ar: 'محادثاتي',             fr: 'Mes discussions',   en: 'My Chats',          tz: 'Imsiwalen-inu' },
  'dash.farmerProducts':    { ar: 'منتجاتي',              fr: 'Mes produits',      en: 'My Products',       tz: 'Ifarisen-inu' },
  'dash.farmerOrders':      { ar: 'الطلبات',              fr: 'Commandes',         en: 'Orders',            tz: 'Tiludna' },
  'dash.farmerChats':       { ar: 'محادثات',              fr: 'Discussions',       en: 'Chats',             tz: 'Imsiwalen' },
  'dash.farmerSubscription': { ar: 'اشتراكي',             fr: 'Mon abonnement',    en: 'My Subscription',   tz: 'Aɣawas-inu' },
  'dash.smartPrice':        { ar: 'السعر الذكي',          fr: 'Prix intelligent',  en: 'Smart Price',       tz: 'Ssuma tazelɣant' },
  'dash.dynamicEnabled':    { ar: 'التسعير الديناميكي مُفعّل', fr: 'Tarification dynamique activée', en: 'Dynamic pricing enabled', tz: 'Tasumint tazelɣant tetteddu' },
  'dash.dynamicDisabled':   { ar: 'التسعير الديناميكي غير مُفعّل — اشترك لتفعيله', fr: 'Tarification dynamique désactivée — abonnez-vous', en: 'Dynamic pricing disabled — subscribe to enable', tz: 'Tasumint tazelɣant tensa — multeɣ' },
  'dash.notSubscribed':     { ar: 'غير مشترك',            fr: 'Non abonné',        en: 'Not subscribed',    tz: 'Ur yelmid ara' },

  // ── Payment methods ─────────────────────────────────────────────────────
  'pay.title':              { ar: 'طريقة الدفع',          fr: 'Mode de paiement', en: 'Payment method',   tz: 'Tarrayt n uxelleṣ' },
  'pay.selectMethod':       { ar: 'اختر طريقة الدفع',     fr: 'Choisissez un mode de paiement', en: 'Select a payment method', tz: 'Fren tarrayt n uxelleṣ' },
  'pay.baridimob':          { ar: 'بريدي موب',            fr: 'BaridiMob',        en: 'BaridiMob',         tz: 'BaridiMob' },
  'pay.baridimobDesc':      { ar: 'الدفع عبر تطبيق بريدي موب من بريد الجزائر', fr: 'Paiement via l\'app BaridiMob d\'Algérie Poste', en: 'Pay via BaridiMob app from Algérie Poste', tz: 'Xelleṣ s usnas BaridiMob' },
  'pay.edahabia':           { ar: 'بطاقة الذهبية',        fr: 'Edahabia',         en: 'Edahabia card',     tz: 'Takaṛdit Edahabia' },
  'pay.edahabiaDesc':       { ar: 'بطاقة الذهبية الوطنية من بريد الجزائر', fr: 'Carte nationale Edahabia', en: 'National Edahabia card', tz: 'Takaṛdit n tmurt Edahabia' },
  'pay.cod':                { ar: 'الدفع عند الاستلام',   fr: 'Paiement à la livraison', en: 'Cash on delivery', tz: 'Xelleṣ mi d-yewweḍ' },
  'pay.codDesc':            { ar: 'ادفع نقداً عند استلام طلبك', fr: 'Payez en espèces à la réception', en: 'Pay cash when you receive your order', tz: 'Xelleṣ s idrimen mi d-tremdeḍ' },

  // ── Commission (5% platform fee) ────────────────────────────────────────
  'commission.label':       { ar: 'عمولة المنصة (5%)',    fr: 'Commission plateforme (5%)', en: 'Platform fee (5%)', tz: 'Taqdiyt n tilin (5%)' },
  'commission.helpText':    { ar: 'تأخذ المنصة 5% من كل عملية بيع لدعم خدماتها', fr: 'La plateforme prélève 5% sur chaque vente', en: 'The platform takes 5% of each sale', tz: 'Tilin tettak 5% deg yal tiɣin' },
  'commission.totalDue':    { ar: 'الإجمالي المستحق',     fr: 'Total dû',          en: 'Total due',         tz: 'Asemday yettwaḥeqqen' },
  'commission.farmerNet':   { ar: 'صافي أرباحك (بعد 5%)', fr: 'Vos gains nets (après 5%)', en: 'Your net earnings (after 5%)', tz: 'Tinufa-ik tinettifen (seld 5%)' },
  'commission.platformRevenue': { ar: 'إيرادات المنصة',   fr: 'Revenus plateforme', en: 'Platform revenue', tz: 'Idrimen n tilin' },

  // ── Delivery ────────────────────────────────────────────────────────────
  'delivery.available':     { ar: 'التوصيل متاح',         fr: 'Livraison disponible', en: 'Delivery available', tz: 'Asiweḍ yella' },
  'delivery.notAvailable':  { ar: 'بدون توصيل',           fr: 'Sans livraison',    en: 'No delivery',       tz: 'Ulac asiweḍ' },
  'delivery.option':        { ar: 'هل تقدم التوصيل؟',     fr: 'Proposez-vous la livraison ?', en: 'Do you offer delivery?', tz: 'Tettmudduḍ asiweḍ?' },
  'delivery.filterLabel':   { ar: 'التوصيل متاح فقط',     fr: 'Livraison disponible uniquement', en: 'Delivery available only', tz: 'Asiweḍ yella kan' },

  // ── Wilaya (province) ───────────────────────────────────────────────────
  'wilaya.label':           { ar: 'الولاية',              fr: 'Wilaya',            en: 'Wilaya (province)', tz: 'Tawilayt' },
  'wilaya.select':          { ar: 'اختر الولاية',         fr: 'Sélectionner wilaya', en: 'Select wilaya',  tz: 'Fren tawilayt' },
  'wilaya.all':             { ar: 'كل الولايات',          fr: 'Toutes les wilayas', en: 'All wilayas',    tz: 'Akk tiwilayin' },
  'wilaya.filterLabel':     { ar: 'تصفية حسب الولاية',    fr: 'Filtrer par wilaya', en: 'Filter by wilaya', tz: 'Sizdeg s twilayt' },
  'wilaya.yourWilaya':      { ar: 'ولايتك',               fr: 'Votre wilaya',      en: 'Your wilaya',       tz: 'Tawilayt-ik' },

  // ── Freshness filter ────────────────────────────────────────────────────
  'freshness.label':        { ar: 'الطراوة',              fr: 'Fraîcheur',         en: 'Freshness',         tz: 'Tamyert' },
  'freshness.any':          { ar: 'الكل',                 fr: 'Toutes',            en: 'Any',               tz: 'Akk' },
  'freshness.fresh':        { ar: 'طازج (أقل من 24 ساعة)', fr: 'Frais (< 24h)',    en: 'Fresh (< 24h)',    tz: 'Amaynut (< 24s)' },
  'freshness.recent':       { ar: 'حديث (أقل من 3 أيام)',  fr: 'Récent (< 3 jours)', en: 'Recent (< 3 days)', tz: 'Nnig (3 n wussan)' },
  'freshness.old':          { ar: 'أكثر من 3 أيام',       fr: 'Plus de 3 jours',   en: 'More than 3 days',  tz: 'Ugar n 3 n wussan' },

  // ── Signup extra fields ─────────────────────────────────────────────────
  'auth.phone':             { ar: 'رقم الهاتف',           fr: 'Téléphone',         en: 'Phone number',      tz: 'Tiliɣri n tiliḍun' },
  'auth.phonePlaceholder':  { ar: 'مثال: 0555 123 456',   fr: 'Ex : 0555 123 456', en: 'e.g. 0555 123 456', tz: 'Amedya: 0555 123 456' },
  'auth.phoneRequired':     { ar: 'رقم الهاتف مطلوب',     fr: 'Le téléphone est requis', en: 'Phone number is required', tz: 'Tiliɣri tettwasra' },
  'auth.phoneInvalid':      { ar: 'رقم الهاتف غير صحيح',  fr: 'Téléphone invalide', en: 'Invalid phone number', tz: 'Tiliɣri ur tgid ara' },
  'auth.hasFarmerCard':     { ar: 'هل تملك بطاقة فلاح؟',   fr: 'Avez-vous une carte fellah ?', en: 'Do you have a Fellah card?', tz: 'Tesɛiḍ takaṛdat fellah?' },
  'auth.hasCommercialReg':  { ar: 'هل تملك سجل تجاري؟',    fr: 'Avez-vous un registre de commerce ?', en: 'Do you have a commercial registry?', tz: 'Tesɛiḍ tajṛa n ttjara?' },
  'auth.yes':               { ar: 'نعم',                  fr: 'Oui',               en: 'Yes',               tz: 'Yah' },
  'auth.no':                { ar: 'لا',                   fr: 'Non',               en: 'No',                tz: 'Ala' },
  'auth.businessInfo':      { ar: 'معلومات العمل',        fr: 'Informations professionnelles', en: 'Business information', tz: 'Talɣut n uxeddim' },
  'auth.businessInfoDesc':  { ar: 'هذه المعلومات تساعد المشترين على الثقة بك', fr: 'Ces informations renforcent la confiance', en: 'This information helps buyers trust you', tz: 'Talɣut-agi teddem imsaɣen ad amnen' },

  // ── Admin dashboard — extended user info ────────────────────────────────
  'admin.phone':            { ar: 'الهاتف',               fr: 'Téléphone',         en: 'Phone',             tz: 'Tiliḍun' },
  'admin.wilaya':           { ar: 'الولاية',              fr: 'Wilaya',            en: 'Wilaya',            tz: 'Tawilayt' },
  'admin.farmerCard':       { ar: 'بطاقة فلاح',           fr: 'Carte fellah',      en: 'Fellah card',       tz: 'Takaṛdat fellah' },
  'admin.commercialReg':    { ar: 'السجل التجاري',        fr: 'Registre commerce', en: 'Commercial reg.',   tz: 'Tajṛa n ttjara' },
  'admin.commissionEarned': { ar: 'العمولة المحصّلة',     fr: 'Commission perçue', en: 'Commission earned', tz: 'Taqdiyt yettwaḥeṛḍen' },
  'admin.totalCommission':  { ar: 'إجمالي عمولة المنصة',  fr: 'Commission totale plateforme', en: 'Total platform commission', tz: 'Asemday n teqdiyt' },
  'admin.name':             { ar: 'الاسم',                fr: 'Nom',               en: 'Name',              tz: 'Isem' },
  'admin.email':            { ar: 'البريد الإلكتروني',    fr: 'E-mail',            en: 'Email',             tz: 'Imayl' },
  'admin.role':             { ar: 'الدور',                fr: 'Rôle',              en: 'Role',              tz: 'Tamlilt' },
  'admin.yes':              { ar: 'نعم',                  fr: 'Oui',               en: 'Yes',               tz: 'Yah' },
  'admin.no':               { ar: 'لا',                   fr: 'Non',               en: 'No',                tz: 'Ala' },

  // ── Role-aware dashboard — extra keys ─────────────────────────────────────
  'nav.subscription':       { ar: 'الاشتراك',             fr: 'Abonnement',        en: 'Subscription',      tz: 'Aɣawas' },
  'auth.roleAdmin':         { ar: 'مدير',                 fr: 'Administrateur',    en: 'Admin',             tz: 'Anedbal' },
  'common.edit':            { ar: 'تعديل',                fr: 'Modifier',          en: 'Edit',              tz: 'Ẓreg' },
  'common.yes':             { ar: 'نعم',                  fr: 'Oui',               en: 'Yes',               tz: 'Yah' },
  'common.no':              { ar: 'لا',                   fr: 'Non',               en: 'No',                tz: 'Ala' },
  'common.login':           { ar: 'تسجيل الدخول',         fr: 'Connexion',         en: 'Sign In',           tz: 'Kcem' },
  'common.viewAll':         { ar: 'عرض الكل',             fr: 'Voir tout',         en: 'View all',          tz: 'Wali akk' },
  'dash.totalCommission':   { ar: 'إجمالي العمولة',       fr: 'Commission totale', en: 'Total commission',  tz: 'Asemday n teqdiyt' },
  'dash.noOrders':          { ar: 'لا توجد طلبات بعد',     fr: 'Aucune commande pour le moment', en: 'No orders yet', tz: 'Ulac tiludna tura' },
  'dash.noChats':           { ar: 'لا توجد محادثات بعد',   fr: 'Aucune discussion pour le moment', en: 'No chats yet', tz: 'Ulac imsiwalen tura' },
  'dash.noWishlist':        { ar: 'قائمة المفضلة فارغة',   fr: 'Votre liste de favoris est vide', en: 'Your wishlist is empty', tz: 'Tabdart n yifenẓanen d tilemt' },
  'dash.totalSpent':        { ar: 'إجمالي الإنفاق',        fr: 'Total dépensé',     en: 'Total spent',       tz: 'Asemday n yexlaṣen' },
  'dash.wishlistCount':     { ar: 'المنتجات المفضّلة',     fr: 'Produits favoris',  en: 'Wishlisted items',  tz: 'Ifarisen yifen' },
  'dash.chatsCount':        { ar: 'المحادثات النشطة',      fr: 'Discussions actives', en: 'Active chats',   tz: 'Imsiwalen urdimin' },
  'dash.deliveryAvailable': { ar: 'التوصيل متاح',          fr: 'Livraison disponible', en: 'Delivery available', tz: 'Asiweḍ yella' },
  'dash.deliveryUnavailable':{ ar: 'بدون توصيل',           fr: 'Sans livraison',    en: 'No delivery',       tz: 'War asiweḍ' },
  'dash.inStock':           { ar: 'متوفر',                fr: 'En stock',          en: 'In stock',          tz: 'Yella' },
  'dash.viewProduct':       { ar: 'عرض المنتج',           fr: 'Voir le produit',   en: 'View product',      tz: 'Wali afaris' },
  'dash.openChat':          { ar: 'فتح المحادثة',          fr: 'Ouvrir la discussion', en: 'Open chat',      tz: 'Ldi ameslay' },
  'dash.farmerEmail':       { ar: 'بريد المزارع',          fr: 'E-mail agriculteur', en: 'Farmer email',     tz: 'Imayl n ufunas' },
  'dash.conversations':     { ar: 'المحادثات',            fr: 'Conversations',     en: 'Conversations',     tz: 'Imsiwalen' },
  'dash.lastMessage':       { ar: 'آخر رسالة',            fr: 'Dernier message',   en: 'Last message',      tz: 'Izri aneggaru' },
  'dash.messages':          { ar: 'رسائل',                fr: 'messages',          en: 'messages',          tz: 'yiznan' },
  'dash.loginRequired':     { ar: 'يلزم تسجيل الدخول',     fr: 'Connexion requise', en: 'Login required',    tz: 'Kcem ilaq' },
  'dash.loginPrompt':       { ar: 'سجّل الدخول للوصول إلى لوحة التحكم الخاصة بك', fr: 'Connectez-vous pour accéder à votre tableau de bord', en: 'Sign in to access your personal dashboard', tz: 'Kcem akken ad tekkeḍ ɣer tefelwit-ik n usefrek' },
  'dash.testAccounts':      { ar: 'حسابات تجريبية',        fr: 'Comptes de démonstration', en: 'Demo accounts', tz: 'Imiḍanen n usekyed' },
  'dash.goToLogin':         { ar: 'الذهاب لتسجيل الدخول',  fr: 'Aller à la connexion', en: 'Go to sign in',  tz: 'Ddu ɣer ukcum' },
  'dash.subscriptionActive':{ ar: 'اشتراكك مفعّل حالياً',   fr: 'Votre abonnement est actif', en: 'Your subscription is active', tz: 'Aɣawas-ik yedda tura' },
  'dash.manageSubscription':{ ar: 'إدارة الاشتراك',        fr: 'Gérer l\'abonnement', en: 'Manage subscription', tz: 'Sefrek aɣawas' },
  'dash.smartPricePreview': { ar: 'معاينة السعر الذكي',    fr: 'Aperçu du prix intelligent', en: 'Smart price preview', tz: 'Timeẓri n tsuma tazelɣant' },
  'dash.deliveryToggle':    { ar: 'التوصيل متاح',          fr: 'Livraison disponible', en: 'Delivery available', tz: 'Asiweḍ yella' },

  // ── Image upload (AddProductModal) ──────────────────────────────────────
  'dash.imageLabel':        { ar: 'صورة المنتج',           fr: 'Image du produit',  en: 'Product image',     tz: 'Tugna n ufarris' },
  'dash.imageHint':         { ar: 'PNG أو JPG، أقل من 5 ميغا', fr: 'PNG ou JPG, moins de 5 Mo', en: 'PNG or JPG, under 5MB', tz: 'PNG neɣ JPG, ddaw 5Mo' },
  'dash.imagePick':         { ar: 'اختر صورة',             fr: 'Choisir une image', en: 'Pick an image',     tz: 'Fren tugna' },
  'dash.imageReplace':      { ar: 'تغيير الصورة',          fr: 'Changer l\'image',  en: 'Replace image',     tz: 'Snifel tugna' },
  'dash.uploading':         { ar: 'جارٍ رفع الصورة...',     fr: 'Téléversement...',  en: 'Uploading...',      tz: 'Tuzi n tugna...' },
  'dash.uploadSuccess':     { ar: 'تم رفع الصورة',         fr: 'Image téléversée',  en: 'Image uploaded',    tz: 'Tugna tettuzi' },
  'dash.uploadError':       { ar: 'فشل رفع الصورة',        fr: 'Échec du téléversement', en: 'Upload failed', tz: 'Yennaẓa tuzi' },
  'dash.imageRequired':     { ar: 'يرجى رفع صورة للمنتج',  fr: 'Veuillez téléverser une image', en: 'Please upload a product image', tz: 'Ttxil-k zzi tugna i ufarris' },
  'dash.fillRequired':      { ar: 'يرجى ملء جميع الحقول المطلوبة', fr: 'Veuillez remplir tous les champs requis', en: 'Please fill in all required fields', tz: 'Ttxil-k ččar akk urtan yettwasran' },

  // ── Loading / error / sign-out ──────────────────────────────────────────
  'dash.fetchError':        { ar: 'تعذّر تحميل البيانات',   fr: 'Échec du chargement', en: 'Failed to load data', tz: 'Yennaẓa asali' },
  'dash.fetchErrorDesc':    { ar: 'تحقّق من اتصالك بالإنترنت ثم أعد المحاولة', fr: 'Vérifiez votre connexion et réessayez', en: 'Check your connection and try again', tz: 'Senqed tuqqna-ik sakin ales' },
  'dash.retry':             { ar: 'إعادة المحاولة',        fr: 'Réessayer',         en: 'Retry',             tz: 'Ales' },
  'dash.welcomeBack':       { ar: 'أهلاً بك',              fr: 'Bienvenue',         en: 'Welcome',           tz: 'Anṣuf' },
  'dash.signOut':           { ar: 'تسجيل الخروج',          fr: 'Se déconnecter',    en: 'Sign out',          tz: 'Ffeɣ' },

  // ── Admin commission breakdown ──────────────────────────────────────────
  'dash.adminCommission':   { ar: 'العمولة',               fr: 'Commission',        en: 'Commission',        tz: 'Taqdiyt' },
  'dash.commissionBreakdown': { ar: 'تفصيل العمولة',        fr: 'Détail de la commission', en: 'Commission breakdown', tz: 'Aglam n teqdiyt' },
  'dash.thisMonthCommission': { ar: 'عمولة هذا الشهر',     fr: 'Commission ce mois', en: "This month's commission", tz: 'Taqdiyt n waggur-agi' },
  'dash.fromXOrders':       { ar: 'من {count} طلب',        fr: 'Sur {count} commandes', en: 'From {count} orders', tz: 'Seg {count} n tludna' },
  'dash.noUsers':           { ar: 'لا يوجد مستخدمون بعد',   fr: 'Aucun utilisateur', en: 'No users yet',      tz: 'Ulac iseclkac' },
  'dash.noProductsAdmin':   { ar: 'لا توجد منتجات بعد',    fr: 'Aucun produit',     en: 'No products yet',   tz: 'Ulac ifarisen' },
  'dash.avgOrder':          { ar: 'متوسط قيمة الطلب',      fr: 'Valeur moyenne',    en: 'Avg. order value',  tz: 'Azlem n tludna' },

  // ── Smart filter chip ───────────────────────────────────────────────────
  'filter.title':           { ar: 'تصفية متقدمة',         fr: 'Filtres avancés',   en: 'Advanced filters',  tz: 'Sizdeg leqqayen' },
  'filter.deliveryOnly':    { ar: 'مع توصيل فقط',         fr: 'Avec livraison uniquement', en: 'With delivery only', tz: 'S asiweḍ kan' },
  'filter.datesOnly':       { ar: 'تمور فقط',             fr: 'Dattes uniquement', en: 'Dates only',        tz: 'Tifeywin kan' },
  'filter.reset':           { ar: 'إعادة تعيين',          fr: 'Réinitialiser',     en: 'Reset',             tz: 'Ales-as iwennez' },
}

// ═══════════════════════════════════════════════════════════════════════════
// i18n context
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'suwaika-lang'
const DEFAULT_LANG = 'ar'

function detectInitialLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && LANGUAGES.some((l) => l.code === stored)) return stored
  const nav = navigator.language?.split('-')[0]
  if (nav && LANGUAGES.some((l) => l.code === nav)) return nav
  return DEFAULT_LANG
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang)

  const meta = useMemo(
    () => LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0],
    [lang]
  )

  // Apply <html lang> + dir + body data-lang attribute
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = meta.dir
    document.body.setAttribute('data-lang', lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang, meta.dir])

  const t = useCallback(
    (key, vars) => {
      const entry = dict[key]
      let str = entry?.[lang] ?? entry?.en ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
        }
      }
      return str
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t, dir: meta.dir, languages: LANGUAGES }), [lang, t, meta.dir])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
