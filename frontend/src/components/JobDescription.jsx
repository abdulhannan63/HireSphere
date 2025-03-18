import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaClock, FaUsers } from 'react-icons/fa';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-10'>
                <div className='bg-white/80 backdrop-blur-lg shadow-lg rounded-lg p-6 md:p-10'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>{singleJob?.title}</h1>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                <Badge className='bg-blue-100 text-blue-700'><FaBriefcase className='mr-1' /> {singleJob?.postion} Positions</Badge>
                                <Badge className='bg-red-100 text-red-700'><FaClock className='mr-1' /> {singleJob?.jobType}</Badge>
                                <Badge className='bg-purple-100 text-purple-700'><FaMoneyBillWave className='mr-1' /> {singleJob?.salary} LPA</Badge>
                            </div>
                        </div>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-lg px-6 py-3 text-white font-medium transition-all duration-300 ${isApplied ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>
                    <h2 className='border-b-2 border-gray-300 font-semibold text-lg py-4 mt-6'>Job Details</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700'>
                        <p><FaBriefcase className='inline text-indigo-600 mr-2' /> Role: <span className='font-medium'>{singleJob?.title}</span></p>
                        <p><FaMapMarkerAlt className='inline text-indigo-600 mr-2' /> Location: <span className='font-medium'>{singleJob?.location}</span></p>
                        <p><FaClock className='inline text-indigo-600 mr-2' /> Experience: <span className='font-medium'>{singleJob?.experience} yrs</span></p>
                        <p><FaMoneyBillWave className='inline text-indigo-600 mr-2' /> Salary: <span className='font-medium'>{singleJob?.salary} LPA</span></p>
                        <p><FaUsers className='inline text-indigo-600 mr-2' /> Applicants: <span className='font-medium'>{singleJob?.applications?.length}</span></p>
                        <p><FaClock className='inline text-indigo-600 mr-2' /> Posted: <span className='font-medium'>{singleJob?.createdAt.split("T")[0]}</span></p>
                    </div>
                    <h2 className='border-b-2 border-gray-300 font-semibold text-lg py-4 mt-6'>Job Description</h2>
                    <p className='text-gray-800 mt-2 leading-relaxed'>{singleJob?.description}</p>
                </div>
            </div>
        </>
    );
};

export default JobDescription;
