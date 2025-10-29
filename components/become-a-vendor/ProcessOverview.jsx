import React from 'react';
import Icon from '@/components/AppIcon';

const ProcessOverview = () => {
  const steps = [
    {
      id: 1,
      title: "Profile Completion",
      description: "Complete your host profile with personal and contact information",
      icon: "User",
      duration: "3-4 minutes",
      status: "required"
    },
    {
      id: 2,
      title: "Identity Verification",
      description: "Upload government ID and verify your identity for platform security",
      icon: "Shield",
      duration: "2-3 minutes",
      status: "required"
    },
    {
      id: 3,
      title: "Contact Verification",
      description: "Verify your phone number and email address",
      icon: "Phone",
      duration: "1-2 minutes",
      status: "required"
    }
  ];

  return (
    <div className="bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple 3-Step Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined verification process ensures you're ready to start hosting safely and successfully. Complete all steps to unlock full platform benefits.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {steps?.map((step, index) => (
            <div key={step?.id} className="relative">
              {/* Step Card */}
              <div className="bg-background border border-border rounded-xl p-6 h-full hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                {/* Step Number & Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {step?.id}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    step?.status === 'required' ?'bg-error/10 text-error' :'bg-muted text-muted-foreground'
                  }`}>
                    {step?.status}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={step?.icon} size={24} className="text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step?.description}
                  </p>
                  
                  {/* Duration */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>{step?.duration}</span>
                  </div>
                </div>
              </div>

              {/* Connector Line (Desktop) */}
              {index < steps?.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-border z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Process Summary */}
        <div className="bg-muted/50 rounded-xl p-6 lg:p-8">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-foreground mb-2">
                Total Time: 10-15 minutes
              </div>
              <p className="text-muted-foreground">
                Complete verification at your own pace
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span>Required Steps</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  <span>Optional Steps</span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="flex items-center justify-center lg:justify-end space-x-2 text-sm text-success">
                <Icon name="Shield" size={16} />
                <span className="font-medium">Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessOverview;
