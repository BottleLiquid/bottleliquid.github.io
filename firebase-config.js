<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBgppLaWv-3M9IsCzUtDD5Z8pqUxPtdPLk",
    authDomain: "liquidtipe.firebaseapp.com",
    projectId: "liquidtipe",
    storageBucket: "liquidtipe.firebasestorage.app",
    messagingSenderId: "765092878295",
    appId: "1:765092878295:web:e63bf4df58cee3141d5d92",
    measurementId: "G-LBG7V8D1WL"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
