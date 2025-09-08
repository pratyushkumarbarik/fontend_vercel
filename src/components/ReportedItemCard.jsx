import React from 'react';
import { Clock, User, BookOpen, Hash } from 'lucide-react';
import { assetUrl } from '../utils/api';

const ReportedItemCard = ({ item, onApprove, onReject }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const imageSrc = item.image ? assetUrl(item.image) : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={imageSrc}
          alt={item.itemName}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : item.status === 'Approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {item.status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2" />
            <span>{item.studentName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Hash className="h-4 w-4 mr-2" />
            <span>{item.rollNo}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{item.branch}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Reported on {formatDate(item.createdAt)}</span>
          </div>
        </div>

        {item.status === 'Pending' && onApprove && onReject && (
          <div className="flex space-x-3">
            <button
              onClick={() => onApprove(item)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(item)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedItemCard;
