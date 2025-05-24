"use client"

import { useState, useEffect } from "react"
import { FaFilter, FaSort, FaTimes, FaCheck } from "react-icons/fa"

const FilterBar = ({ events, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [filters, setFilters] = useState({
    types: [],
    tags: [],
    status: [],
    sortBy: "date-asc",
  })

  // Extract all unique tags from events
  const allTags = [...new Set(events.flatMap((event) => event.tags))].sort()

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters }

      if (filterType === "sortBy") {
        newFilters.sortBy = value
      } else {
        const index = newFilters[filterType].indexOf(value)
        if (index === -1) {
          newFilters[filterType] = [...newFilters[filterType], value]
        } else {
          newFilters[filterType] = newFilters[filterType].filter((item) => item !== value)
        }
      }

      return newFilters
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      types: [],
      tags: [],
      status: [],
      sortBy: "date-asc",
    })
  }

  // Toggle mobile filter menu
  const toggleFilterMenu = () => {
    setIsOpen(!isOpen)
  }

  // Toggle dropdown on click
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown])

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  return (
    <div className="bg-white shadow-sm mb-6">
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4">
        <button
          onClick={toggleFilterMenu}
          className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center text-gray-700"
        >
          <FaFilter className="mr-2" />
          Filters
          <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
            {filters.types.length + filters.tags.length + filters.status.length || 0}
          </span>
        </button>
      </div>

      {/* Mobile Filter Menu */}
      {isOpen && (
        <div className="md:hidden p-4 border-t border-gray-100">
          {/* Mobile filter content */}
          <div className="space-y-4">
            {/* Event Type Filter */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Event Type</h3>
              <div className="space-y-2">
                {["hackathon", "contest"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange("types", type)}
                    />
                    <span
                      className={`w-5 h-5 mr-2 flex items-center justify-center border rounded ${
                        filters.types.includes(type) ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {filters.types.includes(type) && <FaCheck className="text-xs" />}
                    </span>
                    <span className="capitalize">{type}s</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.tags.includes(tag)}
                      onChange={() => handleFilterChange("tags", tag)}
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.tags.includes(tag)
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Status</h3>
              <div className="space-y-2">
                {["upcoming", "today", "soon", "ended"].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.status.includes(status)}
                      onChange={() => handleFilterChange("status", status)}
                    />
                    <span
                      className={`w-5 h-5 mr-2 flex items-center justify-center border rounded ${
                        filters.status.includes(status) ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {filters.status.includes(status) && <FaCheck className="text-xs" />}
                    </span>
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: "date-asc", label: "Date (Earliest First)" },
                  { value: "date-desc", label: "Date (Latest First)" },
                  { value: "name-asc", label: "Name (A-Z)" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="sortBy"
                      className="hidden"
                      checked={filters.sortBy === option.value}
                      onChange={() => handleFilterChange("sortBy", option.value)}
                    />
                    <span
                      className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${
                        filters.sortBy === option.value ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {filters.sortBy === option.value && <FaCheck className="text-xs" />}
                    </span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center"
            >
              <FaTimes className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop Filter Bar */}
      <div className="hidden md:flex flex-wrap items-center justify-between p-4">
        {/* Left side filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Event Type Filter */}
          <div className="relative dropdown-container">
            <button 
              onClick={() => toggleDropdown('types')}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700"
            >
              Event Type
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
                {filters.types.length || 0}
              </span>
            </button>
            {activeDropdown === 'types' && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                {["hackathon", "contest"].map((type) => (
                  <label 
                    key={type} 
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange("types", type)}
                    />
                    <span
                      className={`w-5 h-5 mr-2 flex items-center justify-center border rounded ${
                        filters.types.includes(type) ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {filters.types.includes(type) && <FaCheck className="text-xs" />}
                    </span>
                    <span className="capitalize">{type}s</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tags Filter */}
          <div className="relative dropdown-container">
            <button 
              onClick={() => toggleDropdown('tags')}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700"
            >
              Tags
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
                {filters.tags.length || 0}
              </span>
            </button>
            {activeDropdown === 'tags' && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {allTags.map((tag) => (
                    <label 
                      key={tag} 
                      className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.tags.includes(tag)}
                        onChange={() => handleFilterChange("tags", tag)}
                      />
                      <span
                        className={`w-4 h-4 mr-2 flex items-center justify-center border rounded ${
                          filters.tags.includes(tag) ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                        }`}
                      >
                        {filters.tags.includes(tag) && <FaCheck className="text-xs" />}
                      </span>
                      <span className="text-sm truncate">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative dropdown-container">
            <button 
              onClick={() => toggleDropdown('status')}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700"
            >
              Status
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
                {filters.status.length || 0}
              </span>
            </button>
            {activeDropdown === 'status' && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                {["upcoming", "today", "soon", "ended"].map((status) => (
                  <label 
                    key={status} 
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filters.status.includes(status)}
                      onChange={() => handleFilterChange("status", status)}
                    />
                    <span
                      className={`w-5 h-5 mr-2 flex items-center justify-center border rounded ${
                        filters.status.includes(status) ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {filters.status.includes(status) && <FaCheck className="text-xs" />}
                    </span>
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side sort */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => toggleDropdown('sort')}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700"
          >
            <FaSort className="mr-2" />
            Sort By
          </button>
          {activeDropdown === 'sort' && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              {[
                { value: "date-asc", label: "Date (Earliest First)" },
                { value: "date-desc", label: "Date (Latest First)" },
                { value: "name-asc", label: "Name (A-Z)" },
              ].map((option) => (
                <label 
                  key={option.value} 
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    className="hidden"
                    checked={filters.sortBy === option.value}
                    onChange={() => handleFilterChange("sortBy", option.value)}
                  />
                  <span
                    className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${
                      filters.sortBy === option.value ? "bg-purple-600 border-purple-600 text-white" : "border-gray-300"
                    }`}
                  >
                    {filters.sortBy === option.value && <FaCheck className="text-xs" />}
                  </span>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
