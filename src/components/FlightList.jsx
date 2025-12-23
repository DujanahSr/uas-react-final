import React, { useState, useEffect } from 'react';
import FlightCard from './FlightCard';
import { flightsData, searchFlights } from '../data/mockData';
import { FaPlane } from 'react-icons/fa';

const FlightList = ({ flights: propFlights }) => {
  const [flights, setFlights] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    // Load initial flights - use propFlights if provided, otherwise use flightsData
    if (propFlights && propFlights.length > 0) {
      setFlights(propFlights);
    } else {
      setFlights(flightsData.slice(0, 3)); // Show only first 3 for dashboard
    }

    // Listen for search events
    const handleSearch = (event) => {
      const filters = event.detail;
      handleSearchInternal(filters);
    };

    window.addEventListener('flightSearch', handleSearch);

    return () => {
      window.removeEventListener('flightSearch', handleSearch);
    };
  }, [propFlights]);

  const handleSearchInternal = (filters) => {
    setIsSearching(true);
    setSearchFilters(filters);
    
    // Simulate search delay
    setTimeout(() => {
      const results = searchFlights(filters);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (filters) => {
    setIsSearching(true);
    setSearchFilters(filters);
    
    // Simulate search delay
    setTimeout(() => {
      const results = searchFlights(filters);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSelectFlight = (flight) => {
    // Handle flight selection
    alert(`Penerbangan ${flight.flightNumber} dipilih!`);
  };


  if (isSearching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Mencari penerbangan...</span>
      </div>
    );
  }

  const displayFlights = searchResults.length > 0 ? searchResults : flights;

  if (displayFlights.length === 0) {
    return (
      <div className="py-12 text-center">
        <FaPlane size={64} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Tidak ada penerbangan ditemukan</h3>
        <p className="text-gray-500 dark:text-gray-400">Coba ubah kriteria pencarian Anda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchResults.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Hasil Pencarian ({searchResults.length} penerbangan ditemukan)
          </h3>
          <button
            onClick={() => {
              setSearchResults([]);
              setSearchFilters({});
            }}
            className="text-sm font-medium text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Tampilkan Semua
          </button>
        </div>
      )}
      
      <div className="grid gap-4">
        {displayFlights.map((flight) => (
          <FlightCard 
            key={flight.id} 
            flight={flight} 
            onSelect={handleSelectFlight}
          />
        ))}
      </div>

      {searchResults.length > 0 && (
        <div className="p-4 mt-6 transition-colors border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-300">Filter Pencarian Aktif:</h4>
          <div className="flex flex-wrap gap-2">
            {searchFilters.from && (
              <span className="px-3 py-1 text-sm text-blue-800 bg-blue-200 rounded-full dark:bg-blue-800/50 dark:text-blue-300">
                Dari: {searchFilters.from}
              </span>
            )}
            {searchFilters.to && (
              <span className="px-3 py-1 text-sm text-blue-800 bg-blue-200 rounded-full dark:bg-blue-800/50 dark:text-blue-300">
                Ke: {searchFilters.to}
              </span>
            )}
            {searchFilters.departureDate && (
              <span className="px-3 py-1 text-sm text-blue-800 bg-blue-200 rounded-full dark:bg-blue-800/50 dark:text-blue-300">
                Tanggal: {searchFilters.departureDate}
              </span>
            )}
            {searchFilters.class && (
              <span className="px-3 py-1 text-sm text-blue-800 bg-blue-200 rounded-full dark:bg-blue-800/50 dark:text-blue-300">
                Kelas: {searchFilters.class}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightList;
