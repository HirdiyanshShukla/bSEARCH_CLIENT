import api from "../../../config/api";

export default {
  getMyBusinesses() {
    return api.get("/owner/my-businesses");
  },

  createAnnouncement(placeId, data) {
    return api.post(`/content/announcement/${placeId}`, data);
  },

  createItem(placeId, data) {
    return api.post(`/content/item/${placeId}`, data);
  },

  createPoll(placeId, data) {
    return api.post(`/content/poll/${placeId}`, data);
  }
};
