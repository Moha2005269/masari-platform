import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const useSaveReport = (userProfile, setUserProfile, onSaveProfile, showToast, isAr) => {
  const saveReport = async (title, content) => {
    if (!userProfile.isLoggedIn) {
      showToast(isAr ? 'يجب تسجيل الدخول لحفظ التقارير!' : 'You must be logged in to save reports!');
      return;
    }
    
    try {
      const appId = 'masari-academic-decoder';
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user object");

      const docData = {
        title,
        content,
        date: new Date().toISOString(),
      };
      
      const reportsRef = collection(firestore, 'artifacts', appId, 'users', user.uid, 'saved_reports');
      await addDoc(reportsRef, docData);
      
      showToast(isAr ? 'تم حفظ التقرير بنجاح! تجده في قائمة تقاريرك.' : 'Report saved to your artifacts successfully!');
    } catch(e) {
      console.error(e);
      showToast(isAr ? 'حدث خطأ أثناء حفظ التقرير.' : 'Error saving report.');
    }
  };

  return saveReport;
};
