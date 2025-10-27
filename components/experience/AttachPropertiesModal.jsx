import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetMyPropertiesQuery } from "@/store/features/propertiesApi";
import { useAttachPropertiesMutation } from "@/store/features/experienceApi";

const AttachPropertiesModal = ({ isOpen, onClose, experienceId, properties }) => {
    // 1. Fetch all available properties from the new API slice
    // const { data: properties, isLoading: isLoadingProperties, error } = useGetMyPropertiesQuery();
    
    // 2. State to hold the IDs of the checked properties
    const [selectedIds, setSelectedIds] = useState(new Set());

    // 3. Mutation to send the selected IDs to the server
    const [attachProperties, { isLoading: isAttaching }] = useAttachPropertiesMutation();

    // Reset the selection when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setSelectedIds(new Set());
        }
    }, [isOpen]);

    // Handler to toggle a property's selection state
    const handleCheckboxChange = (propertyId) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(propertyId)) {
                newSet.delete(propertyId);
            } else {
                newSet.add(propertyId);
            }
            return newSet;
        });
    };

    const handleSubmit = async () => {
        if (!experienceId) return;
        try {
            await attachProperties({
                experienceId,
                propertyIds: Array.from(selectedIds),
            }).unwrap();
            // You can add a success toast here
            onClose();
        } catch (err) {
            console.error("Failed to attach properties:", err);
            // You can add an error toast here
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Attach Properties</DialogTitle>
                    <DialogDescription>
                        Select the properties you want to associate with this experience.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {properties && properties.items.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {properties.items.map(property => (
                                <div key={property.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-gray-50">
                                    <Checkbox
                                        id={property.id}
                                        checked={selectedIds.has(property.id)}
                                        onCheckedChange={() => handleCheckboxChange(property.id)}
                                    />
                                    <Label htmlFor={property.id} className="font-normal w-full cursor-pointer">
                                        {property.title || 'Unnamed Property'} {/* Assuming property has a 'name' */}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No properties available to attach.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isAttaching}>
                        {isAttaching ? "Saving..." : "Save Attachments"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AttachPropertiesModal;
