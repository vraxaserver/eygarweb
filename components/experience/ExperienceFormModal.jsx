// src/components/experience/ExperienceFormModal.jsx
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ExperienceFormModal = ({ isOpen, onClose, onSubmit, experience, isLoading }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image_url: "",
        min_nights: 1,
    });

    // Check if we are in "edit" mode
    const isEditMode = Boolean(experience);

    useEffect(() => {
        // If an experience is passed, populate the form for editing
        if (isEditMode) {
            setFormData({
                title: experience.title,
                description: experience.description,
                image_url: experience.image_url,
                min_nights: experience.min_nights,
            });
        } else {
            // Otherwise, reset the form for creating
            setFormData({
                title: "",
                description: "",
                image_url: "",
                min_nights: 1,
            });
        }
    }, [experience, isOpen]); // Rerun when the experience prop changes or modal opens

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Experience" : "Create New Experience"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image_url" className="text-right">Image URL</Label>
                            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="min_nights" className="text-right">Min. Nights</Label>
                            <Input id="min_nights" name="min_nights" type="number" min="1" value={formData.min_nights} onChange={handleChange} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExperienceFormModal;