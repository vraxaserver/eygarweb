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
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUploadExperienceImageMutation } from "@/store/features/experienceApi";

const ExperienceFormModal = ({ isOpen, onClose, onSubmit, experience, hostId, isLoading }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image_url: "",
        min_nights: 1,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const [uploadExperienceImage] = useUploadExperienceImageMutation();

    // Check if we are in "edit" mode
    const isEditMode = Boolean(experience);

    useEffect(() => {
        setUploadError("");
        setSelectedFile(null);

        if (isEditMode) {
            setFormData({
                title: experience.title || "",
                description: experience.description || "",
                image_url: experience.image_url || "",
                min_nights: experience.min_nights || 1,
            });
            setPreviewUrl(experience.image_url || "");
        } else {
            setFormData({
                title: "",
                description: "",
                image_url: "",
                min_nights: 1,
            });
            setPreviewUrl("");
        }
    }, [experience, isOpen, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");
        setSelectedFile(file);

        // Generate local preview URL immediately
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setFormData((prev) => ({ ...prev, image_url: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError("");

        try {
            let finalImageUrl = formData.image_url;

            // If user selected a new file, upload it to S3 under `hosts/{host_id}/experiences/{experience_id}`
            if (selectedFile) {
                setIsUploading(true);
                const uploadData = new FormData();
                uploadData.append("image", selectedFile);
                
                // Construct path: hosts/<host_id>/experiences/<experience_id> (or hosts/<host_id>/experiences)
                const hostPath = hostId ? `hosts/${hostId}` : "hosts";
                const expPath = experience?.id ? `experiences/${experience.id}` : "experiences";
                const subfolder = `${hostPath}/${expPath}`;
                
                uploadData.append("subfolder", subfolder);
                uploadData.append("alt_text", formData.title || selectedFile.name);

                const response = await uploadExperienceImage(uploadData).unwrap();
                finalImageUrl = response.image_url;
            }

            if (!finalImageUrl) {
                setUploadError("Please upload or select an experience image.");
                return;
            }

            onSubmit({
                ...formData,
                image_url: finalImageUrl,
            });
        } catch (err) {
            console.error("Failed to upload image:", err);
            setUploadError(err?.data?.detail || err?.message || "Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Experience" : "Create New Experience"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right font-medium">Title *</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
                        </div>

                        {/* Description */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right font-medium">Description *</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" rows={3} required />
                        </div>

                        {/* Image Upload & Preview Section */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2 font-medium">Image *</Label>
                            <div className="col-span-3 space-y-2">
                                {previewUrl ? (
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={previewUrl}
                                            alt="Experience Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-rose-600">Click to upload image</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}

                                {uploadError && (
                                    <p className="text-xs text-red-600">{uploadError}</p>
                                )}
                            </div>
                        </div>

                        {/* Min. Nights */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="min_nights" className="text-right font-medium">Min. Nights</Label>
                            <Input id="min_nights" name="min_nights" type="number" min="1" value={formData.min_nights} onChange={handleChange} className="col-span-3" required />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading || isUploading} className="bg-rose-600 hover:bg-rose-700 text-white">
                            {isUploading ? "Uploading Image..." : isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create Experience"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExperienceFormModal;