# 🧭 Masari — Academic & Career Path Advisor

<p align="left">
  <img src="https://img.shields.io/badge/Vite-v8.0-B73BFE?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-v19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-v1beta-1A73E8?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/License-MIT-4fb922?style=for-the-badge" alt="License" />
</p>

---

## 📸 Interface Preview

![Masari Platform Landing Page](public/screenshots/landing_page.png)

---

## 🚀 English — Overview & Documentation

**Masari** is an advanced academic planning and professional trajectory counselor application customized for students and professionals in the Gulf/Saudi region. Built using a **Neo-Brutalist 3D style guide**, it features interactive cursor eye-tracking, magnetic physics, and 3D tilting card structures, connected to the **Google Gemini 2.5 Flash** developer API.

### 🌟 Key Modules

*   **🧠 RIASEC Career Test**: Complete a 50-question personality matrix mapping answers to 100+ academic majors. Receives a comprehensive AI counselor analysis summary.
*   **🏫 Saudi University Directory**: An interactive directory containing Saudi university admission requirements (weighted criteria), local rankings, and acceptance difficulties (free). Also features an **AI Deep Search** for international criteria (costs 5 points).
*   **📊 Live Web-Grounded Salaries**: Performs real-time salary indexing (Glassdoor, Payscale, and Indeed integrations) based on major, skills, and target region.
*   **💳 Stripe Sandbox portal**: Full checkout simulator to buy credits or upgrade subscription tiers using mock credit card detail checks.
*   **💬 AI Counselor Chatroom**: Talk directly with a creative advisor chatbot answering educational and career queries.
*   **🛠️ Developer Debug Button**: Instantly injector to add +100 testing points to active profiles.

### ⚙️ Quick Installation

1.  **Clone & Enter Workspace**:
    ```bash
    git clone https://github.com/Moha2005269/masari-platform.git
    cd masari-platform
    ```

2.  **Install Node Modules**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables** (`.env`):
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run Dev Server**:
    ```bash
    npm run dev
    ```

---

<br>

## 🚀 العربية — نظرة عامة والتوثيق

منصة **مساري** هي مستشار أكاديمي ومهني متطور يقدم توجيهات تفاعلية مخصصة للطلاب والمهنيين في المملكة العربية السعودية والخليج العربي. تعتمد المنصة على لغة بصرية فريدة تجمع بين **التصميم النيو-بروتالي ثلاثي الأبعاد** (Neo-Brutalist 3D) وأحدث تقنيات تتبع حركة المؤشر بالعين، والأزرار المغناطيسية، والبطاقات ثلاثية الأبعاد الإمالة، مع تكامل كامل مع نموذج **Google Gemini 2.5 Flash**.

### 🌟 الأقسام الرئيسية للمنصة

*   **🧠 اختبار الميول المهنية RIASEC**: تقييم شامل من 50 سؤالاً يربط النتيجة بأكثر من 100 تخصص أكاديمي مع تحليل مهني مدعوم بالذكاء الاصطناعي.
*   **🏫 دليل الجامعات السعودية**: دليل متكامل يشمل شروط القبول، النسب الموزونة، والصعوبة مجاناً، مع ميزة **البحث الذكي بالذكاء الاصطناعي** للجامعات العالمية وشروطها (بقيمة 5 نقاط).
*   **📊 مؤشر رواتب وتوقعات سوق العمل**: محاكي أجور فوري مدعوم بالبحث السحابي المباشر لتقدير رواتب المهن بالعملات المحلية بناءً على التخصص، المهارات، والمنطقة المستهدفة.
*   **💳 بوابة دفع افتراضية Stripe**: محاكي متكامل لعمليات الدفع والترقيات عبر بطاقات الائتمان لتجربة شحن النقاط وفتح الميزات.
*   **💬 غرف المحادثة مع المستشار الذكي**: مستشار ذكي فوري يجيب على الاستشارات الدراسية والمهنية بدقة عالية.
*   **🛠️ شريط تجربة المطورين**: زر مخفي يتيح شحن 100 نقطة مجانية فوراً لتسهيل اختبار الميزات.

### ⚙️ خطوات التثبيت السريع

1.  **نسخ المستودع**:
    ```bash
    git clone https://github.com/Moha2005269/masari-platform.git
    cd masari-platform
    ```

2.  **تثبيت الحزم**:
    ```bash
    npm install
    ```

3.  **تهيئة ملف البيئة** (`.env`):
    أدخل مفاتيح Firebase و Gemini API الخاصة بك كما هو موضح في قسم التثبيت باللغة الإنجليزية أعلاه.

4.  **تشغيل الخادم المحلي**:
    ```bash
    npm run dev
    ```
