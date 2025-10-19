import JobCard from "./JobCard";

const MainContent = () => {
    return (
        <div className="text-white grid grid-cols-1 gap-4">
            <JobCard/>
            <JobCard/>
            <JobCard/>
            <JobCard/>
            <JobCard/>
            <JobCard/>
        </div>
    );
};

export default MainContent;