import React, { useState, useEffect } from 'react';
import { Package, Users, Clock } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import ReportedItemCard from '../components/ReportedItemCard';
import ClaimModal from '../components/ClaimModal';
import { itemsAPI } from '../utils/api';

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [reportedItems, setReportedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, reportedResponse] = await Promise.all([
          itemsAPI.getAdminItems(),
          itemsAPI.getReportedItems()
        ]);
        setItems(itemsResponse.data);
        setReportedItems(reportedResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClaimItem = (item) => {
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  };

  const handleClaimSubmit = async (claimData) => {
    if (selectedItem) {
      try {
        const response = await itemsAPI.claimItem(selectedItem._id, claimData);
        const updatedItems = items.map(item => 
          item._id === selectedItem._id ? response.data : item
        );
        setItems(updatedItems);
      } catch (error) {
        console.error('Error claiming item:', error);
      }
    }
  };

  const handleApproveReported = async (reportedItem) => {
    try {
      const response = await itemsAPI.approveReportedItem(reportedItem._id);
      setItems([response.data.approved, ...items]);
      setReportedItems(reportedItems.map(item => 
        item._id === reportedItem._id ? response.data.reported : item
      ));
    } catch (error) {
      console.error('Error approving reported item:', error);
    }
  };

  const handleRejectReported = (reportedItem) => {
    setReportedItems(reportedItems.map(item => 
      item._id === reportedItem._id ? { ...item, status: 'Rejected' } : item
    ));
  };

  const availableItems = items.filter(item => item.status === 'Available');
  const claimedItems = items.filter(item => item.status === 'Claimed');
  const pendingReported = reportedItems.filter(item => item.status === 'Pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded_full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage lost and found items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available Items</p>
                <p className="text-2xl font-bold text-gray-900">{availableItems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Claimed Items</p>
                <p className="text-2xl font-bold text-gray-900">{claimedItems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReported.length}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Items Added by Admin</h2>
          {items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-500">Start by adding some found items to the system</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  showClaimButton={true}
                  onClaim={handleClaimItem}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reported Items by Students</h2>
          {reportedItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-gray-400 mx_auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reported items</h3>
              <p className="text-gray-500">Students haven't reported any found items yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportedItems.map((item) => (
                <ReportedItemCard
                  key={item._id}
                  item={item}
                  onApprove={handleApproveReported}
                  onReject={handleRejectReported}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <ClaimModal
        item={selectedItem}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmit={handleClaimSubmit}
      />
    </div>
  );
};

export default AdminDashboard;
