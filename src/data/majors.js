// College Majors Data (100 Majors mapping to RIASEC profiles)
export const generate100Majors = () => {
  const rawData = [
    "CS|Computer Science|علوم الحاسب|2,5,3,1,2,4", "SE|Software Engineering|هندسة البرمجيات|2,5,2,1,3,4",
    "AI|Artificial Intelligence|الذكاء الاصطناعي|1,5,3,1,2,4", "CY|Cybersecurity|الأمن السيبراني|2,5,1,1,3,5",
    "DS|Data Science|علوم البيانات|1,5,2,1,2,5", "IS|Information Systems|نظم المعلومات|1,4,1,2,4,5",
    "MED|Medicine & Surgery|الطب والجراحة|4,5,1,5,2,3", "DEN|Dentistry|طب الأسنان|4,4,3,4,2,3",
    "PHA|Pharmacy|الصيدلة|3,5,1,3,2,5", "NUR|Nursing|التمريض|3,2,1,5,1,3",
    "PT|Physical Therapy|العلاج الطبيعي|3,3,1,5,1,2", "NUT|Clinical Nutrition|التغذية السريرية|2,4,1,4,2,3",
    "ARC|Architecture|الهندسة المعمارية|3,4,5,2,3,2", "CE|Civil Engineering|الهندسة المدنية|4,4,2,1,3,3",
    "ME|Mechanical Engineering|الهندسة الميكانيكية|5,4,1,1,2,3", "EE|Electrical Engineering|الهندسة الكهربائية|4,5,1,1,2,3",
    "CHE|Chemical Engineering|الهندسة الكيميائية|3,5,1,1,2,3", "AER|Aerospace Engineering|هندسة الطيران|4,5,2,1,2,3",
    "BME|Biomedical Engineering|الهندسة الطبية الحيوية|3,5,2,2,2,3", "BUS|Business Administration|إدارة الأعمال|1,2,2,3,5,4",
    "FIN|Finance|المالية|1,4,1,1,4,5", "ACC|Accounting|المحاسبة|1,3,1,1,3,5",
    "MKT|Marketing|التسويق|1,2,4,3,5,2", "HR|Human Resources|الموارد البشرية|1,2,2,5,4,3",
    "ECO|Economics|الاقتصاد|1,5,1,1,3,4", "LAW|Law & Jurisprudence|القانون والأنظمة|1,4,3,4,5,3",
    "PSY|Psychology|علم النفس|1,4,2,5,2,2", "SOC|Sociology|علم الاجتماع|1,4,2,4,2,2",
    "EDU|Education & Teaching|التعليم والتربية|2,2,3,5,3,3", "ART|Fine Arts|الفنون الجميلة|2,2,5,1,1,1",
    "DES|Graphic Design|التصميم الجرافيكي|2,3,5,1,2,2", "ID|Interior Design|التصميم الداخلي|3,3,5,2,3,2",
    "JOU|Journalism|الصحافة والإعلام|1,3,4,3,4,2", "PR|Public Relations|العلاقات العامة|1,2,3,4,5,2",
    "LIN|Linguistics|اللغويات واللغات|1,4,3,3,2,3", "ENG|English Literature|الأدب الإنجليزي|1,3,5,2,1,2",
    "HIS|History|التاريخ|1,4,2,2,1,3", "GEO|Geography|الجغرافيا|2,4,1,1,1,3",
    "POL|Political Science|العلوم السياسية|1,4,2,3,5,2", "PHY|Physics|الفيزياء|2,5,1,1,1,3",
    "CHM|Chemistry|الكيمياء|3,5,1,1,1,3", "BIO|Biology|الأحياء|3,5,1,1,1,3",
    "MAT|Mathematics|الرياضيات|1,5,1,1,1,4", "STA|Statistics|الإحصاء|1,5,1,1,2,5",
    "AST|Astronomy|علم الفلك|1,5,2,1,1,3", "VET|Veterinary Medicine|الطب البيطري|4,4,1,3,1,3",
    "AGR|Agriculture|الزراعة|4,3,1,1,2,2", "ENV|Environmental Science|العلوم البيئية|3,4,1,2,2,2",
    "MAR|Marine Biology|علم الأحياء البحرية|3,4,1,1,1,2", "FOR|Forestry|الغابات|4,3,1,1,2,2",
    "HOS|Hospitality Management|إدارة الضيافة|2,1,2,4,4,3", "CUL|Culinary Arts|فنون الطهي|4,2,4,2,3,2",
    "SPO|Sports Management|الإدارة الرياضية|3,1,1,3,5,3", "KIN|Kinesiology|علم الحركة|4,3,1,4,2,2",
    "AVI|Aviation/Aeronautics|الطيران|4,3,1,2,3,4", "LOG|Logistics & Supply Chain|سلاسل الإمداد اللوجستية|2,3,1,2,4,5",
    "RE|Real Estate|العقارات|1,2,1,3,5,3", "INS|Insurance & Risk Management|التأمين وإدارة المخاطر|1,4,1,2,4,5",
    "ACT|Actuarial Science|العلوم الاكتوارية|1,5,1,1,3,5", "PUB|Public Administration|الإدارة العامة|1,3,1,4,4,4",
    "SW|Social Work|الخدمة الاجتماعية|1,2,1,5,2,3", "CRI|Criminology|علم الجريمة|2,4,1,3,3,4",
    "ANT|Anthropology|الأنثروبولوجيا|2,4,2,3,1,2", "ARC2|Archaeology|الآثار|3,4,2,1,1,3",
    "PHI|Philosophy|الفلسفة|1,5,3,1,1,2", "THE|Theology/Islamic Studies|الدراسات الإسلامية والشريعة|1,4,2,4,3,3",
    "MUS|Music|الموسيقى|2,2,5,1,2,1", "THT|Theater & Drama|المسرح والدراما|2,2,5,3,3,1",
    "FIL|Film & Television|السينما والتلفزيون|3,3,5,2,4,2", "ANI|Animation|الرسوم المتحركة|2,3,5,1,2,3",
    "PHO|Photography|التصوير الفوتوغرافي|3,2,5,1,2,2", "FAS|Fashion Design|تصميم الأزياء|3,2,5,2,3,2",
    "IND|Industrial Design|التصميم الصناعي|4,3,5,1,3,2", "URB|Urban Planning|التخطيط العمراني|2,4,3,2,4,3",
    "SUP|Supply Chain Management|إدارة سلاسل التوريد|1,4,1,2,4,5", "MIS|Management Information Systems|نظم المعلومات الإدارية|1,4,1,2,4,5",
    "ECOM|E-Commerce|التجارة الإلكترونية|1,3,2,2,5,4", "ENT|Entrepreneurship|ريادة الأعمال|1,3,4,3,5,3",
    "INT|International Business|الأعمال الدولية|1,3,2,3,5,3", "PUBH|Public Health|الصحة العامة|1,4,1,4,3,3",
    "HCA|Health Care Administration|إدارة الرعاية الصحية|1,3,1,4,4,4", "RAD|Radiologic Technology|تقنية الأشعة|4,3,1,3,1,4",
    "RES|Respiratory Therapy|العلاج التنفسي|3,3,1,4,1,3", "OPT|Optometry|البصريات|3,4,1,4,2,3",
    "AUD|Audiology|السمعيات|2,4,1,4,1,3", "SLP|Speech-Language Pathology|أمراض التخاطب|1,3,1,5,1,3",
    "GEN|Genetics|علم الوراثة|2,5,1,1,1,4", "NEU|Neuroscience|علم الأعصاب|2,5,1,1,1,3",
    "BCH|Biochemistry|الكيمياء الحيوية|3,5,1,1,1,4", "ZOO|Zoology|علم الحيوان|3,4,1,1,1,2",
    "BOT|Botany|علم النبات|3,4,1,1,1,3", "MBI|Microbiology|علم الأحياء الدقيقة|3,5,1,1,1,4",
    "IMM|Immunology|علم المناعة|2,5,1,1,1,3", "PHA2|Pharmacology|علم الأدوية|2,5,1,1,1,4",
    "TOX|Toxicology|علم السموم|2,5,1,1,1,4", "GEO2|Geology|الجيولوجيا|4,4,1,1,2,2",
    "MET|Meteorology|الأرصاد الجوية|2,4,1,1,1,3", "OCE|Oceanography|علم المحيطات|3,4,1,1,2,2",
    "MSE|Materials Science & Engineering|هندسة المواد|3,5,1,1,2,3", "NUC|Nuclear Engineering|الهندسة النووية|3,5,1,1,2,4"
  
  ];
  return rawData.map(line => {
    const [id, en, ar, scores] = line.split('|');
    const [R, I, A, S, E, C] = scores.split(',').map(Number);
    return { id, en, ar, p: { R, I, A, S, E, C } };
  });
};
