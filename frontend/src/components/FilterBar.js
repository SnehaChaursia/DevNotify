"use client"

import { useState, useEffect } from "react"
import { FaFilter, FaSort, FaTimes, FaCheck } from "react-icons/fa"

const FilterBar = ({ events, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)
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

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  return (
    <div className="filter-bar bg-white shadow-sm rounded-lg mb-6">
      {/* Mobile Filter Button */}
      <div className="md:hidden p-4 flex justify-between items-center">
        <button
          onClick={toggleFilterMenu}
          className="flex items-center text-gray-700 font-medium"
          aria-expanded={isOpen}
        >
          <FaFilter className="mr-2" />
          Filters{" "}
          {Object.values(filters).flat().length > 0 && (
            <span className="ml-1">({Object.values(filters).flat().length})</span>
          )}
        </button>
        {Object.values(filters).flat().length > 0 && (
          <button onClick={clearFilters} className="text-sm text-purple-600">
            Clear All
          </button>
        )}
      </div>

      {/* Filter Content - Mobile (Collapsible) */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} border-t border-gray-100 p-4`}>
        <div className="space-y-4">
          {/* Event Type Filter */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Event Type</h3>
            <div className="space-y-2">
              {["hackathon", "contest"].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
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

          {/* Status Filter */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Status</h3>
            <div className="space-y-2">
              {["upcoming", "soon", "today", "ended"].map((status) => (
                <label key={status} className="flex items-center cursor-pointer">
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

          {/* Tags Filter */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange("tags", tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.tags.includes(tag)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Sort By</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="hidden"
                  checked={filters.sortBy === "date-asc"}
                  onChange={() => handleFilterChange("sortBy", "date-asc")}
                />
                <span
                  className={`w-4 h-4 mr-2 rounded-full border ${
                    filters.sortBy === "date-asc" ? "border-4 border-purple-600" : "border-gray-300"
                  }`}
                ></span>
                <span>Date (Soonest First)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="hidden"
                  checked={filters.sortBy === "date-desc"}
                  onChange={() => handleFilterChange("sortBy", "date-desc")}
                />
                <span
                  className={`w-4 h-4 mr-2 rounded-full border ${
                    filters.sortBy === "date-desc" ? "border-4 border-purple-600" : "border-gray-300"
                  }`}
                ></span>
                <span>Date (Latest First)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="hidden"
                  checked={filters.sortBy === "name-asc"}
                  onChange={() => handleFilterChange("sortBy", "name-asc")}
                />
                <span
                  className={`w-4 h-4 mr-2 rounded-full border ${
                    filters.sortBy === "name-asc" ? "border-4 border-purple-600" : "border-gray-300"
                  }`}
                ></span>
                <span>Name (A-Z)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:flex flex-wrap items-center justify-between p-4">
        {/* Left side filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Event Type Filter */}
          <div className="relative group">
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700">
              Event Type
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
                {filters.types.length || 0}
              </span>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 hidden group-hover:block">
              {["hackathon", "contest"].map((type) => (
                <label key={type} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
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

          {/* Status Filter */}
          <div className="relative group">
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700">
              Status
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
                {filters.status.length || 0}
              </span>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 hidden group-hover:block">
              {["upcoming", "soon", "today", "ended"].map((status) => (
                <label key={status} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
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

          {/* Tags Filter */}
          <div className="relative group">
            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700">
              Tags
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center">
                {filters.tags.length || 0}
              </span>
            </button>
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 z-50 hidden group-hover:block">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleFilterChange("tags", tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.tags.includes(tag)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.types.length > 0 || filters.tags.length > 0 || filters.status.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.types.map((type) => (
                <div
                  key={type}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span className="capitalize">{type}s</span>
                  <button
                    onClick={() => handleFilterChange("types", type)}
                    className="ml-1 text-purple-700 hover:text-purple-900"
                    aria-label={`Remove ${type} filter`}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              {filters.status.map((status) => (
                <div
                  key={status}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span className="capitalize">{status}</span>
                  <button
                    onClick={() => handleFilterChange("status", status)}
                    className="ml-1 text-purple-700 hover:text-purple-900"
                    aria-label={`Remove ${status} filter`}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              {filters.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => handleFilterChange("tags", tag)}
                    className="ml-1 text-purple-700 hover:text-purple-900"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
              {(filters.types.length > 0 || filters.tags.length > 0 || filters.status.length > 0) && (
                <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-800">
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right side - Sort options */}
        <div className="relative group">
          <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center text-gray-700">
            <FaSort className="mr-2" />
            Sort
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 hidden group-hover:block">
            <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                className="hidden"
                checked={filters.sortBy === "date-asc"}
                onChange={() => handleFilterChange("sortBy", "date-asc")}
              />
              <span
                className={`w-4 h-4 mr-2 rounded-full border ${
                  filters.sortBy === "date-asc" ? "border-4 border-purple-600" : "border-gray-300"
                }`}
              ></span>
              <span>Date (Soonest First)</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                className="hidden"
                checked={filters.sortBy === "date-desc"}
                onChange={() => handleFilterChange("sortBy", "date-desc")}
              />
              <span
                className={`w-4 h-4 mr-2 rounded-full border ${
                  filters.sortBy === "date-desc" ? "border-4 border-purple-600" : "border-gray-300"
                }`}
              ></span>
              <span>Date (Latest First)</span>
            </label>
            <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                className="hidden"
                checked={filters.sortBy === "name-asc"}
                onChange={() => handleFilterChange("sortBy", "name-asc")}
              />
              <span
                className={`w-4 h-4 mr-2 rounded-full border ${
                  filters.sortBy === "name-asc" ? "border-4 border-purple-600" : "border-gray-300"
                }`}
              ></span>
              <span>Name (A-Z)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
