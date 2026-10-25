import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, MapPin, Calendar, CheckCircle2, ShieldCheck, Tag, Filter, Search, X, AlertCircle, Phone, ArrowRight, Truck } from 'lucide-react';
import { api } from '../services/api';

export default function FarmerMarketplace({ authUser, location = 'Ludhiana, Punjab' }) {
  const [activeTab, setActiveTab] = useState('produce'); // 'produce' | 'seeds' | 'machinery'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Create Listing Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    commodity: 'Wheat',
    variety: 'Sharbati HD-3086',
    grade: 'Grade A',
    quantity: '50',
    unit: 'Quintal',
    asking_price: '2300',
    harvest_date: new Date().toISOString().split('T')[0],
    pickup_location: location,
    service_area_km: '25',
    description: 'Freshly harvested, cleaned, and moisture-controlled crop stored in airtight bags.',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop'
  });

  // Buyer Enquiry Modal
  const [selectedListing, setSelectedListing] = useState(null);
  const [enquiryData, setEnquiryData] = useState({
    buyer_name: authUser?.name || 'Agro Trading Co.',
    buyer_phone: authUser?.phone || '+91 98123 45678',
    offered_price: '',
    requested_quantity: '',
    inspection_requested: true,
    proposed_pickup_date: new Date().toISOString().split('T')[0],
    message: 'Interested in procuring this lot. Please confirm quality inspection availability.'
  });
  const [isEnquiring, setIsEnquiring] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Existing Certified Seeds Data (Preserved)
  const seeds = [
    { id: 1, name: "Premium Sharbati Wheat", type: "High-Yield Hybrid", price: "₹1,200/50kg", yield: "24 quintals/acre", organic: true, tag: "AI Recommended" },
    { id: 2, name: "Basmati Rice Seed (Pusa-1121)", type: "Certified Seed", price: "₹2,500/10kg", yield: "18 quintals/acre", organic: false, tag: "Best Seller" },
    { id: 3, name: "Hybrid Corn (Sweet)", type: "Seasonal Crop", price: "₹800/5kg", yield: "30 quintals/acre", organic: true, tag: "Drought Resistant" },
    { id: 4, name: "Tomato Seeds (Arka Rakshak)", type: "Vegetable", price: "₹400/100g", yield: "High", organic: true, tag: "Disease Resistant" }
  ];

  // Existing Machinery Data (Preserved)
  const machineries = [
    { id: 1, name: "Mahindra 575 DI Tractor", type: "Tractor (45 HP)", price: "₹400/hour", distance: "2.5 km away", status: "Available Now", tag: "AI Recommended" },
    { id: 2, name: "Agricultural Spray Drone", type: "Drone Service", price: "₹800/acre", distance: "5.0 km away", status: "Booking Open", tag: "Cost Effective" },
    { id: 3, name: "Heavy Duty Rotavator", type: "Implement", price: "₹600/hour", distance: "3.2 km away", status: "Available Now", tag: "Top Rated" },
    { id: 4, name: "Combine Harvester", type: "Harvester", price: "₹2500/hour", distance: "12 km away", status: "Available Tomorrow", tag: "In Demand" }
  ];

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await api.marketplace.getListings();
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        commodity: formData.commodity,
        variety: formData.variety,
        grade: formData.grade,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        asking_price: parseFloat(formData.asking_price),
        harvest_date: formData.harvest_date,
        pickup_location: formData.pickup_location,
        service_area_km: parseFloat(formData.service_area_km) || 25.0,
        description: formData.description,
        image_url: formData.image_url
      };
      await api.marketplace.createListing(payload);
      setShowCreateModal(false);
      await loadListings();
    } catch (err) {
      alert(err.message || 'Failed to publish listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsEnquiring(true);
    try {
      const payload = {
        listing_id: selectedListing.id,
        buyer_name: enquiryData.buyer_name,
        buyer_phone: enquiryData.buyer_phone,
        offered_price: parseFloat(enquiryData.offered_price || selectedListing.asking_price),
        requested_quantity: parseFloat(enquiryData.requested_quantity || selectedListing.quantity),
        inspection_requested: enquiryData.inspection_requested,
        proposed_pickup_date: enquiryData.proposed_pickup_date,
        message: enquiryData.message
      };
      await api.marketplace.createEnquiry(payload);
      setEnquirySuccess(true);
      setTimeout(() => {
        setEnquirySuccess(false);
        setSelectedListing(null);
        loadListings();
      }, 1800);
    } catch (err) {
      alert(err.message || 'Failed to submit enquiry');
    } finally {
      setIsEnquiring(false);
    }
  };

  const openEnquiry = (item) => {
    setSelectedListing(item);
    setEnquiryData({
      buyer_name: authUser?.name || 'Agro Trading Co.',
      buyer_phone: authUser?.phone || '+91 98123 45678',
      offered_price: item.asking_price.toString(),
      requested_quantity: item.quantity.toString(),
      inspection_requested: true,
      proposed_pickup_date: new Date().toISOString().split('T')[0],
      message: `Requesting direct procurement of ${item.commodity}. Please coordinate inspection schedule.`
    });
    setEnquirySuccess(false);
  };

  const filteredListings = listings.filter(l =>
    l.commodity.toLowerCase().includes(search.toLowerCase()) ||
    l.pickup_location.toLowerCase().includes(search.toLowerCase()) ||
    l.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
              <Truck className="w-3.5 h-3.5 text-yellow-300" /> Direct Farmer-to-Buyer Procurement
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Agricultural Marketplace</h2>
            <p className="text-emerald-100 mt-1 max-w-xl text-sm md:text-base">
              Eliminate middlemen and save transportation expenses. Farmers list harvested produce directly; certified buyers inspect and buy at fair prices.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all text-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Sell Your Harvest
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab('produce')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'produce' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Farmer Produce (Direct Lots)
        </button>
        <button
          onClick={() => setActiveTab('seeds')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'seeds' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Certified Seeds
        </button>
        <button
          onClick={() => setActiveTab('machinery')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === 'machinery' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Machinery Rentals
        </button>
      </div>

      {/* Produce Listings Section */}
      {activeTab === 'produce' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search harvested produce by commodity, location, or grade..."
              className="w-full text-sm outline-none text-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-16 text-center text-gray-400">
                <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading farmer listings...
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="col-span-full py-16 text-center text-gray-400">
                No produce listings found matching your search.
              </div>
            ) : (
              filteredListings.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <img src={item.image_url} alt={item.commodity} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                      {item.grade}
                    </span>
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs ${
                      item.status === 'active' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {item.status === 'active' ? 'Available' : 'Inspection In Progress'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-extrabold text-xl text-gray-900">{item.commodity}</h3>
                        <p className="text-xs text-gray-400">{item.variety}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-700">₹{item.asking_price}</span>
                        <span className="text-xs text-gray-400 block">/{item.unit}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>

                    <div className="space-y-1.5 text-xs text-gray-500 border-t pt-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-gray-400" /> Quantity: <strong className="text-gray-800">{item.quantity} {item.unit}s</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup: {item.pickup_location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Harvested: {item.harvest_date}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={() => openEnquiry(item)}
                        className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs"
                      >
                        <ShoppingCart className="w-4 h-4" /> Procure / Send Enquiry
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Preserved Certified Seeds Tab */}
      {activeTab === 'seeds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seeds.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block">
                  {item.tag}
                </span>
                <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                <p className="text-xs text-gray-400 mb-2">{item.type} {item.organic && '• Organic'}</p>
                <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded inline-block mb-3">
                  Yield: {item.yield}
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-black text-xl text-gray-900 mb-3">{item.price}</p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors">
                  Order Seed Packet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preserved Machinery Rentals Tab */}
      {activeTab === 'machinery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {machineries.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block">
                  {item.tag}
                </span>
                <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                <p className="text-xs text-gray-400 mb-1">{item.type}</p>
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> {item.distance}
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-black text-xl text-gray-900 mb-3">{item.price}</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors">
                  Book Machine
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b pb-4 mb-4">
                <h3 className="text-2xl font-black text-gray-900">List Your Produce for Sale</h3>
                <p className="text-xs text-gray-400">Reach genuine buyers directly and avoid mandi commission agent cuts.</p>
              </div>

              <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Commodity</label>
                    <input 
                      type="text" 
                      required
                      value={formData.commodity} 
                      onChange={e => setFormData({...formData, commodity: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Variety</label>
                    <input 
                      type="text" 
                      value={formData.variety} 
                      onChange={e => setFormData({...formData, variety: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.quantity} 
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
                    <select 
                      value={formData.unit} 
                      onChange={e => setFormData({...formData, unit: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                    >
                      <option>Quintal</option>
                      <option>Kg</option>
                      <option>Tonne</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹/unit)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.asking_price} 
                      onChange={e => setFormData({...formData, asking_price: e.target.value})}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Farm Pickup Location</label>
                  <input 
                    type="text" 
                    required
                    value={formData.pickup_location} 
                    onChange={e => setFormData({...formData, pickup_location: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harvest Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.harvest_date} 
                    onChange={e => setFormData({...formData, harvest_date: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lot Description & Storage Condition</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs h-20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  {isSubmitting ? 'Publishing Listing...' : 'Publish Produce Listing'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buyer Enquiry & Inspection Request Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedListing(null)}
                className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {enquirySuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-gray-800">Enquiry Submitted!</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    The farmer has been notified with your offer and physical inspection request. Transaction status updated in platform ledger.
                  </p>
                </div>
              ) : (
                <>
                  <div className="border-b pb-4 mb-4">
                    <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                      Direct Procurement Enquiry
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mt-1">{selectedListing.commodity}</h3>
                    <p className="text-xs text-gray-500">{selectedListing.farmer_name} • {selectedListing.pickup_location}</p>
                  </div>

                  <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Your Name / Company</label>
                        <input 
                          type="text" 
                          required
                          value={enquiryData.buyer_name} 
                          onChange={e => setEnquiryData({...enquiryData, buyer_name: e.target.value})}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          required
                          value={enquiryData.buyer_phone} 
                          onChange={e => setEnquiryData({...enquiryData, buyer_phone: e.target.value})}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Quantity ({selectedListing.unit})</label>
                        <input 
                          type="number" 
                          required
                          value={enquiryData.requested_quantity} 
                          onChange={e => setEnquiryData({...enquiryData, requested_quantity: e.target.value})}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 uppercase mb-1">Offered Price (₹/{selectedListing.unit})</label>
                        <input 
                          type="number" 
                          required
                          value={enquiryData.offered_price} 
                          onChange={e => setEnquiryData({...enquiryData, offered_price: e.target.value})}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none"
                        />
                      </div>
                    </div>

                    {/* Quality Inspection Checkbox */}
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                      <input 
                        type="checkbox" 
                        id="inspection"
                        checked={enquiryData.inspection_requested}
                        onChange={e => setEnquiryData({...enquiryData, inspection_requested: e.target.checked})}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="inspection" className="cursor-pointer text-emerald-950 font-medium">
                        <strong>Request Farm-Gate Quality Assaying:</strong> Inspect moisture, grain size, and purity before final payment.
                      </label>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-500 uppercase mb-1">Message to Farmer</label>
                      <textarea 
                        value={enquiryData.message} 
                        onChange={e => setEnquiryData({...enquiryData, message: e.target.value})}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl h-16 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isEnquiring}
                      className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
                    >
                      {isEnquiring ? 'Sending Purchase Request...' : 'Submit Procurement Request'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
