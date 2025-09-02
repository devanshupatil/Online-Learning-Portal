import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import ScheduleCard from "./ScheduleCard";
import ExamInfoCard from "./ExamInfoCard";
import ClassSection from "./ClassSection";
import ActionButton from "./ActionButton";
import HeroSection from "./HeroSection";
import Footer from "./Footer";

const Home = () => {

   const scheduleData = [
    {
      subject: 'Mathematics',
      time: '11:00 AM - 12:00 PM',
      subjectColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      subject: 'Physics',
      time: '12:00 PM - 1:00 PM',
      subjectColor: 'text-red-600',
      borderColor: 'border-red-500',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      subject: 'Chemistry',
      time: '1:30 PM - 2:30 PM',
      subjectColor: 'text-green-600',
      borderColor: 'border-green-500',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      subject: 'Biology',
      time: '2:30 PM - 3:30 PM',
      subjectColor: 'text-purple-600',
      borderColor: 'border-purple-500',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];


  return (

    <div className="bg-white">
        <Header />
        {/* <Navigation /> */}
        <HeroSection />

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Exam Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Exam Information</h2>
              
              {/* Students Section */}
              <ExamInfoCard title="For Students" titleColor="text-blue-600">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Mock Tests</span>
                    <ActionButton color="bg-blue-600 hover:bg-blue-700">
                      Take Test
                    </ActionButton>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Study Materials</span>
                    <ActionButton color="bg-green-600 hover:bg-green-700">
                      Download
                    </ActionButton>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Progress Tracking</span>
                    <ActionButton color="bg-purple-600 hover:bg-purple-700">
                      View Report
                    </ActionButton>
                  </div>
                </div>
              </ExamInfoCard>

              {/* Class Sections */}
              <ClassSection
                className="Class 11"
                timing="6:00 AM - 8:00 AM"
                fees="₹15,000/month"
                titleColor="text-indigo-600"
                buttonColor="bg-indigo-600 hover:bg-indigo-700"
              />

              <ClassSection
                className="Class 12"
                timing="8:30 AM - 10:30 AM"
                fees="₹18,000/month"
                titleColor="text-emerald-600"
                buttonColor="bg-emerald-600 hover:bg-emerald-700"
              />
            </div>

            {/* Right Column - Daily Schedule */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Teaching Schedule</h2>
              
              <div className="space-y-4">
                {scheduleData.map((schedule, index) => (
                  <ScheduleCard
                    key={index}
                    subject={schedule.subject}
                    time={schedule.time}
                    subjectColor={schedule.subjectColor}
                    borderColor={schedule.borderColor}
                    buttonColor={schedule.buttonColor}
                  />
                ))}
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>

  );
}

export default Home;