"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/store/slices/searchSlice";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FilterModal = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.search);

    const countActiveFilters = () => {
        let count = 0;
        if (filters.priceRange.min > 0 || filters.priceRange.max < 1000)
            count++;
        if (filters.hasExperiences) count++;
        return count;
    };

    const clearAll = () => {
        dispatch(
            setFilters({
                priceRange: { min: 0, max: 1000 },
                hasExperiences: false,
            })
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="rounded-full flex items-center gap-2 hover:bg-gray-100 px-4 h-full"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm font-medium">Filters</span>
                    {countActiveFilters() > 0 && (
                        <Badge className="bg-[#814193] text-white rounded-full px-2">
                            {countActiveFilters()}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-3xl">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="text-center text-base">
                        Filters
                    </DialogTitle>
                </DialogHeader>

                <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                    {/* Price Range Section */}
                    <section>
                        <h3 className="text-xl font-semibold mb-2">
                            Price range
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Nightly prices before fees and taxes
                        </p>
                        <div className="px-4">
                            <Slider
                                value={[
                                    filters.priceRange.min,
                                    filters.priceRange.max,
                                ]}
                                max={1000}
                                step={10}
                                onValueChange={([min, max]) =>
                                    dispatch(
                                        setFilters({ priceRange: { min, max } })
                                    )
                                }
                                className="mb-6"
                            />
                            <div className="flex gap-4">
                                <div className="flex-1 border rounded-xl p-3">
                                    <div className="text-xs text-gray-500">
                                        Minimum
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">$</span>
                                        <input
                                            type="number"
                                            value={filters.priceRange.min}
                                            readOnly
                                            className="w-full focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 border rounded-xl p-3">
                                    <div className="text-xs text-gray-500">
                                        Maximum
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">$</span>
                                        <input
                                            type="number"
                                            value={filters.priceRange.max}
                                            readOnly
                                            className="w-full focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr />

                    {/* Experiences Section */}
                    <section className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">
                                Free experiences
                            </h3>
                            <p className="text-gray-500">
                                Only show properties with inclusive tours
                            </p>
                        </div>
                        <Checkbox
                            id="exp"
                            className="h-6 w-6 rounded-md border-gray-300 data-[state=checked]:bg-[#814193]"
                            checked={filters.hasExperiences}
                            onCheckedChange={(checked) =>
                                dispatch(
                                    setFilters({ hasExperiences: checked })
                                )
                            }
                        />
                    </section>
                </div>

                <DialogFooter className="p-4 border-t bg-white flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={clearAll}
                        className="underline font-semibold"
                    >
                        Clear all
                    </Button>
                    <Button className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-xl">
                        Show results
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;
