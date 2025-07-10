import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ApplicationForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        const application = {
            ...data,
            status: 'Pending',
            healthDisclosure: data.healthDisclosure || [], // ensure array
        };

        try {
            const res = await axiosSecure.post('/applications', application);
            if (res.status === 201 || res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'We’ll review your information shortly.',
                    background: '#e0f9e6', // Light green background
                    confirmButtonColor: '#28a745', // Green button color
                });
                reset();
            }
        } catch (error) {
            console.error('Application Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again.',
                background: '#f8d7da', // Light red background
                confirmButtonColor: '#dc3545', // Red button color
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">Insurance Application Form</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                            })}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            {...register('address', { required: 'Address is required' })}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">NID/SSN</label>
                        <input
                            {...register('nid', { required: 'NID/SSN is required' })}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.nid && <p className="text-red-500 text-sm">{errors.nid.message}</p>}
                    </div>
                </div>

                {/* Nominee Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Nominee Name</label>
                        <input
                            {...register('nomineeName', { required: 'Nominee name is required' })}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.nomineeName && <p className="text-red-500 text-sm">{errors.nomineeName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Nominee Relationship</label>
                        <input
                            {...register('nomineeRelation', { required: 'Relationship is required' })}
                            className="input input-bordered w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.nomineeRelation && <p className="text-red-500 text-sm">{errors.nomineeRelation.message}</p>}
                    </div>
                </div>

                {/* Health Disclosure */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Health Disclosure (check all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <label className="flex items-center"><input type="checkbox" value="Diabetes" {...register('healthDisclosure')} className="mr-2" />Diabetes</label>
                        <label className="flex items-center"><input type="checkbox" value="Heart Disease" {...register('healthDisclosure')} className="mr-2" />Heart Disease</label>
                        <label className="flex items-center"><input type="checkbox" value="Cancer" {...register('healthDisclosure')} className="mr-2" />Cancer</label>
                        <label className="flex items-center"><input type="checkbox" value="Hypertension" {...register('healthDisclosure')} className="mr-2" />Hypertension</label>
                        <label className="flex items-center"><input type="checkbox" value="Asthma" {...register('healthDisclosure')} className="mr-2" />Asthma</label>
                        <label className="flex items-center"><input type="checkbox" value="Other" {...register('healthDisclosure')} className="mr-2" />Other</label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="btn bg-primary text-white hover:bg-primary/90 w-full mt-6 p-3 rounded-md shadow-lg"
                    >
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
