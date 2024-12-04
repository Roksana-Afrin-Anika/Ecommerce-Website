import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Retrieve the saved language or default to English
const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        aboutUs: "About Us",
        login: "Login",
        signup: "Sign Up",
        search: "Search...",
        OurVision: "Our Vision",
        OV: "Welcome to Grab It – your trusted destination for premium quality products, ranging from skincare essentials to cutting-edge electronics. We believe in delivering a curated selection of top-notch products that enrich your daily life, all at competitive prices.",
        WhyChooseUs: "Why Choose Us?",
        WCU: `<ul>
                <li><strong>Curated Quality:</strong> Every product on our platform is selected for its quality, durability, and performance.</li>
                <li><strong>Customer-Centric Service:</strong> Our dedicated customer support team is always ready to assist you and ensure a smooth shopping experience.</li>
                <li><strong>Fast Delivery:</strong> With efficient shipping partners, we guarantee timely delivery of your orders.</li>
                <li><strong>Affordable Pricing:</strong> We strive to offer competitive prices without compromising on quality.</li>
              </ul>`,
      },
    },
    hi: {
      translation: {
        aboutUs: "हमारे बारे में",
        login: "लॉग इन करें",
        signup: "साइन अप करें",
        search: "खोजें...",
        OurVision: "हमारी दृष्टि",
        OV: "ग्रैब इट में आपका स्वागत है – यहाँ आपको प्रीमियम गुणवत्ता वाले उत्पाद मिलते हैं, जो स्किनकेयर essentials से लेकर अत्याधुनिक इलेक्ट्रॉनिक्स तक हैं। हम यह मानते हैं कि हम आपकी दैनिक जिंदगी को समृद्ध बनाने वाले उच्च गुणवत्ता वाले उत्पादों का चयन, प्रतिस्पर्धी कीमतों पर, प्रदान करें।",
        WhyChooseUs: "हमें क्यों चुनें?",
        WCU: `<ul>
                <li><strong>चयनित गुणवत्ता:</strong> हमारे प्लेटफॉर्म पर हर उत्पाद को उसकी गुणवत्ता, स्थायित्व, और प्रदर्शन के आधार पर चुना गया है।</li>
                <li><strong>ग्राहक-केंद्रित सेवा:</strong> हमारी समर्पित ग्राहक सहायता टीम हमेशा आपकी सहायता के लिए तैयार रहती है और सुनिश्चित करती है कि आपकी शॉपिंग का अनुभव सुचारू हो।</li>
                <li><strong>तेजी से डिलीवरी:</strong> प्रभावी शिपिंग भागीदारों के साथ, हम आपके ऑर्डर की समय पर डिलीवरी की गारंटी देते हैं।</li>
                <li><strong>सस्ती कीमतें:</strong> हम गुणवत्ता से समझौता किए बिना प्रतिस्पर्धी कीमतें प्रदान करने का प्रयास करते हैं।</li>
              </ul>`,
      },
    },
    ban: {
      translation: {
        aboutUs: "আমাদের সম্পর্কে",
        login: "প্রবেশ করুন",
        signup: "নিবন্ধন করুন",
        search: "অনুসন্ধান করুন...",
        OurVision: "আমাদের লক্ষ্য",
        OV: "গ্র্যাব ইট-এ আপনাকে স্বাগতম – এখানে আপনি পাবেন প্রিমিয়াম মানের পণ্য, যা স্কিনকেয়ার অপরিহার্য থেকে শুরু করে আধুনিক ইলেকট্রনিক্স পর্যন্ত। আমরা বিশ্বাস করি যে আমরা আপনার দৈনন্দিন জীবনে সমৃদ্ধি আনতে সাহায্য করার জন্য শীর্ষ মানের পণ্যের একটি নির্বাচিত সংগ্রহ, প্রতিযোগিতামূলক দামে, প্রদান করি।",
        WhyChooseUs: "আমাদের কেন নির্বাচন করবেন?",
        WCU: `<ul>
                <li><strong>নির্বাচিত গুণমান:</strong> আমাদের প্ল্যাটফর্মের প্রতিটি পণ্য তার গুণমান, স্থায়িত্ব, এবং কর্মক্ষমতার জন্য নির্বাচিত।</li>
                <li><strong>গ্রাহক-কেন্দ্রিক সেবা:</strong> আমাদের নিবেদিত গ্রাহক সহায়তা দল সর্বদা আপনাকে সহায়তা করতে প্রস্তুত এবং একটি মসৃণ শপিং অভিজ্ঞতা নিশ্চিত করে।</li>
                <li><strong>দ্রুত ডেলিভারি:</strong> দক্ষ শিপিং পার্টনারদের সঙ্গে, আমরা আপনার অর্ডারের সময়মতো ডেলিভারির গ্যারান্টি প্রদান করি।</li>
                <li><strong>সাশ্রয়ী মূল্য:</strong> আমরা গুণমানে কোনো আপোষ না করে প্রতিযোগিতামূলক মূল্য প্রদান করার চেষ্টা করি।</li>
              </ul>`,
      },
    },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
