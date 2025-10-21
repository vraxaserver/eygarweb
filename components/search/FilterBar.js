'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, Filter, SlidersHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setFilters } from '@/store/slices/searchSlice';

const FilterBar = () => {
    const dispatch = useAppDispatch();
    const { filters } = useAppSelector((state) => state.search);
    const [showFilters, setShowFilters] = useState(false);

    const activeFilters = [
        { id: 'price', label: `$${filters.priceRange.min} - $${filters.priceRange.max}`, type: 'price' },
        { id: 'experiences', label: 'Free experiences', type: 'experiences', active: filters.hasExperiences },
    ].filter(filter => filter.active !== false);

    const clearFilter = (filterId) => {
        switch (filterId) {
            case 'price':
                dispatch(setFilters({ priceRange: { min: 0, max: 1000 } }));
                break;
            case 'experiences':
                dispatch(setFilters({ hasExperiences: false }));
                break;
        }
    };

    const clearAllFilters = () => {
        dispatch(setFilters({
            priceRange: { min: 0, max: 1000 },
            propertyType: [],
            amenities: [],
            hostLanguages: [],
            bookingOptions: [],
            hasExperiences: false,
        }));
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Active Filters */}
                    <div className="flex items-center space-x-3">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="flex items-center space-x-2 rounded-full border-gray-300 hover:border-[#814193]">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span>Filters</span>
                                    {activeFilters.length > 0 && (
                                        <Badge className="ml-1 bg-[#814193] text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {activeFilters.length}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0" align="start">
                                <div className="p-6 max-h-[600px] overflow-y-auto">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold">Filters</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowFilters(false)}
                                            className="h-auto p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Price Range */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium mb-3">Price range</h4>
                                        <div className="px-3">
                                            <Slider
                                                value={[filters.priceRange.min, filters.priceRange.max]}
                                                onValueChange={(value) =>
                                                    dispatch(setFilters({
                                                        priceRange: { min: value[0], max: value[1] }
                                                    }))
                                                }
                                                max={1000}
                                                min={0}
                                                step={10}
                                                className="mb-3"
                                            />
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>${filters.priceRange.min}</span>
                                                <span>${filters.priceRange.max}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experiences */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="hasExperiences"
                                                checked={filters.hasExperiences}
                                                onCheckedChange={(checked) =>
                                                    dispatch(setFilters({ hasExperiences: checked }))
                                                }
                                            />
                                            <label htmlFor="hasExperiences" className="text-base font-medium">
                                                Free experiences
                                            </label>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <Button
                                            variant="ghost"
                                            onClick={clearAllFilters}
                                        >
                                            Clear all
                                        </Button>
                                        <Button
                                            className="bg-[#814193] hover:bg-[#6d3580] text-white"
                                            onClick={() => setShowFilters(false)}
                                        >
                                            Show results
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {activeFilters.map((filter) => (
                            <Badge
                                key={filter.id}
                                variant="secondary"
                                className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-full"
                            >
                                {filter.label}
                                <X
                                    className="h-3 w-3 ml-2 cursor-pointer"
                                    onClick={() => clearFilter(filter.id)}
                                />
                            </Badge>
                        ))}
                    </div>

                    {/* Clear All */}
                    {activeFilters.length > 0 && (
                        <Button
                            variant="ghost"
                            onClick={clearAllFilters}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Clear all
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
