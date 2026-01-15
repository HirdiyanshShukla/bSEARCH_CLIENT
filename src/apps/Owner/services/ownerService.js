import api from "../../../config/api";

export default {
  // Business
  getMyBusinesses() {
    return api.get("/owner/my-businesses");
  },

  // Items
  createItem(data) {
    return api.post("/content/item", data);
  },

  getItems(placeId) {
    return api.get(`/content/item/${placeId}`);
  },

  deleteItem(itemId) {
    return api.delete(`/content/item/${itemId}`);
  },

  toggleItemAvailability(itemId, available) {
    return api.patch(`/content/item/${itemId}/availability`, { available });
  },

  // Offers
  createOffer(data) {
    return api.post("/content/offer", data);
  },

  getOffers(placeId) {
    return api.get(`/content/offer/${placeId}`);
  },

  deleteOffer(offerId) {
    return api.delete(`/content/offer/${offerId}`);
  },

  // Announcements
  createAnnouncement(data) {
    return api.post("/content/announcement", data);
  },

  getAnnouncements(placeId) {
    return api.get(`/content/announcement/${placeId}`);
  },

  deleteAnnouncement(announcementId) {
    return api.delete(`/content/announcement/${announcementId}`);
  },

  // Polls
  createPoll(data) {
    return api.post("/content/poll", data);
  },

  getPolls(placeId) {
    return api.get(`/content/poll/${placeId}`);
  },

  votePoll(pollId, optionIndex) {
    return api.post("/content/poll/vote", { pollId, optionIndex });
  },

  endPoll(pollId) {
    return api.patch(`/content/poll/${pollId}/end`);
  },

  deletePoll(pollId) {
    return api.delete(`/content/poll/${pollId}`);
  }
};
