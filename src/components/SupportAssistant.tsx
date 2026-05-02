import { useState, useRef, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  Calendar as CalendarIcon, 
  X, 
  Headset, 
  ChevronRight, 
  ChevronLeft,
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Globe
} from "lucide-react";

// Import the local image asset
import sarahImage from "../assets/sarah.jpg";

// Initialize EmailJS with your Public Key
emailjs.init("LIwijkfZ3ltrqyKin");

const SupportAssistant = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [modalView, setModalView] = useState<'assistant' | 'booking' | 'success'>('assistant');
  
  // Location/Flag State
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [callingCode, setCallingCode] = useState<string | null>(null);

  // Form State
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    name: "",
    phone: "",
    topic: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [calendarDate, setCalendarDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const calendarRef = useRef<HTMLDivElement>(null);

  const availableTimes = ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"];

  // Auto-detect Location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_code) {
          setCountryCode(data.country_code);
          setCallingCode(data.country_calling_code);
        }
      } catch (error) {
        console.error("Location detection failed", error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CHANGED: Added Event Listener to trigger modal from external components
  useEffect(() => {
    const handleRemoteTrigger = () => {
      handleContactClick();
    };
    window.addEventListener("open-support-modal", handleRemoteTrigger);
    return () => {
      window.removeEventListener("open-support-modal", handleRemoteTrigger);
    };
  }, []);

  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return checkDate < todayDateOnly;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    setBookingData({ ...bookingData, date: formattedDate, time: "" }); 
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setShowCalendar(false);
  };

  const handleContactClick = () => {
    setIsModalOpen(true);
    setIsFinding(true);
    setModalView('assistant');
    setTimeout(() => setIsFinding(false), 2000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsFinding(false);
      setModalView('assistant');
      setBookingData({ date: "", time: "", name: "", phone: "", topic: "" });
      setShowCalendar(false);
    }, 300);
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:sarah@customsrealease.org?subject=Customs%20Clearance%20Assistance";
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalPhoneNumber = callingCode ? `${callingCode} ${bookingData.phone}` : bookingData.phone;

    const templateParams = {
      name: bookingData.name,
      time: `Requested for: ${bookingData.date} at ${bookingData.time}`,
      message: `Phone Number: ${finalPhoneNumber}\nScheduled Date: ${bookingData.date}\nScheduled Time: ${bookingData.time}\n\nReason for call:\n${bookingData.topic}`
    };

    emailjs.send(
      'service_1i4zrfj',
      'template_22c550s',
      templateParams,
      'LIwijkfZ3ltrqyKin'
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setIsSubmitting(false);
      setModalView('success');
    })
    .catch((err) => {
      console.error('FAILED...', err);
      setIsSubmitting(false);
      alert("Failed to send booking request. Please check your internet connection and try again.");
    });
  };

  return (
    <>
      {/* 1. Support Card */}
      <div id="support-section" className="bg-gradient-to-br from-[#2e9498] to-[#217579] rounded-2xl p-6 text-white max-w-sm relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <Headset size={140} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white p-2.5 rounded-2xl text-black shadow-sm">
              <Headset className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Get Support</h2>
          </div>
          <p className="text-[15px] mb-6 text-teal-50 leading-relaxed pr-4">
            We are here to help, you can <span className="font-bold">email</span> or <span>book a call with your clearance officer</span> </p>
          <button
            onClick={handleContactClick}
            className="bg-white text-[#56347c] font-semibold py-2.5 px-5 rounded-xl flex items-center gap-1.5 hover:bg-gray-50 transition-all hover:shadow-md active:scale-[0.98]"
          >
            Contact Us
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Modal Flow */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModal} />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 min-h-[500px]">
            {/* Header Area */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
              <div className="pointer-events-auto">
                {modalView === 'booking' && (
                  <button onClick={() => setModalView('assistant')} className="p-2 text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm border border-gray-200">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button onClick={closeModal} className="pointer-events-auto p-2 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full transition-colors shadow-sm border border-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VIEW 1: LOADING */}
            {isFinding && (
              <div className="flex flex-col items-center justify-center h-[500px] px-6 text-center">
                <Loader2 className="w-12 h-12 text-[#2e9498] animate-spin mb-5" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connecting you...</h3>
                <p className="text-gray-500">Fetching you your dedicated clearance specialist</p>
              </div>
            )}

            {/* VIEW 2: ASSISTANT PROFILE */}
            {!isFinding && modalView === 'assistant' && (
              <div className="p-8 md:p-12 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
                      <img src={sarahImage} alt="Sarah Jenkins" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-2 right-3 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Sarah Jenkins</h3>
                    <p className="text-[#004B87] font-semibold text-sm mb-4 uppercase tracking-wide bg-blue-50 inline-block px-3 py-1.5 rounded-full mt-2">Dedicated Clearance Specialist</p>
                    <p className="text-base text-gray-600 max-w-2xl mb-8 leading-relaxed">
                      Hi! I am here to help you navigate your customs clearance process. If you need assistance gathering your required documentation or understanding your next steps, please don't hesitate to reach out.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                      <button onClick={handleEmailClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#004B87] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#003865] hover:shadow-md transition-all">
                        <Mail className="h-4 w-4" /> Email Sarah
                      </button>
                      <button onClick={() => setModalView('booking')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-200 px-8 py-3.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                        <CalendarIcon className="h-4 w-4 text-[#004B87]" /> Book a Phone Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: CUSTOM BOOKING FORM */}
            {!isFinding && modalView === 'booking' && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-300 p-8 md:p-12 pt-20 overflow-y-auto max-h-[85vh]">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900">Schedule a Call</h3>
                    <p className="text-gray-500 mt-2">Select a time that works for you and we will call you back.</p>
                  </div>

                  <form onSubmit={handleBookSubmit} className="space-y-6">
                    {/* Date/Time Picker */}
                    <div className="space-y-2 relative" ref={calendarRef}>
                      <label className="text-sm font-semibold text-gray-700 block">Select Date & Time</label>
                      <button 
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#004B87] transition-all"
                      >
                        <span className={bookingData.date ? "text-gray-900 font-medium" : "text-gray-500"}>
                          {bookingData.date && bookingData.time 
                            ? `${bookingData.date} at ${bookingData.time}` 
                            : bookingData.date 
                              ? `${bookingData.date} - Select a time...` 
                              : "Choose a date & time..."}
                        </span>
                        <CalendarIcon className="w-5 h-5 text-[#004B87]" />
                      </button>

                      {showCalendar && (
                        <div className="absolute top-[105%] left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 w-full sm:w-[340px] animate-in fade-in slide-in-from-top-2">
                          {!bookingData.date ? (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <span className="font-semibold text-gray-900">
                                  {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                                </span>
                                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                  <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                              <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map(day => (
                                  <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1">{day}</div>
                                ))}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                  <div key={`empty-${i}`} className="p-2"></div>
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                  const day = i + 1;
                                  const disabled = isDateDisabled(day);
                                  return (
                                    <button
                                      key={day}
                                      type="button"
                                      disabled={disabled}
                                      onClick={() => handleDateSelect(day)}
                                      className={`p-2 text-sm rounded-lg flex items-center justify-center transition-all
                                        ${disabled ? 'text-gray-300 cursor-not-allowed' : 
                                          'text-gray-700 hover:bg-blue-50 font-medium'}
                                      `}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                              <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                                <button type="button" onClick={() => setBookingData({ ...bookingData, date: "", time: "" })} className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2">
                                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <span className="font-semibold text-gray-900">{bookingData.date}</span>
                              </div>
                              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Available Times</p>
                              <div className="grid grid-cols-2 gap-2">
                                {availableTimes.map((time) => (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleTimeSelect(time)}
                                    className={`py-2 px-2 rounded-xl text-sm font-medium border transition-all ${
                                      bookingData.time === time 
                                        ? "bg-[#004B87] text-white border-[#004B87] shadow-md" 
                                        : "bg-white text-gray-700 border-gray-200 hover:border-[#004B87] hover:bg-blue-50"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">Your Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John Doe"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent text-gray-700"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">Phone Number</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            {countryCode ? (
                              <>
                                <img 
                                  src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`} 
                                  alt={`${countryCode} flag`}
                                  className="w-6 h-4 object-cover rounded-[2px]"
                                />
                                <span className="text-sm font-medium text-gray-600">{callingCode}</span>
                              </>
                            ) : (
                              <Globe className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <input 
                            type="tel" 
                            required
                            placeholder="Phone Number"
                            className={`w-full border border-gray-300 rounded-xl ${callingCode ? 'pl-24' : 'pl-12'} pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent text-gray-700`}
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 block">Purpose for Call</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Briefly describe what you need help with..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent text-gray-700 resize-none"
                        value={bookingData.topic}
                        onChange={(e) => setBookingData({...bookingData, topic: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !bookingData.date || !bookingData.time}
                      className="w-full bg-[#004B87] text-white py-4 rounded-xl font-semibold hover:bg-[#003865] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 4: SUCCESS SCREEN */}
            {!isFinding && modalView === 'success' && (
              <div className="flex flex-col items-center justify-center h-[500px] px-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Sarah has received your request. We will call you at <span className="font-semibold">{callingCode} {bookingData.phone}</span> at the scheduled time.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 text-left">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <CalendarIcon className="w-6 h-6 text-[#004B87]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{bookingData.date}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {bookingData.time}
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="mt-8 text-[#004B87] font-semibold hover:underline">
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SupportAssistant;