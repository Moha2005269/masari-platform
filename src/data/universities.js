// Saudi Universities Rankings and Admission Requirements
export const SAUDI_UNIVERSITIES = [
  { 
    id: 'ksu', ar: 'جامعة الملك سعود (KSU)', en: 'King Saud University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Public', typeEn: 'Public', 
    qs: 143, the: 251, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 88, 
    descAr: 'High competition, leading in Health & Engineering.', descEn: 'High competition, leading in Health & Engineering.', 
    color: 'var(--accent-mint)', icon: '🏛️', tracks: { ar: 'صحي، علمي، إنساني', en: 'Health, Science, Humanities' } 
  },
  { 
    id: 'kfupm', ar: 'جامعة الملك فهد للبترول (KFUPM)', en: 'KFUPM', 
    cityAr: 'Dhahran', cityEn: 'Dhahran', typeAr: 'Public', typeEn: 'Public', 
    qs: 160, the: 201, req: 'الثانوية 20% | القدرات 30% | التحصيلي 50%', score: 91, 
    descAr: 'Top ranked globally for Petroleum, Engineering & Tech.', descEn: 'Top ranked globally for Petroleum, Engineering & Tech.', 
    color: 'var(--accent-peach)', icon: '🔬', tracks: { ar: 'هندسي، حاسب، أعمال', en: 'Engineering, Computer Science, Business' } 
  },
  { 
    id: 'kau', ar: 'جامعة الملك عبدالعزيز (KAU)', en: 'King Abdulaziz University', 
    cityAr: 'Jeddah', cityEn: 'Jeddah', typeAr: 'Public', typeEn: 'Public', 
    qs: 143, the: 251, req: 'الثانوية 40% | القدرات 30% | التحصيلي 30%', score: 85, 
    descAr: 'Renowned for Business Administration and Applied Sciences.', descEn: 'Renowned for Business Administration and Applied Sciences.', 
    color: 'var(--accent-lilac)', icon: '🌊', tracks: { ar: 'علمي، إداري، صحي', en: 'Science, Admin, Health' } 
  },
  { 
    id: 'iau', ar: 'جامعة الإمام عبدالرحمن بن فيصل', en: 'Imam Abdulrahman Bin Faisal Univ', 
    cityAr: 'Dammam', cityEn: 'Dammam', typeAr: 'Public', typeEn: 'Public', 
    qs: 400, the: 501, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 86, 
    descAr: 'Highly competitive Health and Medicine tracks in the East.', descEn: 'Highly competitive Health and Medicine tracks in the East.', 
    color: 'var(--accent-yellow)', icon: '🏥', tracks: { ar: 'صحي، هندسي، إنساني', en: 'Health, Engineering, Humanities' } 
  },
  { 
    id: 'pnu', ar: 'جامعة الأميرة نورة (PNU)', en: 'Princess Nourah University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Public', typeEn: 'Public', 
    qs: 600, the: 601, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 83, 
    descAr: 'Leading global womens university with Tech and Health focus.', descEn: 'Leading global womens university with Tech and Health focus.', 
    color: 'var(--accent-coral)', icon: '👩‍🎓', tracks: { ar: 'صحي، علمي، إنساني', en: 'Health, Science, Humanities' } 
  },
  { 
    id: 'psu', ar: 'جامعة الأمير سلطان (PSU)', en: 'Prince Sultan University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Private', typeEn: 'Private', 
    qs: 500, the: 601, req: 'يعتمد على المقابلة والمعدل التراكمي العالي', score: 80, 
    descAr: 'Leading private university for Business and Law in KSA.', descEn: 'Leading private university for Business and Law in KSA.', 
    color: 'var(--bg-secondary)', icon: '💼', tracks: { ar: 'إدارة، قانون، حاسب', en: 'Business, Law, Computer Science' } 
  },
  { 
    id: 'alfaisal', ar: 'جامعة الفيصل', en: 'Alfaisal University', 
    cityAr: 'Riyadh', cityEn: 'Riyadh', typeAr: 'Private', typeEn: 'Private', 
    qs: 800, the: 301, req: 'المعدل التراكمي + اختبارات القبول الدولية', score: 82, 
    descAr: 'Highly ranked medical and business programs with global ties.', descEn: 'Highly ranked medical and business programs with global ties.', 
    color: 'var(--accent-mint)', icon: '🧬', tracks: { ar: 'طب، أعمال، هندسة', en: 'Medicine, Business, Engineering' } 
  },
  { 
    id: 'uqu', ar: 'جامعة أم القرى (UQU)', en: 'Umm Al-Qura University', 
    cityAr: 'Makkah', cityEn: 'Makkah', typeAr: 'Public', typeEn: 'Public', 
    qs: 500, the: 601, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 84, 
    descAr: 'Deep history, leading in Islamic studies, Medicine and Tech.', descEn: 'Deep history, leading in Islamic studies, Medicine and Tech.', 
    color: 'var(--accent-peach)', icon: '🕌', tracks: { ar: 'شرعي، صحي، هندسي', en: 'Islamic Studies, Health, Engineering' } 
  },
  { 
    id: 'kku', ar: 'جامعة الملك خالد (KKU)', en: 'King Khalid University', 
    cityAr: 'Abha', cityEn: 'Abha', typeAr: 'Public', typeEn: 'Public', 
    qs: 700, the: 501, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 81, 
    descAr: 'Largest university in the south with strong Tech/Eng tracks.', descEn: 'Largest university in the south with strong Tech/Eng tracks.', 
    color: 'var(--accent-lilac)', icon: '⛰️', tracks: { ar: 'صحي، علمي، نظري', en: 'Health, Science, Theoretical' } 
  },
  { 
    id: 'qassim', ar: 'جامعة القصيم', en: 'Qassim University', 
    cityAr: 'Qassim', cityEn: 'Qassim', typeAr: 'Public', typeEn: 'Public', 
    qs: 800, the: 801, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 81, 
    descAr: 'Massive campus leading in Agriculture, Medicine, and Engineering.', descEn: 'Massive campus leading in Agriculture, Medicine, and Engineering.', 
    color: 'var(--accent-yellow)', icon: '🌴', tracks: { ar: 'صحي، زراعي، علمي', en: 'Health, Agriculture, Science' } 
  },
  { 
    id: 'taibah', ar: 'جامعة طيبة', en: 'Taibah University', 
    cityAr: 'Madinah', cityEn: 'Madinah', typeAr: 'Public', typeEn: 'Public', 
    qs: 1000, the: 1001, req: 'الثانوية 30% | القدرات 30% | التحصيلي 40%', score: 82, 
    descAr: 'Rapid growth in Health, Business, and IT sectors.', descEn: 'Rapid growth in Health, Business, and IT sectors.', 
    color: 'var(--accent-coral)', icon: '🕊️', tracks: { ar: 'صحي، إداري، علمي', en: 'Health, Admin, Science' } 
  },
  { 
    id: 'kaust', ar: 'جامعة الملك عبدالله (KAUST)', en: 'KAUST', 
    cityAr: 'Thuwal', cityEn: 'Thuwal', typeAr: 'Public', typeEn: 'Public', 
    qs: 113, the: 201, req: 'شروط عليا وبرامج موهبة والمعدل المرتفع', score: 95, 
    descAr: 'Elite research institution opening highly selective undergrad programs.', descEn: 'Elite research institution opening highly selective undergrad programs.', 
    color: 'var(--bg-secondary)', icon: '🧪', tracks: { ar: 'أبحاث علمية، هندسة متقدمة', en: 'Advanced Science & Engineering' } 
  }

];
