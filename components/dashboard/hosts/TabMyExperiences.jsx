// src/features/dashboard/tabs/TabMyExperiences.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Eye,
    Edit,
    Trash2,
    Plus,
    MapPin,
    Clock,
    Link as LinkIcon,
} from "lucide-react";
import { 
    useGetMyExperiencesQuery,
    useAddExperienceMutation,
    useUpdateExperienceMutation,
    useDeleteExperienceMutation,
} from "@/store/features/experienceApi";
import { useGetMyPropertiesQuery } from "@/store/features/propertiesApi";
import ExperienceFormModal from "@/components/experience/ExperienceFormModal"; // Adjust path if needed
import DeleteConfirmationDialog from "@/components/experience/DeleteConfirmationDialog"; // Adjust path if needed
import AttachPropertiesModal from "@/components/experience/AttachPropertiesModal";

// Note: You might want to add a toast library like 'react-hot-toast' or 'sonner' for user feedback.

const TabMyExperiences = () => {
    // === RTK Query Hooks ===
    const { data: experiences, error, isLoading } = useGetMyExperiencesQuery();
    const [addExperience, { isLoading: isAdding }] = useAddExperienceMutation();
    const [updateExperience, { isLoading: isUpdating }] = useUpdateExperienceMutation();
    const [deleteExperience, { isLoading: isDeleting }] = useDeleteExperienceMutation();
    const { data: properties, isLoading: isLoadingProperties } = useGetMyPropertiesQuery();

    // === Component State ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null); // Holds experience data for editing
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [deletingExperienceId, setDeletingExperienceId] = useState(null);

    const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
    const [attachingExperienceId, setAttachingExperienceId] = useState(null);


    // === Handlers ===
    const handleCreateClick = () => {
        setEditingExperience(null); // Ensure form is empty
        setIsModalOpen(true);
    };

    const handleEditClick = (experience) => {
        setEditingExperience(experience);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeletingExperienceId(id);
        setIsAlertOpen(true);
    };
    
    const handleFormSubmit = async (formData) => {
        try {
            if (editingExperience) {
                // Update existing experience
                await updateExperience({ id: editingExperience.id, ...formData }).unwrap();
                // Add toast.success('Experience updated successfully!');
            } else {
                // Create new experience
                await addExperience(formData).unwrap();
                // Add toast.success('Experience created successfully!');
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save the experience:", err);
            // Add toast.error('Failed to save experience.');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteExperience(deletingExperienceId).unwrap();
            // Add toast.success('Experience deleted successfully!');
            setIsAlertOpen(false);
            setDeletingExperienceId(null);
        } catch (err) {
            console.error("Failed to delete the experience:", err);
            // Add toast.error('Failed to delete experience.');
        }
    };

    const handleAttachPropertiesClick = (id) => {
        setAttachingExperienceId(id);
        setIsAttachModalOpen(true);
    };

    // === Render Logic ===
    if (isLoading) return <div>Loading experiences...</div>;
    if (error) return <div>An error occurred: {error.message || "Something went wrong"}</div>;
    console.log('properties', properties)
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Experience Management</h2>
                    <p className="text-gray-600">Create and manage unique experiences for your guests</p>
                </div>
                <Button onClick={handleCreateClick} className="bg-[#7a3d8a] hover:bg-purple-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Experience
                </Button>
            </div>

            {experiences && experiences.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {experiences.map((experience) => (
                     <Card key={experience.id} className="p-0 group hover:shadow-lg transition-all">
                         <CardContent className="p-0">
                             <div className="relative">
                                 <img
                                     src={experience.image_url}
                                     alt={experience.title}
                                     className="w-full h-48 object-cover rounded-t-lg"
                                 />
                                 
                                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    {/* Quick actions on hover */}
                                     <Button variant="secondary" size="sm" className="w-8 h-8 p-0" onClick={() => handleEditClick(experience)}>
                                         <Edit className="w-4 h-4" />
                                     </Button>
                                     <Button variant="secondary" size="sm" className="w-8 h-8 p-0 text-red-600 hover:bg-red-100" onClick={() => handleDeleteClick(experience.id)}>
                                         <Trash2 className="w-4 h-4" />
                                     </Button>
                                 </div>
                             </div>
                             <div className="p-4">
                                 <h3 className="font-semibold text-gray-900 mb-1 truncate" title={experience.title}>
                                     {experience.title}
                                 </h3>
                                 <p className="text-sm text-gray-600 mb-2 flex items-start" title={experience.description}>
                                     <MapPin className="w-3 h-3 mr-1.5 mt-1 flex-shrink-0" />
                                     <span className="line-clamp-2">{experience.description}</span>
                                 </p>
                                 
                                 <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                                     <div className="flex items-center">
                                         <Clock className="w-3 h-3 mr-1" />
                                         Min. {experience.min_nights} nights
                                     </div>
                                 </div>

                                 <div className="flex space-x-2">
                                     <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAttachPropertiesClick(experience.id)}>
                                         <LinkIcon className="w-4 h-4 mr-1" />
                                         Properties
                                     </Button>
                                     <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditClick(experience)}>
                                         <Edit className="w-4 h-4 mr-1" />
                                         Edit
                                     </Button>
                                 </div>
                             </div>
                         </CardContent>
                     </Card>
                 ))}
             </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium">No experiences found</h3>
                    <p className="text-gray-600 mt-2">Get started by creating your first experience.</p>
                    <Button onClick={handleCreateClick} className="mt-4 bg-[#7a3d8a] hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Experience
                    </Button>
                </div>
            )}
           

            {/* Modals and Dialogs */}
            <ExperienceFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                experience={editingExperience}
                isLoading={isAdding || isUpdating}
            />
            <DeleteConfirmationDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
            <AttachPropertiesModal
                isOpen={isAttachModalOpen}
                onClose={() => setIsAttachModalOpen(false)}
                experienceId={attachingExperienceId}
                properties={properties}
            />
        </>
    );
};

export default TabMyExperiences;
