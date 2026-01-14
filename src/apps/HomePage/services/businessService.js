import apiClient from '../../../config/api';

const businessService = {
    // Search for businesses
    searchBusinesses: async (area, type) => {
        try {
            const response = await apiClient.get('/search', {
                params: { area, type },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Search failed' };
        }
    },

    // Get business profile by placeId
    getBusinessProfile: async (placeId) => {
        try {
            const response = await apiClient.get(`/business/${placeId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to load business profile' };
        }
    },

    // Claim a business (owner only)
    claimBusiness: async (placeId, businessEmail) => {
        try {
            const response = await apiClient.post('/owner/claim', {
                placeId,
                businessEmail,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Claim request failed' };
        }
    },

    // Verify claim with OTP (owner only)
    verifyClaim: async (placeId, otp) => {
        try {
            const response = await apiClient.post('/owner/verify-claim', {
                placeId,
                otp,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Claim verification failed' };
        }
    },

    // Update business information (owner only)
    updateBusiness: async (placeId, data) => {
        try {
            const response = await apiClient.put(`/owner/business/${placeId}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Business update failed' };
        }
    },
};

export default businessService;
