import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { flightsData } from "../data/mockData";
import { flightApi, bookingApi } from "../api/endpoints";

const DataContext = createContext();

// Helper to normalize Go backend flight into frontend format
export const normalizeBackendFlight = (f) => {
  if (!f) return null;
  // If already in frontend format
  if (f.flightNumber && f.from && f.price) return f;

  const depDate = f.departure_time ? f.departure_time.split("T")[0] : "";
  const depTime = f.departure_time
    ? f.departure_time.split("T")[1]?.substring(0, 5)
    : "08:00";
  const arrDate = f.arrival_time ? f.arrival_time.split("T")[0] : "";
  const arrTime = f.arrival_time
    ? f.arrival_time.split("T")[1]?.substring(0, 5)
    : "10:30";
  const durationMin = f.duration_minutes || 110;
  const hours = Math.floor(durationMin / 60);
  const mins = durationMin % 60;

  const basePrice = Number(f.base_price) || 1200000;

  return {
    id: f.id,
    flightNumber: f.flight_number || "GA-123",
    airline: f.airline?.name || "Garuda Indonesia",
    airlineCode: f.airline?.code || "GA",
    from: f.departure_airport
      ? `${f.departure_airport.city} (${f.departure_airport.code})`
      : `Jakarta (${f.departure_airport_id || "CGK"})`,
    fromCode: f.departure_airport_id || "CGK",
    to: f.arrival_airport
      ? `${f.arrival_airport.city} (${f.arrival_airport.code})`
      : `Denpasar (${f.arrival_airport_id || "DPS"})`,
    toCode: f.arrival_airport_id || "DPS",
    departureDate: depDate,
    departureTime: depTime,
    arrivalDate: arrDate,
    arrivalTime: arrTime,
    duration: `${hours}j ${mins}m`,
    durationMinutes: durationMin,
    price: basePrice,
    prices: {
      economy: basePrice,
      business: Math.round(basePrice * 2.1),
      first: Math.round(basePrice * 4.2),
    },
    availableSeats: Array.isArray(f.seats)
      ? f.seats.filter((s) => s.status === "AVAILABLE").length
      : 180,
    totalSeats: f.airplane?.seat_capacity || 180,
    status: f.status === "SCHEDULED" ? "Tersedia" : f.status || "Tersedia",
    aircraft: f.airplane?.model || "Boeing 737-800",
    terminal: "Terminal 3",
    gate: "A12",
    baggageAllowance: 20,
    amenities: ["WiFi", "Entertainment", "Meal"],
    transit: false,
    stops: 0,
    isBackend: true,
  };
};

export const DataProvider = ({ children }) => {
  const [flights, setFlights] = useState(flightsData);
  const [bookings, setBookings] = useState([]);
  const [apiConnected, setApiConnected] = useState(false);
  const isInitialized = useRef(false);

  // Synchronize flights with Go Backend API
  const syncFlightsFromApi = useCallback(async () => {
    try {
      const res = await flightApi.searchFlights();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const normalized = res.data.map(normalizeBackendFlight);
        // Combine backend flights with existing mock flights to give full variety
        setFlights((prev) => {
          const mockNonDuplicated = flightsData.filter(
            (mf) => !normalized.some((bf) => bf.flightNumber === mf.flightNumber)
          );
          const combined = [...normalized, ...mockNonDuplicated];
          try {
            localStorage.setItem("flights", JSON.stringify(combined));
          } catch (e) {
            console.error("Failed saving flights to localStorage:", e);
          }
          return combined;
        });
        setApiConnected(true);
      }
    } catch (err) {
      console.warn("Backend flight API unreachable, using local mock data:", err.message);
      setApiConnected(false);
    }
  }, []);

  // Synchronize bookings with Go Backend API if user is logged in
  const syncBookingsFromApi = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await bookingApi.getMyBookings();
      if (res?.data && Array.isArray(res.data)) {
        // Map backend bookings to frontend format
        const apiBookings = res.data.map((b) => ({
          id: b.id,
          bookingCode: b.booking_code,
          passengerName: b.passengers?.[0]?.passenger_name || "Penumpang",
          passengers: (b.passengers || []).map((p) => ({
            name: p.passenger_name,
            idNumber: p.id_number,
            seat: p.seat_number,
            ticketNumber: p.ticket_number,
            qrCode: p.qr_code,
          })),
          email: b.user?.email || "",
          phone: b.user?.phone || "",
          flightId: b.flight_id,
          flightNumber: b.flight?.flight_number || "GA-123",
          airline: b.flight?.airline?.name || "Garuda Indonesia",
          route: `${b.flight?.departure_airport_id || "CGK"} → ${b.flight?.arrival_airport_id || "DPS"}`,
          from: b.flight?.departure_airport_id || "CGK",
          to: b.flight?.arrival_airport_id || "DPS",
          departureDate: b.flight?.departure_time ? b.flight.departure_time.split("T")[0] : "",
          departureTime: b.flight?.departure_time ? b.flight.departure_time.split("T")[1]?.substring(0, 5) : "",
          arrivalTime: b.flight?.arrival_time ? b.flight.arrival_time.split("T")[1]?.substring(0, 5) : "",
          totalPrice: Number(b.total_amount) || 0,
          status:
            b.status === "CONFIRMED" || b.status === "PAID"
              ? "Confirmed"
              : b.status === "PENDING_PAYMENT"
              ? "Pending"
              : b.status === "CANCELLED" || b.status === "EXPIRED"
              ? "Cancelled"
              : b.status,
          paymentStatus:
            b.payment?.status === "PAID" ||
            b.status === "PAID" ||
            b.status === "CONFIRMED"
              ? "Paid"
              : "Pending",
          paymentMethod: b.payment?.payment_method || "CREDIT_CARD",
          bookingDate: b.created_at ? b.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
          seats: (b.passengers || []).map((p) => p.seat_number),
          isBackend: true,
        }));

        setBookings((prev) => {
          // Merge API bookings with local bookings (prevent duplicates by ID/code)
          const merged = [...apiBookings];
          prev.forEach((localB) => {
            if (!merged.some((m) => m.id === localB.id || m.bookingCode === localB.bookingCode)) {
              merged.push(localB);
            }
          });
          try {
            localStorage.setItem("bookings", JSON.stringify(merged));
          } catch (e) {
            console.error("Failed saving bookings:", e);
          }
          return merged;
        });
      }
    } catch (err) {
      console.warn("Backend getMyBookings API offline or unauthorized:", err.message);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const storedFlights = localStorage.getItem("flights");
      if (storedFlights) {
        try {
          const parsed = JSON.parse(storedFlights);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFlights(parsed);
          } else {
            setFlights(flightsData);
          }
        } catch {
          setFlights(flightsData);
        }
      }

      const storedBookings = localStorage.getItem("bookings");
      if (storedBookings) {
        try {
          const parsed = JSON.parse(storedBookings);
          if (Array.isArray(parsed)) {
            setBookings(parsed);
          }
        } catch {
          setBookings([]);
        }
      }
    } catch (err) {
      console.error("Error reading initial data from localStorage:", err);
    }

    // Connect to Go Backend API
    syncFlightsFromApi();
    syncBookingsFromApi();
  }, [syncFlightsFromApi, syncBookingsFromApi]);

  // Sync to localStorage on local modifications
  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      localStorage.setItem("flights", JSON.stringify(flights));
    } catch (error) {
      console.error("Error saving flights to localStorage:", error);
    }
  }, [flights]);

  useEffect(() => {
    if (!isInitialized.current) return;
    try {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  }, [bookings]);

  // Add Booking (With Go Backend API invocation)
  const addBooking = async (newBooking) => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    const uniqueId = `BK${timestamp}${randomSuffix}`;

    let bookingWithDefaults = {
      ...newBooking,
      id: newBooking.id || uniqueId,
      status: "Pending",
      paymentStatus: "Paid",
      bookingDate: newBooking.bookingDate || new Date().toISOString().split("T")[0],
      refundStatus: newBooking.refundStatus || "none",
      refundReason: newBooking.refundReason || "",
      refundRequestedAt: newBooking.refundRequestedAt || null,
      refundProcessedAt: newBooking.refundProcessedAt || null,
      refundNote: newBooking.refundNote || "",
    };

    // Attempt creation on Go backend if user has token and flightId is UUID
    const token = localStorage.getItem("token");
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      newBooking.flightId
    );

    if (token && isUUID) {
      try {
        const payload = {
          flight_id: newBooking.flightId,
          payment_method: "CREDIT_CARD",
          passengers: (newBooking.passengers || []).map((p, idx) => ({
            seat_number: p.seat || `${10 + idx}A`,
            passenger_name: p.name || newBooking.passengerName || "Penumpang",
            id_type: (p.idNumber || "").length === 16 ? "KTP" : "PASSPORT",
            id_number: (p.idNumber || "3171012345678901").replace(/\s/g, ""),
            date_of_birth: p.dob || "2000-01-01",
          })),
        };

        const res = await bookingApi.createBooking(payload);
        if (res?.data) {
          bookingWithDefaults = {
            ...bookingWithDefaults,
            id: res.data.id || bookingWithDefaults.id,
            bookingCode: res.data.booking_code || bookingWithDefaults.bookingCode,
            isBackend: true,
          };
        }
      } catch (err) {
        console.warn("Backend API booking creation error, continuing locally:", err.message);
      }
    }

    setBookings((prev) => {
      const updated = [bookingWithDefaults, ...prev];
      try {
        localStorage.setItem("bookings", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving booking:", e);
      }
      return updated;
    });

    return bookingWithDefaults;
  };

  const updateBooking = (id, updatedBooking) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? updatedBooking : b));
      try {
        localStorage.setItem("bookings", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving updated booking:", error);
      }
      return updated;
    });
  };

  const deleteBooking = (id) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem("bookings", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving deleted booking:", error);
      }
      return updated;
    });
  };

  const addFlight = (newFlight) => {
    setFlights((prev) => [
      ...prev,
      {
        ...newFlight,
        id: "FL" + (prev.length + 1).toString().padStart(3, "0"),
      },
    ]);
  };

  const updateFlight = (id, updatedFlight) => {
    setFlights((prev) => prev.map((f) => (f.id === id ? updatedFlight : f)));
  };

  const deleteFlight = (id) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  // Refund Management
  const requestRefund = (id, reason = "Permintaan refund dari user") => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id !== id) return b;
        if (
          b.refundStatus &&
          b.refundStatus !== "none" &&
          b.refundStatus !== "rejected"
        ) {
          return b;
        }

        return {
          ...b,
          refundStatus: "requested",
          refundReason: reason,
          refundRequestedAt: new Date().toISOString(),
        };
      });

      try {
        localStorage.setItem("bookings", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving refund request to localStorage:", error);
      }

      return updated;
    });
  };

  const processRefund = (id, decision, note = "") => {
    setBookings((prev) => {
      const now = new Date().toISOString();

      const updated = prev.map((b) => {
        if (b.id !== id) return b;
        if (b.refundStatus !== "requested") return b;

        if (decision === "approve") {
          return {
            ...b,
            refundStatus: "approved",
            refundProcessedAt: now,
            refundNote: note,
            status: "Cancelled",
            paymentStatus: "Refunded",
          };
        }

        return {
          ...b,
          refundStatus: "rejected",
          refundProcessedAt: now,
          refundNote: note,
        };
      });

      try {
        localStorage.setItem("bookings", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving refund processing to localStorage:", error);
      }

      return updated;
    });
  };

  return (
    <DataContext.Provider
      value={{
        flights,
        bookings,
        apiConnected,
        syncFlightsFromApi,
        syncBookingsFromApi,
        addBooking,
        updateBooking,
        deleteBooking,
        addFlight,
        updateFlight,
        deleteFlight,
        requestRefund,
        processRefund,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
