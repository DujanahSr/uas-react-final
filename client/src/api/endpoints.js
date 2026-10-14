import apiClient from "./client";

export const authApi = {
  login: async (credentials) => {
    return apiClient.post("/auth/login", credentials);
  },
  register: async (data) => {
    return apiClient.post("/auth/register", data);
  },
  getProfile: async () => {
    return apiClient.get("/auth/me");
  },
};

export const flightApi = {
  searchFlights: async (params = {}) => {
    return apiClient.get("/flights", { params });
  },
  getFlightByID: async (id) => {
    return apiClient.get(`/flights/${id}`);
  },
  getSeatMap: async (flightId) => {
    return apiClient.get(`/flights/${flightId}/seats`);
  },
  lockSeat: async (flightId, seatNumber, userId) => {
    return apiClient.post(`/flights/${flightId}/seats/lock`, {
      seat_number: seatNumber,
      user_id: userId,
    });
  },
  unlockSeat: async (flightId, seatNumber, userId) => {
    return apiClient.post(`/flights/${flightId}/seats/unlock`, {
      seat_number: seatNumber,
      user_id: userId,
    });
  },
};

export const bookingApi = {
  createBooking: async (payload) => {
    return apiClient.post("/bookings", payload);
  },
  getMyBookings: async () => {
    return apiClient.get("/bookings/my");
  },
  getBookingDetail: async (id) => {
    return apiClient.get(`/bookings/${id}`);
  },
};
