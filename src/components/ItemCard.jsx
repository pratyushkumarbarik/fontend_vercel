import React, { useState } from 'react';
import { MapPin, Clock, User, X } from 'lucide-react';
import { assetUrl } from '../utils/api';

const ItemCard = ({ item, showClaimButton = false, onClaim }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const imageSrc = item.image
    ? assetUrl(item.image)
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const closeModal = () => {
    setShowImageModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 bg-gray-100">
          <img
            src={imageSrc}
            alt={item.itemName}
            className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity duration-200"
            onClick={handleImageClick}
          />
          <div className="absolute inset-0 hover:bg-black hover:bg-opacity-10 transition-all duration-200 cursor-pointer" onClick={handleImageClick}></div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {item.status}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4">{item.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{item.foundLocation}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Found on {formatDate(item.createdAt)}</span>
            </div>
          </div>

          {item.status === 'Claimed' && item.claimedBy && (
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <div className="flex items-center text-sm text-blue-800 mb-1">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">Claimed by:</span>
              </div>
              <div className="text-sm text-blue-700">
                <p>{item.claimedBy.studentName}</p>
                <p>Roll No: {item.claimedBy.rollNo}</p>
              </div>
            </div>
          )}

          {showClaimButton && item.status === 'Available' && onClaim && (
            <button
              onClick={() => onClaim(item)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Mark as Claimed
            </button>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200"
              aria-label="Close image"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            
            <div className="p-4">
              <img
                src={imageSrc}
                alt={item.itemName}
                className="w-full h-auto max-h-[80vh] object-contain rounded-md"
              />
              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.itemName}
                </h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop click to close */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeModal}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default ItemCard;