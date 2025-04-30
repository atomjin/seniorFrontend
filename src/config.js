const API_BASE_URL = "https://streamlabs.com/api/v2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=donations.read+donations.create"; // Change this if your backend is running on another port

export default API_BASE_URL;