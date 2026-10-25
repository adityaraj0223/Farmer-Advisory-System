// Smart Agricultural Location & Geolocation Service for Krishi Mitra AI

export const INDIAN_AGRI_DISTRICTS = [
  // Punjab
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, primaryCrop: 'Wheat & Paddy', mandi: 'Ludhiana Mandi' },
  { name: 'Bathinda', state: 'Punjab', lat: 30.2110, lon: 74.9455, primaryCrop: 'Cotton & Wheat', mandi: 'Bathinda APMC' },
  { name: 'Patiala', state: 'Punjab', lat: 30.3398, lon: 76.3869, primaryCrop: 'Paddy & Wheat', mandi: 'Patiala Mandi' },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lon: 74.8723, primaryCrop: 'Basmati & Wheat', mandi: 'Amritsar Grain Market' },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lon: 75.5762, primaryCrop: 'Potato & Maize', mandi: 'Jalandhar Mandi' },
  { name: 'Firozpur', state: 'Punjab', lat: 30.9237, lon: 74.6122, primaryCrop: 'Wheat & Mustard', mandi: 'Firozpur Mandi' },
  { name: 'Sangrur', state: 'Punjab', lat: 30.2458, lon: 75.8421, primaryCrop: 'Paddy & Cotton', mandi: 'Sangrur Mandi' },

  // Maharashtra
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, primaryCrop: 'Sugarcane & Vegetables', mandi: 'Pune Market Yard' },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, primaryCrop: 'Onion & Grapes', mandi: 'Lasalgaon / Nashik Mandi' },
  { name: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lon: 74.7480, primaryCrop: 'Soybean & Onion', mandi: 'Ahmednagar APMC' },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, primaryCrop: 'Oranges & Cotton', mandi: 'Nagpur Mandi' },
  { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lon: 74.2433, primaryCrop: 'Sugarcane & Jaggery', mandi: 'Kolhapur Market' },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lon: 75.9064, primaryCrop: 'Pomegranate & Jowar', mandi: 'Solapur APMC' },
  { name: 'Aurangabad (Chhatrapati Sambhajinagar)', state: 'Maharashtra', lat: 19.8762, lon: 75.3433, primaryCrop: 'Cotton & Bajra', mandi: 'Jadhavwadi Mandi' },
  { name: 'Amravati', state: 'Maharashtra', lat: 20.9374, lon: 77.7796, primaryCrop: 'Soybean & Cotton', mandi: 'Amravati APMC' },

  // Uttar Pradesh
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, primaryCrop: 'Paddy & Vegetables', mandi: 'Varanasi Grain Mandi' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, primaryCrop: 'Wheat & Mango', mandi: 'Dubagga Mandi' },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081, primaryCrop: 'Potato & Mustard', mandi: 'Agra APMC' },
  { name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', lat: 25.4358, lon: 81.8463, primaryCrop: 'Wheat & Guava', mandi: 'Mundera Mandi' },
  { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lon: 79.4304, primaryCrop: 'Sugarcane & Wheat', mandi: 'Bareilly Mandi' },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064, primaryCrop: 'Sugarcane & Vegetables', mandi: 'Meerut Grain Market' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lon: 83.3732, primaryCrop: 'Paddy & Sugarcane', mandi: 'Gorakhpur APMC' },
  { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lon: 78.0880, primaryCrop: 'Wheat & Mustard', mandi: 'Aligarh Mandi' },

  // Bihar
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376, primaryCrop: 'Paddy & Wheat', mandi: 'Patna Agricultural Market' },
  { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lon: 85.3647, primaryCrop: 'Shahi Litchi & Maize', mandi: 'Muzaffarpur Mandi' },
  { name: 'Gaya', state: 'Bihar', lat: 24.7914, lon: 85.0002, primaryCrop: 'Paddy & Pulses', mandi: 'Gaya APMC' },
  { name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lon: 86.9842, primaryCrop: 'Katarni Rice & Silk', mandi: 'Bhagalpur Mandi' },
  { name: 'Nalanda', state: 'Bihar', lat: 25.1357, lon: 85.4597, primaryCrop: 'Vegetables & Potato', mandi: 'Biharsharif Mandi' },
  { name: 'Purnia', state: 'Bihar', lat: 25.7771, lon: 87.4753, primaryCrop: 'Maize & Jute', mandi: 'Gulabbagh Mandi (Largest Maize)' },
  { name: 'Samastipur', state: 'Bihar', lat: 25.8629, lon: 85.7811, primaryCrop: 'Tobacco & Maize', mandi: 'Samastipur Mandi' },

  // Madhya Pradesh
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, primaryCrop: 'Soybean & Wheat', mandi: 'Indore APMC Mandi' },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126, primaryCrop: 'Wheat & Pulses', mandi: 'Karond Mandi' },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lon: 75.7885, primaryCrop: 'Soybean & Garlic', mandi: 'Ujjain Krishi Mandi' },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lon: 79.9864, primaryCrop: 'Green Peas & Wheat', mandi: 'Jabalpur Mandi' },
  { name: 'Hoshangabad (Narmadapuram)', state: 'Madhya Pradesh', lat: 22.7519, lon: 77.7289, primaryCrop: 'Sharbati Wheat & Moong', mandi: 'Itarsi Mandi' },

  // Haryana
  { name: 'Karnal', state: 'Haryana', lat: 29.6857, lon: 76.9905, primaryCrop: 'Basmati Rice & Wheat', mandi: 'Karnal Grain Mandi' },
  { name: 'Hisar', state: 'Haryana', lat: 29.1492, lon: 75.7217, primaryCrop: 'Cotton & Mustard', mandi: 'Hisar Mandi' },
  { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lon: 76.6066, primaryCrop: 'Wheat & Mustard', mandi: 'Rohtak Mandi' },
  { name: 'Sirsa', state: 'Haryana', lat: 29.5349, lon: 75.0298, primaryCrop: 'Cotton & Wheat', mandi: 'Sirsa Mandi' },
  { name: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lon: 76.8783, primaryCrop: 'Basmati Paddy', mandi: 'Thanesar Mandi' },

  // Gujarat
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022, primaryCrop: 'Groundnut & Cotton', mandi: 'Bedi Yard Rajkot' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, primaryCrop: 'Cotton & Castor', mandi: 'Ahmedabad APMC' },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311, primaryCrop: 'Sugarcane & Banana', mandi: 'Surat APMC' },
  { name: 'Junagadh', state: 'Gujarat', lat: 21.5222, lon: 70.4579, primaryCrop: 'Groundnut & Kesar Mango', mandi: 'Junagadh Mandi' },
  { name: 'Anand', state: 'Gujarat', lat: 22.5645, lon: 72.9289, primaryCrop: 'Tobacco & Dairy Feed', mandi: 'Anand APMC' },

  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, primaryCrop: 'Mustard & Bajra', mandi: 'Muhana Mandi Jaipur' },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lon: 75.8648, primaryCrop: 'Soybean & Coriander', mandi: 'Bhamashah Mandi Kota' },
  { name: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9038, lon: 73.8772, primaryCrop: 'Wheat & Kinnow', mandi: 'Ganganagar Grain Market' },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lon: 73.0243, primaryCrop: 'Guar Gum & Cumin', mandi: 'Jodhpur APMC' },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lon: 73.3119, primaryCrop: 'Groundnut & Moth Dal', mandi: 'Bikaner Mandi' },

  // Andhra Pradesh & Telangana
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365, primaryCrop: 'Red Chilli & Cotton', mandi: 'Guntur Mirchi Yard (Asia’s Largest)' },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lon: 79.5941, primaryCrop: 'Cotton & Turmeric', mandi: 'Enugula Gadda Mandi' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, primaryCrop: 'Paddy & Maize', mandi: 'Bowenpally / Malakpet Mandi' },

  // Karnataka
  { name: 'Kolar', state: 'Karnataka', lat: 13.1362, lon: 78.1291, primaryCrop: 'Tomato & Vegetables', mandi: 'Kolar APMC (Asia’s 2nd Largest Tomato Market)' },
  { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lon: 74.4977, primaryCrop: 'Sugarcane & Maize', mandi: 'Belagavi APMC' },
  { name: 'Mandya', state: 'Karnataka', lat: 12.5234, lon: 76.8970, primaryCrop: 'Sugarcane & Paddy', mandi: 'Mandya Mandi' },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lon: 76.6394, primaryCrop: 'Ragi & Pulses', mandi: 'Bandipalya APMC' },

  // Tamil Nadu
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, primaryCrop: 'Coconut & Cotton', mandi: 'Coimbatore APMC' },
  { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lon: 79.1378, primaryCrop: 'Paddy (Rice Bowl of TN)', mandi: 'Thanjavur Grain Market' },
  { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lon: 77.7172, primaryCrop: 'Turmeric (Yellow City)', mandi: 'Erode Turmeric Market' },

  // West Bengal
  { name: 'Burdwan (Purba Bardhaman)', state: 'West Bengal', lat: 23.2324, lon: 87.8615, primaryCrop: 'Paddy (Rice Bowl of Bengal)', mandi: 'Burdwan Mandi' },
  { name: 'Hooghly', state: 'West Bengal', lat: 22.9030, lon: 88.3968, primaryCrop: 'Potato & Jute', mandi: 'Sheoraphuli Market' }
];

// Helper to find district by name
export function findDistrictInfo(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  return INDIAN_AGRI_DISTRICTS.find(d => 
    d.name.toLowerCase().includes(q) || 
    d.state.toLowerCase().includes(q) ||
    q.includes(d.name.toLowerCase())
  ) || null;
}

// 1. Live GPS Location Detection with OpenStreetMap Reverse Geocode
export async function detectGpsLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser does not support GPS geolocation"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy);

          // Reverse geocode using OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const district = addr.state_district || addr.county || addr.city || addr.town || addr.district || 'Detected District';
            const state = addr.state || 'India';
            const cleanDistrict = district.replace(/ district/i, '').trim();
            const locationStr = `${cleanDistrict}, ${state}`;

            resolve({
              success: true,
              location: locationStr,
              district: cleanDistrict,
              state: state,
              lat,
              lon,
              accuracyMeters: accuracy,
              source: 'gps'
            });
            return;
          }

          // Fallback if reverse geocode fails
          resolve({
            success: true,
            location: `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`,
            lat,
            lon,
            source: 'gps'
          });
        } catch (e) {
          console.warn("Reverse geocode failed, returning coordinates:", e);
          resolve({
            success: true,
            location: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            source: 'gps'
          });
        }
      },
      (err) => {
        reject(err);
      },
      { timeout: 9000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  });
}

// 2. IP-based Network Geolocation Fallback
export async function detectIpLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.city && data.region) {
        return {
          success: true,
          location: `${data.city}, ${data.region}`,
          district: data.city,
          state: data.region,
          lat: data.latitude,
          lon: data.longitude,
          source: 'ip'
        };
      }
    }
  } catch (e) {
    console.warn("ipapi failed, trying secondary ipwho.is provider:", e);
  }

  // Secondary fallback provider
  try {
    const res2 = await fetch('https://ipwho.is/');
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.success && data2.city) {
        return {
          success: true,
          location: `${data2.city}, ${data2.region || data2.country}`,
          district: data2.city,
          state: data2.region || 'India',
          lat: data2.latitude,
          lon: data2.longitude,
          source: 'ip'
        };
      }
    }
  } catch (e) {
    console.warn("Secondary IP provider failed:", e);
  }

  throw new Error("Unable to detect IP location");
}

// 3. Main Automatic Detector (GPS first, then IP fallback)
export async function detectAutoLocation() {
  try {
    return await detectGpsLocation();
  } catch (gpsError) {
    console.info("GPS unavailable or permission denied, falling back to IP detection:", gpsError.message);
    try {
      return await detectIpLocation();
    } catch (ipError) {
      console.warn("Both GPS and IP geolocation failed:", ipError.message);
      return {
        success: false,
        location: getSavedLocation() || 'Ludhiana, Punjab',
        source: 'manual'
      };
    }
  }
}

// 4. Persistence Helpers
export function saveFarmerLocation(locationStr, source = 'manual') {
  try {
    localStorage.setItem('farmerLocation', locationStr);
    localStorage.setItem('farmerLocationSource', source);
    localStorage.setItem('farmerLocationTimestamp', new Date().toISOString());
  } catch (e) {
    console.warn("Storage quota or error:", e);
  }
}

export function getSavedLocation() {
  try {
    return localStorage.getItem('farmerLocation');
  } catch {
    return null;
  }
}

export function getSavedLocationSource() {
  try {
    return localStorage.getItem('farmerLocationSource') || 'manual';
  } catch {
    return 'manual';
  }
}
