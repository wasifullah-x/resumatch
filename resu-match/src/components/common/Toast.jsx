import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <FiCheckCircle className="text-green-500" size={20} />,
        error: <FiAlertCircle className="text-red-500" size={20} />,
        info: <FiInfo className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 animate-slideInRight`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${bgColors[type]} shadow-lg min-w-[300px] max-w-md`}>
                <div className="flex-shrink-0">{icons[type]}</div>
                <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
